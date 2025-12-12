import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import { Providers } from "./components/Providers";
import "../shared/styles/globals.scss";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tomyjobs.com'),
  title: {
    default: 'TomyJobs - Encuentra tu trabajo ideal',
    template: '%s | TomyJobs'
  },
  description: 'Plataforma para encontrar y publicar trabajos. Miles de ofertas de empleo en diferentes categorías y ubicaciones.',
  keywords: ['trabajos', 'empleo', 'ofertas de trabajo', 'buscar trabajo', 'publicar trabajo', 'trabajos en españa'],
  authors: [{ name: 'TomyJobs' }],
  creator: 'TomyJobs',
  publisher: 'TomyJobs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    siteName: 'TomyJobs',
    title: 'TomyJobs - Encuentra tu trabajo ideal',
    description: 'Plataforma para encontrar y publicar trabajos. Miles de ofertas de empleo en diferentes categorías y ubicaciones.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TomyJobs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TomyJobs - Encuentra tu trabajo ideal',
    description: 'Plataforma para encontrar y publicar trabajos. Miles de ofertas de empleo en diferentes categorías y ubicaciones.',
    images: ['/og-image.jpg'],
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
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

