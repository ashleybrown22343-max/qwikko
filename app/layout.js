// app/layout.js
import "./globals.css";
import Navbar from "./components/Navbar";
import Script from "next/script";

export const metadata = {
  title: "Qwikko — QR + Smart Link Toolkit",
  description: "Free QR codes and branded smart links for businesses and creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        
        {/* Adsterra Social Bar - Loads after the page is interactive */}
        <Script
          src="https://pl31145407.profitableratecpmnetwork.com/25/62/2a/25622aa3eb2e34686edc45155c84e026.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
