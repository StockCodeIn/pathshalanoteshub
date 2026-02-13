// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.pathshalanoteshub.in'),
  title: {
    default: 'Pathshala Notes Hub – Free RBSE & CBSE Notes (10th & 12th) + Indian GK',
    template: '%s | Pathshala Notes Hub',
  },
  description:
    'Free RBSE & CBSE notes (PDF), previous year question papers for Class 10 & 12. Maths, Science, Hindi & English notes. Indian GK + Current Affairs 2025.',
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
  creator: 'Pathshala Notes Hub',
  publisher: 'Pathshala Notes Hub',
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
    siteName: 'Pathshala Notes Hub',
    url: 'https://www.pathshalanoteshub.in',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <head> 
        {/* <Script
          src="https://cmp.gatekeeperconsent.com/min.js"
          strategy="beforeInteractive"
          data-cfasync="false"
        />
        <Script
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          strategy="beforeInteractive"
          data-cfasync="false"
        />

       
        <Script
          src="//www.ezojs.com/ezoic/sa.min.js"
          strategy="afterInteractive"
          async
        />

        
        <Script id="ezoic-init" strategy="afterInteractive">
          {`
            window.ezstandalone = window.ezstandalone || {};
            ezstandalone.cmd = ezstandalone.cmd || [];
          `}
        </Script> */}

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className={inter.className}>
        {/* Google Analytics – DELAYED */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L8Q8MHGLFE"
          strategy="lazyOnload"
          async
        />
        <Script id="ga" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L8Q8MHGLFE', { anonymize_ip: true });
          `}
        </Script>

        {/* Google AdSense – DELAYED & SAFE */}
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        <Navbar />
        <main className="main">{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
