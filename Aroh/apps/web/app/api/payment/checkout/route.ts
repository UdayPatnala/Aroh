import { NextResponse } from "next/server";
import {
  CreateCheckoutSessionRequestSchema,
  mockPaymentService,
  purchaseSafetyService
} from "@aroh/asdk";

function getRequestUserId(req: Request): string {
  const headerUserId = req.headers.get("x-user-id");
  if (headerUserId) return headerUserId;
  return "user-id"; // Default sandbox user identity
}

export async function POST(req: Request) {
  try {
    const userId = getRequestUserId(req);

    // 1. HARD SERVER-SIDE ENFORCEMENT: Check adult eligibility BEFORE intent creation
    const eligibilityCheck = purchaseSafetyService.assertPurchaseEligible(userId);
    if (!eligibilityCheck.eligible) {
      return NextResponse.json(
        {
          error: eligibilityCheck.reason || "Account is not eligible to purchase Aros",
          status: eligibilityCheck.status,
          code: "PURCHASE_ELIGIBILITY_REJECTED"
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const parsed = CreateCheckoutSessionRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid checkout session request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const session = mockPaymentService.createCheckoutSession(userId, parsed.data);

    return NextResponse.json(
      {
        message: "Checkout session created successfully",
        session,
        checkoutUrl: session.checkoutUrl
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to create checkout session", details: err.message },
      { status: 500 }
    );
  }
}
