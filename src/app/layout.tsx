import type { Metadata } from "next";
import "./globals.css";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export const metadata: Metadata = {
  title: "Cloud Production LTD - Expert Software Development Company in Bangladesh",
  description: "Cloud Production Limited offers custom software development, web applications, mobile apps, AI solutions, and business automation services in Dhaka, Bangladesh.",
  keywords: "software development company Bangladesh, custom software development, web development Dhaka, mobile app development, AI solutions, business automation",
  authors: [{ name: "Cloud Production Limited" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cloudproductionltd.com",
    siteName: "Cloud Production LTD",
    title: "Cloud Production LTD - Expert Software Development Company",
    description: "Custom software development, web applications, mobile apps, AI solutions in Bangladesh",
    images: [
      {
        url: "https://cloudproductionltd.com/assets/images/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "Cloud Production LTD Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Production LTD - Expert Software Development Company",
    description: "Custom software development, web applications, mobile apps, AI solutions in Bangladesh",
    images: ["https://cloudproductionltd.com/assets/images/logo/logo.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
