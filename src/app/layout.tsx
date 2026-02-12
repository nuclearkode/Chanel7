import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { PerfumeProvider } from "@/lib/store"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppHeader } from "@/components/app-header"
import { TacticalAISidebar } from "@/components/tactical-ai-sidebar"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: 'PerFume Lab',
  description: 'Computational Perfumery & Compliance Engine',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {/* Material Icons */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="font-display antialiased flex flex-col h-screen overflow-hidden">
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <PerfumeProvider>
            <SidebarProvider defaultOpen={true} className="flex flex-col h-full w-full">
              <AppHeader />
              <div className="flex flex-1 overflow-hidden">
                <TacticalAISidebar />
                <main className="flex-1 overflow-hidden relative flex flex-col bg-background">
                  {children}
                </main>
              </div>
            </SidebarProvider>
            <Toaster />
          </PerfumeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
