'use client';

import { Inter } from "next/font/google";
import { Provider } from 'react-redux';
import { store } from "@/shared/store/store";
import { StoreProvider } from "@/shared/store/StoreProvider";
import "../shared/styles/globals.scss";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>TomyJobs - Encuentra tu trabajo ideal</title>
        <meta name="description" content="Plataforma para encontrar y publicar trabajos" />
      </head>
      <body className={inter.variable}>
        <Provider store={store}>
          <StoreProvider>
            {children}
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}

