import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);
const isDemoMode =
  process.env.DEMO_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const middleware = isDemoMode
  ? () => NextResponse.next()
  : clerkMiddleware((auth, req) => {
      if (!isPublicRoute(req)) {
        auth().protect();
      }
    });

export default middleware;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};
