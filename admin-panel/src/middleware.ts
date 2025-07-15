import { NextRequest, NextResponse } from 'next/server';
import { parseSessionToken } from '@/lib/session';

// Routes that are restricted to super admins only
const SUPER_ADMIN_ROUTES = [
  '/dashboard/settings',
  '/dashboard/users',
  '/dashboard/audit',
  '/dashboard/system'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and non-dashboard routes
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon.ico') ||
      !pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }
  
  // Get session from cookies
  const sessionToken = request.cookies.get('admin-session')?.value;
  
  if (!sessionToken) {
    // No session, redirect to login
    const loginUrl = new URL('/auth/signin', request.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  
  // Parse session token
  const sessionData = parseSessionToken(sessionToken);
  
  if (!sessionData) {
    // Invalid or expired session, redirect to login
    const loginUrl = new URL('/auth/signin', request.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  
  const user = sessionData.user;
  
  // Check if user is trying to access super admin routes
  const isAccessingSuperAdminRoute = SUPER_ADMIN_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  if (isAccessingSuperAdminRoute && user.role !== 'super_admin') {
    // Redirect company admins away from restricted routes
    const dashboardUrl = new URL('/dashboard?error=insufficient_permissions', request.nextUrl.origin);
    return NextResponse.redirect(dashboardUrl);
  }
  
  // Add user info to request headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-email', user.email);
  requestHeaders.set('x-user-role', user.role);
  requestHeaders.set('x-user-name', user.name);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/admin/:path*'
  ]
};