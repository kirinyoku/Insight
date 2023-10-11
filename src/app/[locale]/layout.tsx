import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import RootProvider from "@/components/RootProvider";
import type { Metadata } from "next";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Insight",
  description: "Talk with your documents.",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: "en" | "ua";
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  return (
    <html lang={locale} id="root">
      <body
        className={cn(
          "min-h-screen font-sans antialiased grainy",
          inter.className
        )}
      >
        <RootProvider>
          <Navbar />
          {children}
          <Toaster />
        </RootProvider>
      </body>
    </html>
  );
}
