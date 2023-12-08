import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongoose";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import User from "@/database/user.model";
import { createUserWithProvider } from "@/lib/actions/user.action";
import NextAuth from "next-auth/next";

export interface CredentialsProps {
  email: string;
  password: string;
}
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "string" },
        password: { label: "Password", type: "string" },
      },
      async authorize(credentials) {
        connectToDatabase();
        const { email, password } = credentials!;
        if (!email || !password) {
          throw new Error("Please enter your email and password");
        }
        const user = await User.findOne({ email });
        if (!user || !user.hashedPassword) {
          throw new Error("No user found");
        }
        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn(user) {
      if (user.account?.provider === "credentials") {
        return true;
      } else {
        try {
          await createUserWithProvider({ user , account: user.account });
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    jwt: true,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
