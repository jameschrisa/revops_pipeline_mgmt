import { NextRequest, NextResponse } from "next/server";

// Demo workspace API key (Stripe-style, per SS14).
export const DEMO_API_KEY = "rok_demo_meridian";

export function apiError(
  status: number,
  type: string,
  message: string,
  code: string,
  param?: string
) {
  return NextResponse.json(
    { error: { type, message, code, ...(param ? { param } : {}) } },
    { status }
  );
}

// Bearer-token check (NFR: unauthenticated requests return 401).
export function requireAuth(req: NextRequest): NextResponse | null {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return apiError(
      401,
      "authentication_error",
      "Missing bearer token. Use: Authorization: Bearer rok_...",
      "authentication_required"
    );
  }
  if (token !== DEMO_API_KEY) {
    return apiError(401, "authentication_error", "Invalid API key.", "invalid_api_key");
  }
  return null;
}
