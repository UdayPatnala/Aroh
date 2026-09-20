import { NextResponse } from "next/server";
import {
  CreateWebhookEndpointRequestSchema,
  mockWebhookService
} from "@aroh/asdk";

function getRequestUserId(req: Request): string {
  const headerUserId = req.headers.get("x-user-id");
  if (headerUserId) return headerUserId;
  return "usr_developer_01"; // Default development sandbox identity
}

export async function GET(req: Request) {
  try {
    const userId = getRequestUserId(req);
    const endpoints = mockWebhookService.listEndpoints(userId);

    return NextResponse.json({
      endpoints,
      count: endpoints.length
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch registered webhooks", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = getRequestUserId(req);
    const body = await req.json();

    const parsed = CreateWebhookEndpointRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid webhook registration payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { endpoint, secret } = mockWebhookService.registerEndpoint(userId, parsed.data);

    return NextResponse.json(
      {
        message: "Webhook endpoint registered successfully. Store the secret securely for signature verification.",
        endpoint,
        secret
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal error registering webhook endpoint", details: err.message },
      { status: 500 }
    );
  }
}
