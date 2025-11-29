import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // explicite pour prod
  session: { strategy: 'jwt' },        // optionnel: JWT par défaut
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) (session.user as any).id = token.sub;
      return session;
    },
  },
};

export default NextAuth(authOptions);
