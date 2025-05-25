import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata:  Metadata = {
  metadataBase: new URL('https://www.apollo247.com'),
  title: 'Apollo 247 - Book Doctor Appointment with General Physician | Online Doctor Consult',
  description: 'Book doctor appointment online with general physician & internal medicine specialists. Consult with doctors online for medical advice, prescriptions & more.',
  keywords: 'general physician, internal medicine, doctor appointment, online doctor consultation, Apollo 247, medical specialists',
  openGraph: {
    title: 'Apollo 247 - Book Doctor Appointment with General Physician | Online Doctor Consult',
    description: 'Book doctor appointment online with general physician & internal medicine specialists. Consult with doctors online for medical advice, prescriptions & more.',
    url: 'https://www.apollo247.com/specialties/general-physician-internal-medicine',
    siteName: 'Apollo 247',
    images: [
      {
        url: 'https://newassets.apollo247.com/images/social-media-logo.png',
        width: 1200,
        height: 630,
        alt: 'Apollo 247',
      }
    ],
    locale: 'en_US',
    type: 'website',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Apollo 247 - Book Doctor Appointment with General Physician',
    description: 'Book doctor appointment online with general physician & internal medicine specialists. Consult with doctors online for medical advice, prescriptions & more.',
    images: ['https://newassets.apollo247.com/images/social-media-logo.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: 'https://www.apollo247.com/specialties/general-physician-internal-medicine',
  },
};

import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
  
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
      
    </html>
    
  );
}