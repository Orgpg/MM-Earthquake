import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Myanmar Earthquake Tracker",
  description:
    "Live earthquake data for Myanmar and surrounding areas from USGS",
  keywords: "myanmar, earthquake, tracker, usgs, seismic activity, burma",
  authors: [{ name: "Wai Phyo Aung", url: "https://www.waiphyoaung.dev" }],
  creator: "Wai Phyo Aung",
  publisher: "Wai Phyo Aung",
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL("https://mmearthquake-tracker.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Myanmar Earthquake Tracker",
    description:
      "Live earthquake data for Myanmar and surrounding areas from USGS",
    url: "https://myanmar-earthquake-tracker.vercel.app",
    siteName: "Myanmar Earthquake Tracker",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Myanmar Earthquake Tracker",
    description:
      "Live earthquake data for Myanmar and surrounding areas from USGS",
    creator: "@waiphyoaung",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#0d1424",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anta&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        {/* Favicon links */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/manifest.json" />
      </head>
      <body className="bg-[#0d1424] md:px-32 text-gray-100 min-h-screen font-anta">
        {children}
      </body>
    </html>
  );
}
