import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import ToastNotification from "@/components/ui/ToastNotification";
import CameraUI from "@/components/camera/CameraUI";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spoetzl Brewery Landscape Design System",
  description: "Collaborative landscape design platform for Spoetzl Brewery, managed by Evergold Landscaping",
  keywords: ["landscape design", "Spoetzl Brewery", "Evergold Landscaping", "Busch Gardens", "brewery design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <ToastNotification />
          <CameraUI />
        </Providers>
      </body>
    </html>
  );
}
