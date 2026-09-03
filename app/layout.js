// app/layout.js
import "./globals.css";
import Navbar from "./components/Navbar";
import Script from "next/script";

export const metadata = {
  title: "Qwikko — QR + Smart Link Toolkit",
  description: "Free QR codes and branded smart links for businesses and creators.",
  other: { "monetag": "1381bcbe815876b5e01b652e71955dbd" },
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

        {/* Ad 1: Adsterra Social Bar (Bottom Sticky) */}
        <Script
          src="https://pl31145407.profitableratecpmnetwork.com/25/62/2a/25622aa3eb2e34686edc45155c84e026.js"
          strategy="afterInteractive"
        />

        {/* Ad 2: Monetag Vignette (Full-screen, only when navigating) */}
        <Script
          src="https://n6wxm.com/vignette.min.js"
          strategy="afterInteractive"
          data-zone="11710549"
        />
      </body>
    </html>
  );
            }
