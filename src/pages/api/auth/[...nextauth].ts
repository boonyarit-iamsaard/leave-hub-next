import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { verify } from 'argon2';
import { prisma } from '../../../server/db/client';

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: Validate credentials using zod
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
        });
        if (!user) {
          return null;
        }

        const isValid = await verify(user.password, credentials.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
};

export default NextAuth(authOptions);
