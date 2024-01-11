/* eslint-disable camelcase */
import React from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import "../styles/prism.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    "https://stack-with-next-mohammad-shahid-07.vercel.app",
  ),
  title: {
    default: "Brain Buzz",
    template: "%s | Brain Buzz",
  },
  description:
    "A Community for Developers to Share and Learn with each other and grow.",
  icons: {
    icon: "/assets/images/site-logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <head>
        <title>Brain Buzz</title>
      </head>
      <SessionProvider session={session}>
        <ThemeProvider>
          <body className={`${spaceGrotesk.variable} ${inter.variable} `}>
            {children}
          </body>
        </ThemeProvider>
      </SessionProvider>
    </html>
  );
}
