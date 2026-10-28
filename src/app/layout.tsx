// The outer shell wrapped around every page: <html>, <body>, fonts, global styles.
import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Metamorphous } from "next/font/google";
import "./globals.css";
import { FriendsSidebar } from "@/components/friends/FriendsSidebar"; // shows only for signed-in members

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Carved, medieval letters for the hero title. Downloaded at build time and served from our own site.
const metamorphous = Metamorphous({
  variable: "--font-metamorphous",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Max — Portfolio",
  description: "Max's portfolio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${metamorphous.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Suspense fallback={null}>
          <FriendsSidebar />
        </Suspense>
      </body>
    </html>
  );
}
