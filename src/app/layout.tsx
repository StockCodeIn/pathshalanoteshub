// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = 'https://www.pathshalanoteshub.in';
const siteName = 'Pathshala Notes Hub';
const defaultTitle = 'Pathshala Notes Hub – Free RBSE & CBSE Notes (10th & 12th) + Indian GK';
const defaultDescription =
  'Free RBSE & CBSE notes (PDF), previous year question papers for Class 10 & 12. Maths, Science, Hindi & English notes. Indian GK + Current Affairs 2025.';
const ogImage = '/og-image.png';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: '%s | Pathshala Notes Hub',
  },
  description: defaultDescription,
  keywords: [
    'RBSE notes',
    'CBSE notes',
    'class 10 notes',
    'class 12 notes',
    'previous year papers',
    'Indian GK',
    'free study material',
    'board exam preparation',
  ],
  authors: [{ name: 'Ashok Kumar Meena' }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    locale: 'hi_IN',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Pathshala Notes Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImage],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = 'G-L8Q8MHGLFE';
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>

      <body className={inter.className}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="lazyOnload"
        />
        <Script id="ga" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              anonymize_ip: true
            });
          `}
        </Script>

        {adsenseClient ? (
          <Script
            id="adsense-script"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        ) : null}

        <Navbar />
        <main className="main">{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}