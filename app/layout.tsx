import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";
import { Toaster } from "@/components/ui/sonner";
import ClientErrorBoundaryWrapper from "@/components/ClientErrorBoundaryWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AncesTREE",
  description: "Connect your family Tree",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientErrorBoundaryWrapper>
          <MainLayout>
            {children}
          </MainLayout>
        </ClientErrorBoundaryWrapper>
        <Toaster />
      </body>
    </html>
  );
}
