// File: /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Regex pattern for protected routes
const protectedPathnameRegex =
  /^\/(?:dashboard|settings|impact-stories|donor-recognition|active-campaigns|transparent-tracking|start-campaign|campaign\/.*\/donate|my-donations|support)/;

export async function middleware(request: NextRequest) {
  const isProtectedRoute = protectedPathnameRegex.test(
    request.nextUrl.pathname
  );

  // If it's not a protected route, allow the request
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get the wallet connection status from cookies or headers
  const isWalletConnected =
    request.cookies.get("wallet-connected")?.value === "true";
  const hasUserAccount =
    request.cookies.get("user-initialized")?.value === "true";

  // If wallet is not connected, redirect to connect wallet page
  if (!isWalletConnected) {
    return NextResponse.redirect(new URL("/connect-wallet", request.url));
  }

  // If user doesn't have an account, redirect to create account page
  if (!hasUserAccount) {
    return NextResponse.redirect(new URL("/create-account", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/impact-stories/:path*",
    "/donor-recognition/:path*",
    "/active-campaigns/:path*",
    "/transparent-tracking/:path*",
    "/start-campaign/:path*",
    "/campaigns/:path*/donate",
    "/my-donations/:path*",
    "/support/:path*",
  ],
};
