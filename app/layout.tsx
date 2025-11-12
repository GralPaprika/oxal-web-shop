import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Lora, Merriweather } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "./globals.css";

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#2a6b6f',
};

export const metadata: Metadata = {
  metadataBase: new URL("https://oxal.shop"),
  title: "Oxal - Boutique Artesanal",
  description: "Descubre joyas y ropa artesanal premium de Colima, México",
  keywords: ["artesanías", "joyería artesanal", "ropa premium", "Colima", "México", "comercio justo", "productos únicos"],
  robots: "index, follow",
  openGraph: {
    title: "Oxal - Boutique Artesanal",
    description: "Descubre joyas y ropa artesanal premium de Colima, México",
    type: "website",
    locale: "es_MX",
    url: "https://oxal.shop",
    siteName: "Oxal",
    images: [
      {
        url: "/landing-background.png",
        width: 1200,
        height: 630,
        alt: "Oxal - Boutique Artesanal",
        type: "image/png"
      }
    ],
    countryName: "Mexico",
    determiner: "the"
  },
  twitter: {
    card: "summary_large_image",
    title: "Oxal - Boutique Artesanal",
    description: "Descubre joyas y ropa artesanal premium de Colima, México",
    images: ["/landing-background.png"],
    creator: "@shop_oxal"
  },
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
  alternates: {
    canonical: "https://oxal.shop"
  }
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
        {/* Preconnect to Google Fonts CDN - establish connection before fonts needed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
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
