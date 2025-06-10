/* eslint-disable */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createGraphQLClientFactory from './lib/graphql-client-factory';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  try {
    if (req.nextUrl.pathname === '/401') {
      return NextResponse.next();
    }

    const fileExtensionPattern = /\.(jpg|jpeg|png|gif|svg|webp|ico|js|jsx|ts|tsx|mjs|css|woff|woff2|ttf|map)$/i;
    if (fileExtensionPattern.test(req.nextUrl.pathname)) {
      return NextResponse.next();
    }

    // Get user role from NextAuth session token
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET || "a-secure-random-string-for-development"
    });
    
    // Extract user roles from token
    const userRoles = token?.roles || [];
    const userRole = Array.isArray(userRoles) ? userRoles[0] : userRoles;
    const homeQuery = process.env.SITECORE_GRAPHQL_HOME_QUERY || "/sitecore/content/demo/demo/Home";

    // Normalize path by removing trailing slash and replacing hyphens with spaces
    let path = homeQuery + req.nextUrl.pathname; 
    path = path.replace(/\/$/, '').replace(/-/g, ' '); 

    console.log(`User role from cookie: ${userRole}`);
    console.log(`Request path: ${path}`);
    console.log(`User roles from token: ${JSON.stringify(userRoles)}`);

    // Query for page permissions using the GraphQL client
    const result = await createGraphQLClientFactory().request<{
      item: {
        allowedRoles?: {
          jsonValue: Array<{
            name: string;
            displayName: string;
          }>;
        };
      };
    }>(`
      query GetPageRoles($path: String!, $language: String!) {
        item(path: $path, language: $language) {
          allowedRoles: field(name: "AllowedRoles") {
            jsonValue
          }
        }
      }
    `, { path, language: "en" });
    
    console.log(`Checking permissions for path: ${path}`);
    console.log('GraphQL result:', result);

    // Extract roles and check permissions
    const allowedRoles = result?.item?.allowedRoles?.jsonValue?.map(role => role.name) || [];

    console.log(`Allowed roles for ${path}:`, allowedRoles);
    
    // If roles are specified but user doesn't have any of them, redirect to unauthorized
    if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
      console.log(`Access denied to ${path} - required roles: ${allowedRoles.join(', ')}`);
      return NextResponse.redirect(new URL('/401', req.url));
    }
    
    // Allow access
    return NextResponse.next();
  } catch (error) {
    // Log the error but allow the request to proceed to avoid blocking all site access
    console.error('Error in authorization middleware:', error);
    return NextResponse.next();
  }
}

export const config = {
  /*
   * Match all paths except for:
   * 1. /api routes
   * 2. /_next (Next.js internals)
   * 3. /sitecore/api (Sitecore API routes)
   * 4. /- (Sitecore media)
   * 5. /healthz (Health check)
   * 6. /feaas-render (FEaaS render)
   * 7. all root files inside /public
   * 8. /401 page (to avoid redirect loops)
   */
  matcher: [
    '/',
    '/((?!api/|_next/|401|feaas-render|healthz|sitecore/api/|-/|favicon.ico|sc_logo.svg).*)',
  ],
};
