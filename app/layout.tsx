import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Lora, Merriweather } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#2a6b6f',
};

export const metadata: Metadata = {
  metadataBase: new URL("https://oxal.shop"),
  title: "Oxal - Artesanías Auténticas",
  description: "Descubre joyas y ropa artesanal premium de Colima, México",
  keywords: ["artesanías", "joyería artesanal", "ropa premium", "Colima", "México"],
  robots: "index, follow",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Oxal"
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true
  },
};

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
        {/* Preconnect to Google Fonts to reduce critical path latency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${merriweather.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
