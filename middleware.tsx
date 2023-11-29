import { authMiddleware } from "@clerk/nextjs";
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
    publicRoutes: [
        '/',
        '/api/webhook',
        '/question/:slug/:id',
        '/tags',
        '/tags/:tag',
        '/profile/:username',
        '/community',
        '/community/:id',
        '/jobs'
        
    ],
    ignoredRoutes:[
      '/api/webhook',
      '/api/chatbot',
      
    ]
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
 