import { NextResponse } from "next/server";
import { z } from "zod";
import { mockWalletService, verifyMockToken, isMockEnv } from "@aroh/asdk";

const UpgradeInputSchema = z.object({
  level: z.enum(["basic", "pro", "enterprise"]),
  cost: z.number().nonnegative()
});

export async function POST(request: Request) {
  try {
    // 1. Verify Authorization Header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Missing Authorization header" } },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    let userId: string | null = null;

    if (isMockEnv) {
      // Development/mock: use the lightweight mock token verifier
      const decoded = verifyMockToken(token);
      if (!decoded) {
        return NextResponse.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Invalid or expired token" } },
          { status: 401 }
        );
      }
      userId = decoded.userId;
    } else {
      // Production: cryptographically verify the Firebase ID token signature
      try {
        const { adminAuth } = await import("../firebase-admin");
        const decodedToken = await adminAuth.verifyIdToken(token);
        // Firebase ID token subject = the user's UID
        userId = decodedToken.uid;
      } catch {
        return NextResponse.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Invalid or expired Firebase ID token" } },
          { status: 401 }
        );
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Could not determine user identity" } },
        { status: 401 }
      );
    }

    // 2. Validate request body
    const body = await request.json();
    const result = UpgradeInputSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Invalid inputs", details: result.error.format() } },
        { status: 400 }
      );
    }

    const { level, cost } = result.data;

    if (isMockEnv) {
      // 3a. Mock mode: use offline mock wallet service
      const data = await mockWalletService.upgradeMembership(userId, level, cost);
      return NextResponse.json({
        success: true,
        data: { profile: data.profile, wallet: data.wallet, transaction: data.transaction }
      });
    } else {
      // 3b. Production mode: use Firebase Admin SDK (bypasses Firestore security rules)
      const { adminDb } = await import("../firebase-admin");

      const walletRef = adminDb.collection("wallets").doc(userId);
      const profileRef = adminDb.collection("profiles").doc(userId);
      const txId = "t-" + Math.random().toString(36).substr(2, 9);
      const txRef = adminDb.collection("transactions").doc(txId);

      const result = await adminDb.runTransaction(async (transaction) => {
        const [walletSnap, profileSnap] = await Promise.all([
          transaction.get(walletRef),
          transaction.get(profileRef)
        ]);

        if (!walletSnap.exists) throw new Error("Wallet not found");
        if (!profileSnap.exists) throw new Error("Profile not found");

        const walletData = walletSnap.data()!;
        if (walletData.balance < cost) throw new Error("Insufficient Aros balance");

        const newBalance = walletData.balance - cost;
        const timestamp = new Date().toISOString();

        const updatedWallet = { ...walletData, balance: newBalance, updatedAt: timestamp };
        const updatedProfile = { ...profileSnap.data()!, membershipLevel: level, updatedAt: timestamp };
        const newTx = {
          id: txId, userId, amount: -cost, type: "membership_upgrade",
          description: `Membership upgrade to ${level.toUpperCase()}`,
          timestamp
        };

        transaction.update(walletRef, { balance: newBalance, updatedAt: timestamp });
        transaction.update(profileRef, { membershipLevel: level, updatedAt: timestamp });
        transaction.set(txRef, newTx);

        return { profile: updatedProfile, wallet: updatedWallet, transaction: newTx };
      });

      return NextResponse.json({ success: true, data: result });
    }

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: err.message || "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
