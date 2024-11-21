import { createClient } from '@/utils/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

// Route configuration for better management
const ROUTES = {
  PUBLIC: ['','/login', '/auth/callback', '/auth/confirm', '/error'],
  AUTH_REQUIRED: ['/private'],
  ADMIN_REQUIRED: ['/admin'],
  DEFAULT_AUTH_ROUTE: '/login',
  DEFAULT_PUBLIC_ROUTE: '',
  ERROR_ROUTE: '/error',
} as const

type RouteAccess = {
  isPublic: boolean
  requiresAuth: boolean
  requiresAdmin: boolean
}

function getRouteAccess(pathname: string): RouteAccess {
  // Check if route is explicitly public
  const isPublic = ROUTES.PUBLIC.some(route => 
    pathname === route || pathname.startsWith(`${route}`))

  // Check if route requires authentication
  const requiresAuth = ROUTES.AUTH_REQUIRED.some(route => 
    pathname === route || pathname.startsWith(`${route}`))

  // Check if route requires admin access
  const requiresAdmin = ROUTES.ADMIN_REQUIRED.some(route => 
    pathname === route || pathname.startsWith(`${route}`))

  return {
    isPublic,
    requiresAuth,
    requiresAdmin,
  }
}

function getRedirectUrl(request: NextRequest, isAuthenticated: boolean): string | null {
  const { pathname } = request.nextUrl
  const { isPublic, requiresAuth, requiresAdmin } = getRouteAccess(pathname)

  // print the route access and the route specs
  console.log('Route specs:', { pathname, isAuthenticated, isPublic, requiresAuth, requiresAdmin })


  // Handle authentication redirects
  if (!isAuthenticated && requiresAuth) {
    return ROUTES.DEFAULT_PUBLIC_ROUTE
  }


  // TODO: Add admin check when implementing admin roles
  if (requiresAdmin) {
    // Implement admin role check here
    return ROUTES.ERROR_ROUTE
  }

  return null
}

export async function middleware(request: NextRequest) {
  try {
    const supabase = await createClient()
    console.log('middleware')

    // Check authentication status
    const { data: { session } } = await supabase.auth.getSession()
    const isAuthenticated = !!session

    // Check if redirect is needed
    const redirectUrl = getRedirectUrl(request, isAuthenticated)
    if (redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    console.log('no redirect needed')
    // Continue with the request if no redirect is needed
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL(ROUTES.ERROR_ROUTE, request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}