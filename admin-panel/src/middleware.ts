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
  
  // For authenticated users, check if they're authorized
  if (req.auth && pathname.startsWith('/dashboard')) {
    try {
      // Check if user email is authorized
      const userEmail = req.auth.user?.email
      const allowedEmail = process.env.ADMIN_EMAIL || 'carloszamalloa@gmail.com'
      
      if (userEmail !== allowedEmail) {
        console.error('Unauthorized email access attempt:', userEmail)
        const newUrl = new URL('/auth/signin', req.nextUrl.origin)
        return Response.redirect(newUrl)
      }
      
      // Try to get user role from database (optional for now)
      try {
        const supabase = createClient()
        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('role, status')
          .eq('email', userEmail)
          .single()
        
        if (adminUser) {
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
        }
        // If admin_users table doesn't exist or user not found, allow access for authorized email
      } catch (dbError) {
        console.log('Database not available, allowing access for authorized email:', userEmail)
        // Allow access if database is not available but email is authorized
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