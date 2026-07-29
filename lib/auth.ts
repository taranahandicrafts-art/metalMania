import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { UserRole } from '@/types';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      permissions: string[];
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    permissions: string[];
  }
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.warn('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables for admin authentication');
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
          throw new Error('Admin credentials not configured');
        }

        const isValidEmail = credentials.email.toLowerCase() === ADMIN_EMAIL;
        const isValidPassword = credentials.password === ADMIN_PASSWORD;

        if (!isValidEmail || !isValidPassword) {
          throw new Error('Invalid email or password');
        }

        return {
          id: 'admin',
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          role: 'superadmin',
          permissions: ['*'],
          image: null,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as Record<string, unknown>).role as UserRole;
        token.permissions = (user as unknown as Record<string, unknown>).permissions as string[];
        token.name = user.name;
        token.email = user.email;
        token.picture = (user as unknown as Record<string, unknown>).image as string | undefined;
      }

      if (trigger === 'update' && session) {
        if (session.user?.name) token.name = session.user.name;
        if (session.user?.role) token.role = session.user.role;
        if (session.user?.permissions) token.permissions = session.user.permissions;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name ?? '',
        email: token.email ?? '',
        role: token.role,
        permissions: token.permissions,
        image: token.picture,
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};