// app/layout.js
import "./globals.css";
import Navbar from "./components/Navbar";
import Script from "next/script";

export const metadata = {
  title: "Qwikko — QR + Smart Link Toolkit",
  description: "Free QR codes and branded smart links for businesses and creators.",
  // Monetag meta tag (for verification)
  other: {
    "monetag": "1381bcbe815876b5e01b652e71955dbd",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="monetag" content="1381bcbe815876b5e01b652e71955dbd" />
      </head>
      <body>
        <Navbar />
        {children}

        {/* Adsterra Social Bar */}
        <Script
          src="https://pl31145407.profitableratecpmnetwork.com/25/62/2a/25622aa3eb2e34686edc45155c84e026.js"
          strategy="afterInteractive"
        />

        {/* Monetag Zone 11710551 (Tag/Push) */}
        <Script
          src="https://nap5k.com/tag.min.js"
          strategy="afterInteractive"
          data-zone="11710551"
        />

        {/* Monetag Zone 11710549 (Vignette/Interstitial) */}
        <Script
          src="https://n6wxm.com/vignette.min.js"
          strategy="afterInteractive"
          data-zone="11710549"
        />

        {/* NEW Monetag Zone 11710701 (Social Bar / Banner) */}
        <Script
          src="https://5gvci.com/act/files/tag.min.js?z=11710701"
          strategy="afterInteractive"
          data-cfasync="false"
          async
        />
      </body>
    </html>
  );
            }
