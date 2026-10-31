import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = "https://noor-medicals.vercel.app";
const OG_IMAGE = `${BASE_URL}/noor-og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Noor Medicals | Pharmacy, Lab Tests & Healthcare in Rewa",
    template: "%s | Noor Medicals Rewa",
  },

  description:
    "Noor Medicals, Rewa, Madhya Pradesh. Quality medicines, pathology lab tests, home sample collection and digital health reports. Your Health Our Priority.",

  applicationName: "Noor Medicals",

  keywords: [
    "Noor Medicals",
    "Noor Medicals Rewa",
    "Medical Store in Rewa",
    "Pharmacy in Rewa",
    "Pathology Lab Rewa",
    "Blood Test Rewa",
    "Lab Tests Rewa",
    "Home Sample Collection Rewa",
    "Healthcare Services Rewa",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Noor Medicals",

    title: "Noor Medicals | Your Health Our Priority",

    description:
      "Quality medicines, lab tests, home collection and digital reports in Rewa, Madhya Pradesh.",

    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Noor Medicals - Your Health Our Priority",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Noor Medicals | Your Health Our Priority",

    description:
      "Quality medicines, lab tests and healthcare services in Rewa, Madhya Pradesh.",

    images: [OG_IMAGE],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0876C9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className={`${jakarta.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}