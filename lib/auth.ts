import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from './mongodb'
import User from '@/models/User'
import Activity from '@/models/Activity'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        await dbConnect()

        // 1. Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        // 2. Find user
        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        })

        if (!user) {
          throw new Error('No account found with this email')
        }

        // 3. Ensure password exists
        if (!user.password) {
          throw new Error('User has no password set')
        }

        // 4. Compare passwords
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) {
          throw new Error('Invalid password')
        }

        // 5. Log login activity
        await Activity.create({
          userId: user._id,
          action: 'login',
          metadata: { method: 'credentials' },
        })

        // 6. Return safe user object
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        ;(session.user as any).id = token.id
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
}