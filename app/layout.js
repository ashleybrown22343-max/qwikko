// app/layout.js
import "./globals.css";
import Navbar from "./components/Navbar";
import Script from "next/script";

export const metadata = {
  title: "Qwikko — QR + Smart Link Toolkit",
  description: "Free QR codes and branded smart links for businesses and creators.",
  // Add Monetag meta tag here
  other: {
    "monetag": "1381bcbe815876b5e01b652e71955dbd",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Monetag Meta Tag */}
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
        
        {/* Monetag Script (you'll get this after uploading the file) */}
        {/* Replace this with the monetag script code they give you */}
        <Script
          src="YOUR_MONETAG_SCRIPT_URL.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
