import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  providers: [
    CredentialsProvider({
      id: "login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username as string;
        const password = credentials?.password as string;

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
          throw new Error(JSON.stringify({ credentials: "Invalid username or password." }));
        }

        const pwValid = await compare(password, user.password);
        if (!pwValid) {
          throw new Error(JSON.stringify({ credentials: "Invalid username or password." }));
        }

        return { id: user.id, name: user.alias };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.alias = user.name;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.alias = token.alias as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/?mode=login",
  },
});
