// app/layout.js
import "./globals.css";
import Navbar from "./components/Navbar";
import AdBanner from "./components/AdBanner";

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
        <AdBanner />
      </body>
    </html>
  );
}
