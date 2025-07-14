import { auth } from '@/auth'
import { createClient } from '@/lib/supabase'

// Routes that are restricted to super admins only
const SUPER_ADMIN_ROUTES = [
  '/dashboard/settings',
  '/dashboard/users',
  '/dashboard/audit',
  '/dashboard/system'
]

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  
  // Check if user is authenticated
  if (!req.auth && pathname.startsWith('/dashboard')) {
    const newUrl = new URL('/auth/signin', req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
  
  // For authenticated users, check role-based access
  if (req.auth && pathname.startsWith('/dashboard')) {
    try {
      // Get user role from database
      const supabase = createClient()
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('role, status')
        .eq('id', req.auth.user?.id)
        .single()
      
      if (error || !adminUser) {
        console.error('Error fetching admin user:', error)
        const newUrl = new URL('/auth/signin', req.nextUrl.origin)
        return Response.redirect(newUrl)
      }
      
      // Check if user account is active
      if (adminUser.status !== 'active') {
        const newUrl = new URL('/auth/error?error=AccountInactive', req.nextUrl.origin)
        return Response.redirect(newUrl)
      }
      
      // Check if user is trying to access super admin routes
      const isAccessingSuperAdminRoute = SUPER_ADMIN_ROUTES.some(route => 
        pathname.startsWith(route)
      )
      
      if (isAccessingSuperAdminRoute && adminUser.role !== 'super_admin') {
        // Redirect company admins away from restricted routes
        const newUrl = new URL('/dashboard?error=insufficient_permissions', req.nextUrl.origin)
        return Response.redirect(newUrl)
      }
      
      // Log access attempts for audit (for API routes)
      if (pathname.startsWith('/api/admin')) {
        // This will be handled by the API route handlers
        // to avoid double logging
      }
      
    } catch (error) {
      console.error('Middleware error:', error)
      const newUrl = new URL('/auth/signin', req.nextUrl.origin)
      return Response.redirect(newUrl)
    }
  }
  
  // Allow access if all checks pass
  return
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/admin/:path*'
  ]
}