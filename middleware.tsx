import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhook",
    "/api/uploadthing",
    "/question/:slug/:id",
    "/question/:slug/:id/opengraph-image-:imageId",
    "/tags",
    "/tags/:tag",
    "/tags/:tag/opengraph-image-:imageId",
    "/profile/:username",
    "/profile/:username/opengraph-image-:imageId",
    "/community",
    "/community/:id",
    "/blogs",
    "/blogs/:id",

  ],
  ignoredRoutes: ["/api/webhook", "/api/chatbot", "/api/uploadthing"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
