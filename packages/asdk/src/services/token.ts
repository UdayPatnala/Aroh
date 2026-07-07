/**
 * AROH Platform Cryptographic Token Service (Mock Mode)
 * Implements a pure-TypeScript JWT-like sign/verify mechanism
 * with zero dependencies, compatible with both Browser and Node.js.
 */

function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

export function signMockToken(userId: string, role: string, secret: string = "aroh-platform-secret-key-12345"): string {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const payload = JSON.stringify({ userId, role, exp: Date.now() + 24 * 60 * 60 * 1000 });
  
  const toB64 = (s: string) => {
    if (typeof window !== "undefined" && typeof btoa !== "undefined") {
      return btoa(unescape(encodeURIComponent(s)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    }
    return Buffer.from(s, "utf8")
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const headerB64 = toB64(header);
  const payloadB64 = toB64(payload);
  const signature = simpleHash(`${headerB64}.${payloadB64}.${secret}`);
  
  return `${headerB64}.${payloadB64}.${signature}`;
}

export function verifyMockToken(token: string, secret: string = "aroh-platform-secret-key-12345"): { userId: string; role: string } | null {
  try {
    const [headerB64, payloadB64, signature] = token.split(".");
    if (!headerB64 || !payloadB64 || !signature) return null;
    
    const expectedSignature = simpleHash(`${headerB64}.${payloadB64}.${secret}`);
    if (signature !== expectedSignature) return null;
    
    const fromB64 = (s: string) => {
      const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4);
      if (typeof window !== "undefined" && typeof atob !== "undefined") {
        return decodeURIComponent(escape(atob(b64)));
      }
      return Buffer.from(b64, "base64").toString("utf8");
    };

    const payloadStr = fromB64(payloadB64);
    const payload = JSON.parse(payloadStr);
    
    if (payload.exp && payload.exp < Date.now()) {
      return null;
    }
    
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}
