"use client";

import './globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ThemeProvider } from "next-themes";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { LoadingHeader } from '@/components/LoadingHeader';
import { Toaster } from '@/components/ui/toaster';
import { WebContainerIndicator } from '@/components/WebContainerIndicator';
import { MinimalHeader } from '@/components/MinimalHeader';
import { usePathname } from 'next/navigation';
import { EnvProvider } from '@/lib/providers/env-provider';

const Header = dynamic(() => import('@/components/Header'), {
  ssr: false,
  loading: () => <LoadingHeader />
});

const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const MobileNavigation = dynamic(() => import('@/components/MobileNavigation').then(mod => mod.MobileNavigation), { ssr: false });

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<LoadingHeader />}>
        {isAuthPage ? <MinimalHeader /> : <Header />}
      </Suspense>
      <main className="flex-1">
        {children}
      </main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <MobileNavigation />}
      <WebContainerIndicator />
    </div>
  );
}

function HtmlWrapper({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
      </head>
      <body>
        <EnvProvider>
          <UserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </UserProvider>
        </EnvProvider>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <HtmlWrapper>
      <LayoutWrapper>{children}</LayoutWrapper>
    </HtmlWrapper>
  );
}