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
    const eligibility = purchaseSafetyService.getUserEligibility(userId);
    const assertion = purchaseSafetyService.assertPurchaseEligible(userId);

    return NextResponse.json({
      userId,
      accountAgeStatus: eligibility.accountAgeStatus,
      isAdult: eligibility.isAdult,
      eligible: assertion.eligible,
      status: assertion.status,
      message: assertion.reason || "Account is eligible to purchase Aros"
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to evaluate purchase eligibility", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = getRequestUserId(req);
    const body = await req.json();
    const { status, verificationMethod } = body;

    if (!status) {
      return NextResponse.json({ error: "Missing required status field" }, { status: 400 });
    }

    const updated = purchaseSafetyService.setUserEligibility(
      userId,
      status,
      verificationMethod || "self_attestation"
    );

    return NextResponse.json({
      message: "Eligibility state updated successfully",
      eligibility: updated
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to update eligibility state", details: err.message },
      { status: 500 }
    );
  }
}
