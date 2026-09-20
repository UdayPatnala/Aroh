import { NextResponse } from "next/server";
import { purchaseSafetyService } from "@aroh/asdk";

function getRequestUserId(req: Request): string {
  const headerUserId = req.headers.get("x-user-id");
  if (headerUserId) return headerUserId;
  return "user-id";
}

export async function GET(req: Request) {
  try {
    const userId = getRequestUserId(req);
    const disputes = purchaseSafetyService.getUserDisputes(userId);

    return NextResponse.json({
      success: true,
      count: disputes.length,
      disputes
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to retrieve disputes", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = getRequestUserId(req);
    const body = await req.json();
    const { transactionId, reason, notes } = body;

    if (!transactionId || typeof transactionId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid transactionId parameter" },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== "string" || reason.trim().length < 5) {
      return NextResponse.json(
        { error: "A valid dispute reason of at least 5 characters is required" },
        { status: 400 }
      );
    }

    const dispute = purchaseSafetyService.recordDispute(
      transactionId,
      notes ? `${reason} — ${notes}` : reason
    );

    return NextResponse.json({
      success: true,
      message: "Dispute recorded successfully and routed to compliance review queue",
      dispute
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to submit transaction dispute", details: err.message },
      { status: 500 }
    );
  }
}
