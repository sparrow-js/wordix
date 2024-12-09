import NextAuth from "next-auth";
import "next-auth/jwt";

import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import prisma from "@/backend/prisma";
import Notion from "next-auth/providers/notion";
// import { createStorage } from "unstorage"
// import memoryDriver from "unstorage/drivers/memory"
// import vercelKVDriver from "unstorage/drivers/vercel-kv"
// import { UnstorageAdapter } from "@auth/unstorage-adapter"
import { PrismaAdapter } from "./adapter-prisma";

// const storage = createStorage({
//   driver: process.env.VERCEL
//     ? vercelKVDriver({
//         url: process.env.AUTH_KV_REST_API_URL,
//         token: process.env.AUTH_KV_REST_API_TOKEN,
//         env: false,
//       })
//     : memoryDriver(),
// })

export const { handlers, auth, signIn, signOut }: any = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Notion({
      clientId: process.env.AUTH_NOTION_ID,
      clientSecret: process.env.AUTH_NOTION_SECRET,
      redirectUri: process.env.AUTH_NOTION_REDIRECT_URI as string,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  basePath: "/api/auth",
  trustHost: true,
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },
    jwt({ token, trigger, session, account }) {
      if (trigger === "update") token.name = session.user.name;
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        id: token.sub,
        // @ts-ignore
        username: token?.user?.username || token?.user?.gh_username,
      };
      return session;
    },
  },
  experimental: { enableWebAuthn: true },
});

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
