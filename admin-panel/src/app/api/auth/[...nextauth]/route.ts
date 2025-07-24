import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow Fred's email to access the admin panel
      const allowedEmail = process.env.ADMIN_EMAIL || 'fred@avanticlassic.com'
      
      console.log('=== DEBUG SIGNIN ===')
      console.log('User email:', user.email)
      console.log('Allowed email:', allowedEmail)
      console.log('Match:', user.email === allowedEmail)
      console.log('==================')
      
      if (user.email === allowedEmail) {
        return true
      }
      
      // Deny access for any other email
      return false
    },
    async session({ session, token }) {
      // Add user info to session
      return session
    },
    async jwt({ token, user }) {
      // Persist user info in JWT
      if (user) {
        token.email = user.email
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }