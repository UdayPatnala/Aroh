import { NextResponse } from "next/server";
import { z } from "zod";
import { mockWalletService, verifyMockToken, isMockEnv } from "@aroh/asdk";

const RewardInputSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  description: z.string().min(3, "Description must be at least 3 characters")
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
    let role: string | null = null;

    if (isMockEnv) {
      // Development/mock: use the lightweight mock token verifier
      const decoded = verifyMockToken(token);
      if (!decoded) {
        return NextResponse.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Invalid or expired token" } },
          { status: 401 }
        );
      }
      role = decoded.role;
    } else {
      // Production: cryptographically verify the Firebase ID token signature
      try {
        const { adminAuth } = await import("../../firebase-admin");
        const decodedToken = await adminAuth.verifyIdToken(token);
        // Custom claims set by Firebase Admin (e.g., via setCustomUserClaims)
        role = (decodedToken as any).role ?? decodedToken.email ?? "user";
      } catch {
        return NextResponse.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Invalid or expired Firebase ID token" } },
          { status: 401 }
        );
      }
    }

    // 2. RBAC: only admins can issue reward adjustments
    if (role !== "admin") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Only administrators can issue reward adjustments" } },
        { status: 403 }
      );
    }

    // 3. Validate request payload with Zod
    const body = await request.json();
    const result = RewardInputSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Invalid payload input rules", details: result.error.format() } },
        { status: 400 }
      );
    }

    const { userId: targetUserId, amount, description } = result.data;

    if (isMockEnv) {
      // 4a. Mock mode: use offline mock wallet service
      const data = await mockWalletService.creditWallet(targetUserId, amount, description);
      return NextResponse.json({
        success: true,
        data: { wallet: data.wallet, transaction: data.transaction }
      });
    } else {
      // 4b. Production mode: use Firebase Admin SDK (bypasses Firestore security rules)
      const { adminDb } = await import("../../firebase-admin");

      const walletRef = adminDb.collection("wallets").doc(targetUserId);
      const txId = "t-" + Math.random().toString(36).substr(2, 9);
      const txRef = adminDb.collection("transactions").doc(txId);

      const result = await adminDb.runTransaction(async (transaction) => {
        const walletSnap = await transaction.get(walletRef);
        if (!walletSnap.exists) throw new Error("Wallet not found");

        const walletData = walletSnap.data()!;
        const newBalance = walletData.balance + amount;
        const timestamp = new Date().toISOString();

        const updatedWallet = { ...walletData, balance: newBalance, updatedAt: timestamp };
        const newTx = {
          id: txId, userId: targetUserId, amount, type: "reward",
          description, timestamp
        };

        transaction.update(walletRef, { balance: newBalance, updatedAt: timestamp });
        transaction.set(txRef, newTx);

        return { wallet: updatedWallet, transaction: newTx };
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
