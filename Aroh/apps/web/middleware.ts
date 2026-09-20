import { NextResponse, type NextRequest } from "next/server";
import { extractOrCreateTraceContext } from "@aroh/asdk/src/tracing";

export function middleware(request: NextRequest) {
  // Extract or generate W3C compliant traceparent context
  const incomingTraceparent = request.headers.get("traceparent");
  const traceContext = extractOrCreateTraceContext(incomingTraceparent);

  // Propagate traceparent downstream to API route handlers and server actions
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("traceparent", traceContext.raw);
  requestHeaders.set("x-trace-id", traceContext.traceId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  // Attach traceparent and x-trace-id to outgoing response for client observability
  response.headers.set("traceparent", traceContext.raw);
  response.headers.set("x-trace-id", traceContext.traceId);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all application and API paths, excluding static Next.js assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
