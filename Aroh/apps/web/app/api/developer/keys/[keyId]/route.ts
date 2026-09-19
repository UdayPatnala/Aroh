import { NextResponse } from "next/server";
import { mockApiKeyService } from "@aroh/asdk";

function getRequestUserId(req: Request): string {
  const headerUserId = req.headers.get("x-user-id");
  if (headerUserId) return headerUserId;
  return "usr_developer_01";
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ keyId: string }> }
) {
  try {
    const { keyId } = await params;
    const userId = getRequestUserId(req);
    const key = mockApiKeyService.getKeyById(keyId);

    if (!key || key.userId !== userId) {
      return NextResponse.json(
        { error: "API key not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ key });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to retrieve API key", details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ keyId: string }> }
) {
  try {
    const { keyId } = await params;
    const userId = getRequestUserId(req);

    const revoked = mockApiKeyService.revokeKey(keyId, userId);
    if (!revoked) {
      return NextResponse.json(
        { error: "API key not found or unauthorized for revocation" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "API key revoked irreversibly",
      key: revoked
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to revoke API key", details: err.message },
      { status: 500 }
    );
  }
}
