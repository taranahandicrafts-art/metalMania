import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/admin/forgot-password'];

// Storefront-facing API endpoints that do not require an authenticated admin
// session. Everything else under /api is treated as admin-only. Rules are
// method-aware so that, e.g., anyone can read published products (GET) while
// only authenticated staff can mutate them.
const PUBLIC_API: Array<{ prefix: string; methods?: string[] }> = [
  { prefix: '/api/auth' }, // NextAuth handlers (all methods)
  { prefix: '/api/webhooks' }, // provider-signed webhooks (verified in-route)
  { prefix: '/api/products/search', methods: ['GET'] },
  { prefix: '/api/products', methods: ['GET'] },
  { prefix: '/api/categories', methods: ['GET'] },
  { prefix: '/api/reviews', methods: ['GET', 'POST'] },
  { prefix: '/api/settings', methods: ['GET'] },
  { prefix: '/api/contact', methods: ['POST'] },
  { prefix: '/api/newsletter', methods: ['POST'] },
  { prefix: '/api/coupons/validate', methods: ['POST'] },
  { prefix: '/api/analytics', methods: ['POST'] },
];

function isPublicApi(pathname: string, method: string): boolean {
  return PUBLIC_API.some(
    (rule) => pathname.startsWith(rule.prefix) && (!rule.methods || rule.methods.includes(method)),
  );
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // ── API access control (returns JSON 401, never an HTML redirect) ──
    if (pathname.startsWith('/api')) {
      if (isPublicApi(pathname, req.method)) return NextResponse.next();
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.next();
    }

    // ── Already authenticated: skip the login page ──
    if (pathname === '/login' && token) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // ── Role-based restrictions inside the admin area ──
    if (token?.role === 'manager' && pathname.startsWith('/admin')) {
      const isAllowed =
        pathname === '/admin' ||
        pathname.startsWith('/admin/orders') ||
        pathname.startsWith('/admin/inventory');
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/admin/orders', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // API routes are gated inside the middleware fn so we can return JSON 401s
        // instead of redirecting API clients to the HTML login page.
        if (pathname.startsWith('/api')) return true;
        if (PUBLIC_ROUTES.includes(pathname)) return true;
        if (!pathname.startsWith('/admin')) return true;
        return !!token;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  },
);

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
