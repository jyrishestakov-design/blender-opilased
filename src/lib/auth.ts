import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export type UserRole = "opilane" | "opetaja";

declare module "next-auth" {
  interface User {
    role: UserRole;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }
}


// TODO: asenda päris andmebaasiga
const DEMO_USERS = [
  { id: "1", name: "Mari Mets", email: "opilane@demo.ee", password: "opilane123", role: "opilane" as UserRole },
  { id: "2", name: "Jüri Kask", email: "opetaja@demo.ee", password: "opetaja123", role: "opetaja" as UserRole },
];

export const config: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-post", type: "email" },
        password: { label: "Parool", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = DEMO_USERS.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) (token as Record<string, unknown>).role = (user as { role: UserRole }).role;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = (token as Record<string, unknown>).role as UserRole;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
