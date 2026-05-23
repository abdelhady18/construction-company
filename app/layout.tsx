import type { Metadata } from "next";
import { Prata, Sora, Cairo } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Providers from "./Providers";

const prata = Prata({
  variable: "--font-prata",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  display: "swap",
});

async function resolveLocale(): Promise<string> {
  const alCookie = (await cookies()).get("NEXT_LOCALE")?.value;
  if (alCookie === "ar" || alCookie === "en") return alCookie;
  return "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    title: messages.layout.title,
    description: messages.layout.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await resolveLocale();
  const messages = (await import(`../messages/${locale}.json`)).default;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${prata.variable} ${sora.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:inset-inline-start-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:outline-none"
        >
          {messages.layout.skipToContent}
        </a>
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
