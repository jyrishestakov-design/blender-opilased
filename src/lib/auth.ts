import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export type UserRole = "opilane" | "opetaja";

declare module "next-auth" {
  interface User {
    role: UserRole;
    grupp?: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      grupp?: string;
    };
  }
}

const DEMO_USERS = [
  { id: "0",  name: "Jüri-Illimar Reinberg-Shestakov", email: "opetaja@demo.ee",            password: "opetaja123",     role: "opetaja" as UserRole, grupp: "" },
  { id: "1",  name: "Aleksandr Baburin",        email: "aleksandr.baburin@kool.ee",        password: "Baburin2025",    role: "opilane" as UserRole, grupp: "G2-5a" },
  { id: "2",  name: "Sixten Bergmann",          email: "sixten.bergmann@kool.ee",          password: "Bergmann2025",   role: "opilane" as UserRole, grupp: "G2-1a" },
  { id: "3",  name: "Alari Inno",               email: "alari.inno@kool.ee",               password: "Inno2025",       role: "opilane" as UserRole, grupp: "G2-3a" },
  { id: "4",  name: "Janne Katt",               email: "janne.katt@kool.ee",               password: "Katt2025",       role: "opilane" as UserRole, grupp: "G2-1b" },
  { id: "5",  name: "Käroli Laanemägi",         email: "karoli.laanemagi@kool.ee",         password: "Laanemagi2025",  role: "opilane" as UserRole, grupp: "G2-3b" },
  { id: "6",  name: "Karmo Lill",               email: "karmo.lill@kool.ee",               password: "Lill2025",       role: "opilane" as UserRole, grupp: "G2-5b" },
  { id: "7",  name: "Jakov Nahkurev",           email: "jakov.nahkurev@kool.ee",           password: "Nahkurev2025",   role: "opilane" as UserRole, grupp: "G2-2a" },
  { id: "8",  name: "Karoliina Nasikovski",     email: "karoliina.nasikovski@kool.ee",     password: "Nasikovski2025", role: "opilane" as UserRole, grupp: "G2-4b" },
  { id: "9",  name: "Evelina Pešehodko",        email: "evelina.pesehodko@kool.ee",        password: "Pesehodko2025",  role: "opilane" as UserRole, grupp: "G2-2b" },
  { id: "10", name: "Karoliina Pihlak",         email: "karoliina.pihlak@kool.ee",         password: "Pihlak2025",     role: "opilane" as UserRole, grupp: "G2-1b" },
  { id: "11", name: "Eliise Poolma",            email: "eliise.poolma@kool.ee",            password: "Poolma2025",     role: "opilane" as UserRole, grupp: "G2-1a" },
  { id: "12", name: "Marta Liina Renser",       email: "marta.renser@kool.ee",             password: "Renser2025",     role: "opilane" as UserRole, grupp: "G2-2b" },
  { id: "13", name: "Neleli Lisbet Timmer",     email: "neleli.timmer@kool.ee",            password: "Timmer2025",     role: "opilane" as UserRole, grupp: "G2-1b" },
  { id: "14", name: "Teele Ann Tint",           email: "teele.tint@kool.ee",               password: "Tint2025",       role: "opilane" as UserRole, grupp: "G2-2a" },
  { id: "15", name: "Rasmus Veeväli",           email: "rasmus.veevali@kool.ee",           password: "Veevali2025",    role: "opilane" as UserRole, grupp: "G2-5a" },
  { id: "16", name: "Arabella Altrof",          email: "arabella.altrof@kool.ee",          password: "Altrof2025",     role: "opilane" as UserRole, grupp: "" },
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
      if (user) {
        const u = user as { role: UserRole; grupp?: string };
        (token as Record<string, unknown>).role = u.role;
        (token as Record<string, unknown>).grupp = u.grupp;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = (token as Record<string, unknown>).role as UserRole;
      session.user.grupp = (token as Record<string, unknown>).grupp as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
