/* eslint-disable camelcase */
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import "../styles/prism.css";
import { ThemeProvider } from "@/context/ThemeProvider";
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
    default: "StackWithNext",
    template: "%s | StackWithNext",
  },
  description:
    "A Community for Developers to Share and Learn with each other and grow.",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>StackWithNext</title>
      </head>
      <ClerkProvider
        appearance={{
          elements: {
            formButtonPrimary: "primary-gradient",
            footerActionLink: "primary-text-gradient hover:text-primary-500",
          },
        }}
      >
        <ThemeProvider>
          <body className={`${spaceGrotesk.variable} ${inter.variable} `}>
            {children}
          </body>
        </ThemeProvider>
      </ClerkProvider>
    </html>
  );
}
