import type { Metadata } from "next";
import { Prata, Sora } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

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
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
