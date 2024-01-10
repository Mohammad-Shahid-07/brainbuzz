import NextAuth, { DefaultSession } from "next-auth";

import authConfig from "@/auth.config";
import {
  GetUserByEmail,
  GetUserById,
  LoginWithOAuth,
  getTwoFactorConfimationByUserId,
} from "./lib/actions/auth.action";

declare module "next-auth" {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: {
      id?: string | undefined;
      username?: string | undefined;
   
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  update,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") {
        await LoginWithOAuth({ user, account });
        return true;
      }

      const existingUser = await GetUserById(user.id);

      if (!existingUser?.emailVerified) return false;
      if (existingUser?.twoFactorEnabled) {
        const twoFactorConfimation = await getTwoFactorConfimationByUserId(
          existingUser._id,
        );

        if (!twoFactorConfimation) return false;
        await twoFactorConfimation.deleteOne();
      }

      return true;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token?.id.toString();
      }
      if (token.username && session.user) {
        session.user.username = token.username.toString();
      }
     
      if (session.user) {
        session.user.name = token?.name;
        session.user.email = token?.email;
        session.user.image = token?.image as string;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.email) {
        return token;
      }

      const dbUser = await GetUserByEmail(token.email);
      if (!dbUser) return token;
      token.name = dbUser.name;
      token.email = dbUser.email;
      token.image = dbUser?.image;
      token.id = dbUser.id;
      token.username = dbUser.username;
      token.twoFactorEnabled = dbUser.twoFactorEnabled;

      return token;
    },
  },

  ...authConfig,
  session: {
    strategy: "jwt",
  },
});
