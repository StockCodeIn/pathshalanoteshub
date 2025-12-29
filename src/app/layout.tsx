// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';

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
    default: 'Pathshala Notes Hub – Free RBSE & CBSE Notes (10th & 12th)',
    template: '%s | Pathshala Notes Hub',
  },
  description:
    'Free RBSE & CBSE notes and previous year question papers for Class 10 & 12. Maths, Science & Indian GK in Hindi & English.',
  authors: [{ name: 'Ashok Kumar Meena' }],
  robots: 'index, follow',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className={inter.className}>
        {/* Google Analytics – SAFE */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L8Q8MHGLFE"
          strategy="afterInteractive"
        />
        <Script id="ga" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L8Q8MHGLFE', { anonymize_ip: true });
          `}
        </Script>

        {/* Google AdSense – DELAYED & SAFE */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9763514386679989"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        <Navbar />
        <main className="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
