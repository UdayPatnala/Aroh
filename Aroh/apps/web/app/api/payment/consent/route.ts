import { NextResponse } from "next/server";
import { purchaseSafetyService, PurchaseConsentRecordSchema } from "@aroh/asdk";

function getRequestUserId(req: Request): string {
  const headerUserId = req.headers.get("x-user-id");
  if (headerUserId) return headerUserId;
  return "user-id";
}

export async function POST(req: Request) {
  try {
    const userId = getRequestUserId(req);
    const body = await req.json();

    const consentData = {
      ...body,
      user_id: userId
    };

    const consent = purchaseSafetyService.recordPurchaseConsent(consentData);

    return NextResponse.json(
      {
        message: "Purchase consent recorded successfully",
        consent
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to record purchase consent", details: err.message },
      { status: 400 }
    );
  }
}
