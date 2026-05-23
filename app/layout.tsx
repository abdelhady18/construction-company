import type { Metadata } from "next";
import { Prata, Sora } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Providers from "./Providers";

const prata = Prata({
  variable: "--font-prata",
  subsets: ["latin"],
  weight: "400",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuildCo - Construction Company",
  description:
    "From concept to completion, BuildCo delivers exceptional construction projects. Residential, commercial, and industrial construction services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${prata.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:outline-none">
          Skip to content
        </a>
        <SessionProvider>
          <Providers>{children}</Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
