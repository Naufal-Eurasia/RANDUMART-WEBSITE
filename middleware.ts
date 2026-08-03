import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // optional custom logic
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Hanya wajibkan token/role khusus untuk path /admin/*
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN';
        }

        // Path lain public atau auth biasa
        return true;
      }
    }
  }
);

export const config = {
  matcher: ['/admin/:path*', '/account/:path*']
};