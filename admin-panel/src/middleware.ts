import { auth } from '@/auth'

export default auth((req) => {
  // req.auth contains the session
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    const newUrl = new URL('/auth/signin', req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/admin/:path*'
  ]
}