import { NextResponse } from "next/server";
import { z } from "zod";
import { mockWalletService } from "@aroh/asdk";

const RewardInputSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  description: z.string().min(3, "Description must be at least 3 characters")
});

export async function POST(request: Request) {
  try {
    // 1. Verify Authorization Header (Simulation of Backend Auth check)
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Missing Authorization header" } },
        { status: 401 }
      );
    }

    // Auth header is expected as "Bearer <userId>:<role>"
    const token = authHeader.replace("Bearer ", "");
    const [userId, role] = token.split(":");

    // 2. Perform RBAC validation on the Backend
    if (role !== "admin") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Only administrators can issue reward adjustments" } },
        { status: 403 }
      );
    }

    // 3. Validate Request Payload using Zod
    const body = await request.json();
    const result = RewardInputSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Invalid payload input rules", details: result.error.format() } },
        { status: 400 }
      );
    }

    const { userId: targetUserId, amount, description } = result.data;

    // 4. Execute balance increment via transactional ledger
    const data = await mockWalletService.creditWallet(targetUserId, amount, description);

    return NextResponse.json({
      success: true,
      data: {
        wallet: data.wallet,
        transaction: data.transaction
      }
    });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: err.message || "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
