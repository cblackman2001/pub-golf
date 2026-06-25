import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from './lib/auth'; // Careful: we run edge runtime here mostly, jose is edge compatible. Wait, `verifySession` uses cookies from `next/headers` which is fine in Edge but we might need to parse from request. Let's write a simple middleware verification.
// Wait, middleware is slightly different for reading cookies.

import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  // Routes to protect
  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith('/admin');
  const isProtectedRoute = path.startsWith('/pubs') || path.startsWith('/leaderboard') || isAdminRoute;

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session');
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key_for_dev_pub_golf_2026";
    const key = new TextEncoder().encode(SECRET_KEY);
    
    const { payload } = await jwtVerify(sessionCookie.value, key, {
      algorithms: ["HS256"],
    });

    // Check Role
    if (isAdminRoute && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/pubs', request.url));
    }

    return NextResponse.next();
  } catch (err) {
    // Invalid token
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
