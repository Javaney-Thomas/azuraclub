import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApolloProviders } from "./shared/context/ApolloProviders";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Azura E-commerce - Shop the Best Deals Online",
  description:
    "Discover top-quality products at unbeatable prices on Azura E-commerce. Shop electronics, fashion, home essentials, and more with fast shipping and secure checkout.",
  keywords: [
    "Azura E-commerce",
    "online shopping",
    "best deals",
    "electronics",
    "fashion",
    "home essentials",
    "fast shipping",
    "secure checkout",
  ],
  openGraph: {
    title: "Azura E-commerce - Your One-Stop Online Store",
    description:
      "Shop from a wide range of products at great prices. Secure payments, fast delivery, and the best deals online.",
    url: "https://azura-ecommerce.com",
    type: "website",
    images: [
      {
        url: "https://azura-ecommerce.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Azura E-commerce Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Azura E-commerce - Shop the Best Deals Online",
    description:
      "Find amazing deals on electronics, fashion, and more with fast shipping and secure checkout.",
    images: ["https://azura-ecommerce.com/og-image.jpg"],
  },
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
        <Toaster position="top-left" />

        <ApolloProviders>{children}</ApolloProviders>
      </body>
    </html>
  );
}
