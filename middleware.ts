import NextAuth from "next-auth";

// We create a lightweight, Edge-compatible instance of NextAuth right here.
// Notice we do NOT import `@/auth` or Prisma!
const { auth } = NextAuth({
  providers: [], // No database providers needed for the middleware
  pages: {
    signIn: "/auth/signin",
  },
});

export default auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/signin (your login page)
     * - auth/signup (your signup page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth/signin|auth/signup).*)",
  ],
};