import { NextResponse } from "next/server";
import { PLATFORM_VERSION } from "@aroh/asdk";

export async function GET() {
  return NextResponse.json({
    status: "UP",
    version: PLATFORM_VERSION,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    services: {
      auth: "mock-active",
      database: "mock-active",
      walletLedger: "active"
    }
  });
}
