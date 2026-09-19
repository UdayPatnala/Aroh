import { NextResponse } from "next/server";
import {
  CreateApiKeyRequestSchema,
  generateApiKey,
  mockApiKeyService,
  ApiKeyRecord
} from "@aroh/asdk";

function getRequestUserId(req: Request): string {
  const headerUserId = req.headers.get("x-user-id");
  if (headerUserId) return headerUserId;
  return "usr_developer_01"; // Default development sandbox identity
}

export async function GET(req: Request) {
  try {
    const userId = getRequestUserId(req);
    const keys = mockApiKeyService.listKeysByUser(userId);

    return NextResponse.json({
      keys,
      count: keys.length
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch developer API keys", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = getRequestUserId(req);
    const body = await req.json();

    const parsed = CreateApiKeyRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid API key request payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, environment, tier } = parsed.data;

    const result = mockApiKeyService.createKey({
      userId,
      name,
      environment,
      tier
    });

    // In a production Firestore deployment, we write hash-only record:
    // await adminDb.collection("developer_api_keys").doc(result.apiKeyRecord.id).set(result.apiKeyRecord);

    return NextResponse.json(
      {
        message: "API key generated successfully. Store the raw key securely — it will NOT be shown again.",
        apiKeyRecord: result.apiKeyRecord,
        rawKey: result.rawKey
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal error creating API key", details: err.message },
      { status: 500 }
    );
  }
}
