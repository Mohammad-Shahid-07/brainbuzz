import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return NextResponse.rewrite(new URL("/", request.url));
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ["/profile"],
};
