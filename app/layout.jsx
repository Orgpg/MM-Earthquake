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
  metadataBase: new URL("https://mmeq.waiphyoaung.dev/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Myanmar Earthquake Tracker",
    description:
      "Live earthquake data for Myanmar and surrounding areas from USGS",
    url: "https://mmeq.waiphyoaung.dev/",
    siteName: "Myanmar Earthquake Tracker",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/mm-img.jpg",
        width: 400, // ပြင်ဆင်ထားသော width
        height: 400, // ပြင်ဆင်ထားသော height
        alt: "Myanmar Earthquake Tracker",
      },
    ],
  },
  twitter: {
    card: "summary", // summary_large_image မှ summary သို့ ပြောင်းလဲထားပါသည်
    title: "Myanmar Earthquake Tracker",
    description:
      "Live earthquake data for Myanmar and surrounding areas from USGS",
    creator: "@waiphyoaung",
    images: ["/mm-img.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#0d1424",
  icons: {
    icon: [
      { url: "/icons/favicon.ico" },
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full">
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
      <body className="bg-[#0d1424] text-gray-100 min-h-screen font-anta flex flex-col h-full">
        <div className="flex-grow md:px-32">{children}</div>
      </body>
    </html>
  );
}
