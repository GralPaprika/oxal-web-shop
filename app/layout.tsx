import type { Viewport } from "next";
import { Geist, Geist_Mono, Lora, Merriweather } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SessionProvider } from "@/infrastructure/auth/SessionProvider";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#b29167',
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang="es">
      <head>
        {/* Preconnect to Google Fonts CDN - establish connection before fonts needed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch and preconnect to Vercel CDN for faster asset delivery */}
        <link rel="dns-prefetch" href="https://www.oxal.shop" />
        <link rel="preconnect" href="https://www.oxal.shop" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${merriweather.variable} antialiased`}
      >
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
