// app/layout.tsx

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Pathshala Notes Hub – Free RBSE & CBSE Notes & Papers (10th & 12th)',
  description:
    'Download free RBSE and CBSE notes and previous year question papers for Class 10 & 12. Includes Maths, Science, and Indian GK study materials for 2024–25 exams.',
  keywords: [
    'Pathshala Notes Hub',
    'RBSE Notes',
    'CBSE Notes',
    'Class 10 Notes',
    'Class 12 Notes',
    'RBSE Previous Year Papers',
    'Maths Notes',
    'Science Notes',
    'Indian GK PDF',
    'Study Material',
    'Free Notes PDF',
    'Board Exam Preparation 2024',
  ],
  authors: [{ name: 'Ashok Kumar Meena', url: 'https://www.pathshalanoteshub.in' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Pathshala Notes Hub – Free RBSE & CBSE Notes & Papers',
    description:
      'Get RBSE & CBSE free notes and past year papers for Class 10 & 12. Download high-quality study material for Maths, Science & GK.',
    type: 'website',
    url: 'https://www.pathshalanoteshub.in',
    siteName: 'Pathshala Notes Hub',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L8Q8MHGLFE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L8Q8MHGLFE');
          `}
        </Script>
        <Navbar />
        <main className="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

