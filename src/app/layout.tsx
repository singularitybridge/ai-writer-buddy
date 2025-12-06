import type { Metadata } from "next";
import { Heebo, Frank_Ruhl_Libre, Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { localeDirection, type Locale } from '@/i18n/config';
import "./globals.css";

// Primary font for UI - clean and modern Hebrew font
const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// Serif font for book content - elegant reading experience
const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "700", "900"],
});

// Sans-serif for numbers and technical elements
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Story Writer - Singularity Bridge",
  description: "Creative writing platform with AI assistant",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale() as Locale;
  const messages = await getMessages();
  const dir = localeDirection[locale];

  return (
    <html lang={locale} dir={dir}>
      <body className={`${heebo.variable} ${frankRuhlLibre.variable} ${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
