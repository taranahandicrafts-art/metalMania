import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/admin/forgot-password'];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (pathname.startsWith('/admin') && !PUBLIC_ROUTES.includes(pathname)) {
      if (!token) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('callbackUrl', encodeURI(pathname));
        return NextResponse.redirect(loginUrl);
      }

      if (token.role === 'manager' && !pathname.startsWith('/admin/orders') && pathname !== '/admin') {
        if (pathname.startsWith('/admin')) {
          const allowed = ['/admin/orders', '/admin/inventory', '/admin'];
          const isAllowed = allowed.some((p) => pathname.startsWith(p));
          if (!isAllowed) {
            return NextResponse.redirect(new URL('/admin/orders', req.url));
          }
        }
      }
    }

    if (pathname === '/login' && token) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (PUBLIC_ROUTES.includes(pathname)) return true;
        if (!pathname.startsWith('/admin')) return true;
        return !!token;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  },
);

export const config = {
  matcher: ['/admin/:path*'],
};
