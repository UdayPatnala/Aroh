import { NextResponse } from "next/server";
import { mockWebhookService } from "@aroh/asdk";

function getRequestUserId(req: Request): string {
  const headerUserId = req.headers.get("x-user-id");
  if (headerUserId) return headerUserId;
  return "usr_developer_01";
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  try {
    const { webhookId } = await params;
    const userId = getRequestUserId(req);
    const endpoint = mockWebhookService.getEndpoint(userId, webhookId);

    if (!endpoint) {
      return NextResponse.json(
        { error: "Webhook endpoint not found or unauthorized" },
        { status: 404 }
      );
    }

    const deliveryLogs = mockWebhookService.getDeliveryLogs(webhookId);

    return NextResponse.json({
      endpoint,
      deliveryLogs,
      deliveryCount: deliveryLogs.length
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to retrieve webhook endpoint", details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  try {
    const { webhookId } = await params;
    const userId = getRequestUserId(req);

    const deleted = mockWebhookService.deleteEndpoint(userId, webhookId);
    if (!deleted) {
      return NextResponse.json(
        { error: "Webhook endpoint not found or unauthorized for deletion" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Webhook endpoint removed successfully",
      webhookId
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to delete webhook endpoint", details: err.message },
      { status: 500 }
    );
  }
}
