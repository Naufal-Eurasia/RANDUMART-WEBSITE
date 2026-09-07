import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // optional custom logic
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (token?.error === "UserDeleted") return false;

        // /admin hanya untuk ADMIN
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN';
        }

        // /account hanya untuk user yang sudah login (role apapun)
        if (req.nextUrl.pathname.startsWith('/account')) {
          return !!token;
        }

        // Path lain publik
        return true;
      }
    }
  }
);

export const config = {
  matcher: ['/admin/:path*', '/account/:path*']
};