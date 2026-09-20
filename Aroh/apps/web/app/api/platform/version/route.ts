import { NextResponse } from "next/server";
import { getPlatformVersion } from "@aroh/asdk";

export const dynamic = "force-static";

export async function GET() {
  const versionInfo = getPlatformVersion();
  return NextResponse.json(
    {
      success: true,
      data: versionInfo,
      meta: {
        governanceFormat: "A.BC.DE.F",
        ecosystem: "AROH Open Source",
        documentation: "/docs/VERSION_CONTROLLER.md"
      }
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
      }
    }
  );
}
