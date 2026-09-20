import { NextResponse } from "next/server";
import { mockPaymentService } from "@aroh/asdk";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("stripe-signature") || undefined;
    const body = await req.json();

    const result = await mockPaymentService.handleStripeWebhook(body, signature);

    return NextResponse.json({
      received: true,
      handled: result.handled,
      alreadyProcessed: result.alreadyProcessed,
      session: result.session
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Webhook signature verification or clearance failed", details: err.message },
      { status: 400 }
    );
  }
}
