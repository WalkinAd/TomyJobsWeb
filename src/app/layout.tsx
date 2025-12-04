'use client';

import { Inter } from "next/font/google";
import "../shared/styles/globals.scss";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <title>TomyJobs - Encuentra tu trabajo ideal</title>
        <meta name="description" content="Plataforma para encontrar y publicar trabajos" />
      </head>
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
