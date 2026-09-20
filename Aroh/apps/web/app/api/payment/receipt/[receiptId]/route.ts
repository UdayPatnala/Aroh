import { NextResponse } from "next/server";
import { purchaseSafetyService } from "@aroh/asdk";

function getRequestUserId(req: Request): string {
  const headerUserId = req.headers.get("x-user-id");
  if (headerUserId) return headerUserId;
  return "user-id";
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ receiptId: string }> }
) {
  try {
    const { receiptId } = await params;
    const userId = getRequestUserId(req);

    let receipt = purchaseSafetyService.getReceipt(receiptId);
    if (!receipt) {
      // Fallback: check if receiptId was passed as transaction ID
      receipt = purchaseSafetyService.getReceiptByTransactionId(receiptId);
    }

    if (!receipt) {
      return NextResponse.json(
        { error: "Transaction receipt not found", receiptId },
        { status: 404 }
      );
    }

    // Ensure the requester owns the receipt unless operator/admin
    if (receipt.user_id !== userId && userId !== "admin-id" && userId !== "operator-id") {
      return NextResponse.json(
        { error: "Unauthorized access to transaction receipt" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      receipt
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to retrieve transaction receipt", details: err.message },
      { status: 500 }
    );
  }
}
