import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Example: allow all requests
  return NextResponse.next();
}

// Optional: define paths where middleware runs
export const config = {
  matcher: ["//dashboard/:path*"], // runs middleware on dashboard routes
};
