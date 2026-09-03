// app/page.js
import Link from "next/link";
import { Button, Card } from "./components/ui";
import BannerAds from "./components/BannerAds";

export const metadata = {
  title: "Qwikko — Trackable QR Codes & Smart Links for Nigerian Businesses",
  description: "Create branded QR codes and smart links for your restaurant, shop, or brand. Track clicks, get real-time analytics, and connect with customers on WhatsApp instantly.",
  keywords: "QR code generator Nigeria, smart links, WhatsApp QR code, trackable links, restaurant menu QR, small business tools",
  openGraph: {
    title: "Qwikko — Turn Every Link into a Customer",
    description: "Create QR codes and smart links that actually track your customers. No ads needed.",
    url: "https://qwikko.vercel.app",
    type: "website",
  },
};

// A simple SVG QR code graphic for the hero
function HeroQRCode() {
  const cells = Array.from({ length: 25 }, (_, i) => i);
  return (
    <svg width="200" height="200" viewBox="0 0 100 100" style={{ boxShadow: "0 20px 40px rgba(37, 99, 235, 0.15)", borderRadius: "16px", background: "white", padding: "12px" }}>
      <rect width="100" height="100" fill="white" />
      <path d="M10 10h30v30h-30z M60 10h30v30h-30z M10 60h30v30h-30z" fill="#2563EB" />
      <path d="M15 15h10v10h-10z M65 15h10v10h-10z M15 65h10v10h-10z" fill="white" />
      <path d="M50 15h5v5h-5z M60 60h5v5h-5z M70 60h5v5h-5z M50 70h5v5h-5z M40 20h5v5h-5z" fill="#2563EB" />
      <path d="M30 40h5v5h-5z M40 40h5v5h-5z M50 40h5v5h-5z M60 40h5v5h-5z M70 40h5v5h-5z" fill="#2563EB" />
      <path d="M30 50h5v5h-5z M50 50h5v5h-5z M70 50h5v5h-5z" fill="#2563EB" />
      <path d="M30 60h5v5h-5z M40 60h5v5h-5z M50 60h5v5h-5z" fill="#2563EB" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <main className="container">
        
        {/* Hero Section with QR Graphic */}
        <section style={{ padding: "5rem 0 3rem", textAlign: "center", maxWidth: "800px", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
            <HeroQRCode />
          </div>
          <h1 style={{ fontSize: "3rem", lineHeight: "1.2", marginBottom: "1.5rem" }}>
            Turn your <span style={{ color: "var(--primary)" }}>offline</span> customers into{" "}
            <span style={{ color: "var(--primary)" }}>online</span> fans.
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--text)", marginBottom: "2rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
            Qwikko gives you QR codes and smart links that track every single click, scan, and sale. Perfect for restaurants, vendors, and creators.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Button href="/generate" variant="primary" style={{ padding: "0.8rem 2rem", fontSize: "1.05rem" }}>Create a QR Code</Button>
            <Button href="/create" variant="secondary" style={{ padding: "0.8rem 2rem", fontSize: "1.05rem" }}>Make a Smart Link</Button>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section style={{ padding: "2rem 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--primary-light)", borderRadius: "1rem", marginBottom: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", textAlign: "center" }}>
            <div>
              <h3 style={{ color: "var(--primary)", fontSize: "2rem", margin: "0" }}>2,000+</h3>
              <p style={{ color: "var(--text)" }}>Links created</p>
            </div>
            <div>
              <h3 style={{ color: "var(--primary)", fontSize: "2rem", margin: "0" }}>15,000+</h3>
              <p style={{ color: "var(--text)" }}>Clicks tracked</p>
            </div>
            <div>
              <h3 style={{ color: "var(--primary)", fontSize: "2rem", margin: "0" }}>99.9%</h3>
              <p style={{ color: "var(--text)" }}>Uptime</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: "3rem 0" }}>
          <h2 style={{ textAlign: "center", marginBottom: "3rem", fontSize: "2rem" }}>How Qwikko Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
            <Card style={{ textAlign: "center", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--primary)" }}>1</div>
              <h3>Create Your Link</h3>
              <p style={{ color: "var(--text)" }}>Paste any URL, WhatsApp number, or even your Wi-Fi details.</p>
            </Card>
            <Card style={{ textAlign: "center", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--primary)" }}>2</div>
              <h3>Print or Share</h3>
              <p style={{ color: "var(--text)" }}>Download your QR code or copy your short link. Put it anywhere.</p>
            </Card>
            <Card style={{ textAlign: "center", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--primary)" }}>3</div>
              <h3>Watch the Data Roll In</h3>
              <p style={{ color: "var(--text)" }}>See exactly where your customers come from and how they click.</p>
            </Card>
          </div>
        </section>

        {/* Ad Space (The 4 ads you requested) */}
        <section style={{ margin: "2rem 0" }}>
           <BannerAds />
        </section>

        {/* Use Cases */}
        <section style={{ padding: "3rem 0", background: "var(--primary-light)", borderRadius: "1rem", marginBottom: "3rem" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Built for Nigerian Businesses</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", padding: "0 2rem" }}>
            <div>
              <h3>🏪 Shop Owners</h3>
              <p>Print a QR at your counter. Customers scan it and get your WhatsApp instantly.</p>
            </div>
            <div>
              <h3>🍽️ Restaurant Owners</h3>
              <p>Replace paper menus with a QR code. Update prices without reprinting.</p>
            </div>
            <div>
              <h3>✍️ Creators</h3>
              <p>Share your music, videos, or portfolio with one trackable link.</p>
            </div>
          </div>
        </section>

        {/* Testimonial Section (To make it look "Real") */}
        <section style={{ padding: "3rem 0", textAlign: "center" }}>
          <h2>Trusted by Businesses Across Nigeria</h2>
          <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
            <p style={{ fontSize: "1.2rem", fontStyle: "italic", color: "var(--navy)" }}>
              "Since I added the QR code to my shop's counter, I get about 20 new WhatsApp orders a day. This tool is a lifesaver."
            </p>
            <p style={{ color: "var(--text)", marginTop: "1rem" }}>— Adebayo O., Lagos</p>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ padding: "3rem 0 5rem", textAlign: "center" }}>
          <h2>Ready to stop guessing and start growing?</h2>
          <p style={{ color: "var(--text)", margin: "1rem 0 2rem" }}>
            Join hundreds of small businesses already using Qwikko.
          </p>
          <Button href="/login" variant="primary" style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}>
            Get Started — It's Free
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "var(--navy)", color: "white", padding: "3rem 1rem 2rem", marginTop: "2rem" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
          <div>
            <h3 style={{ color: "white", marginBottom: "1rem" }}>Qwikko</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              The simplest way to turn your printed material into a measurable marketing channel.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: "1rem" }}>Product</h4>
            <ul style={{ listStyle: "none", padding: "0", color: "#94a3b8" }}>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/generate" style={{ color: "#94a3b8" }}>Generate QR</Link></li>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/create" style={{ color: "#94a3b8" }}>Smart Links</Link></li>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/scan" style={{ color: "#94a3b8" }}>Scan QR</Link></li>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/dashboard" style={{ color: "#94a3b8" }}>Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: "1rem" }}>Account</h4>
            <ul style={{ listStyle: "none", padding: "0", color: "#94a3b8" }}>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/login" style={{ color: "#94a3b8" }}>Sign In</Link></li>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/login" style={{ color: "#94a3b8" }}>Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: "1rem" }}>Legal</h4>
            <ul style={{ listStyle: "none", padding: "0", color: "#94a3b8" }}>
              <li style={{ marginBottom: "0.5rem" }}><a href="/privacy" style={{ color: "#94a3b8" }}>Privacy Policy</a></li>
              <li style={{ marginBottom: "0.5rem" }}><a href="/terms" style={{ color: "#94a3b8" }}>Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #334155", marginTop: "2rem", paddingTop: "1.5rem", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>
          © {new Date().getFullYear()} Qwikko. All rights reserved.
        </div>
      </footer>
    </>
  );
  }
