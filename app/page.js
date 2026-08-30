// app/page.js
import Link from "next/link";
import { Button, Card } from "./components/ui";

export default function Home() {
  return (
    <main className="container">
      {/* Hero Section */}
      <section style={{ padding: "4rem 0", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "0.5rem 1rem", background: "var(--primary-light)", borderRadius: "999px", color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem", marginBottom: "1rem" }}>
          Free QR codes & smart links
        </div>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          Boost your brand with <span style={{ color: "var(--primary)" }}>Qwikko</span>
        </h1>
        <p style={{ fontSize: "1.2rem", color: "var(--text)", maxWidth: "600px", margin: "0 auto 2rem" }}>
          Create branded QR codes and trackable smart links that work everywhere. Perfect for marketers, creators, and businesses.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Button href="/generate" variant="primary">Generate QR</Button>
          <Button href="/create" variant="secondary">Create Smart Link</Button>
        </div>
      </section>

      {/* Feature Highlights */}
      <section style={{ padding: "2rem 0 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
          <Card>
            <h3>QR Codes</h3>
            <p>Generate QR codes for URLs, Wi-Fi, vCards, WhatsApp, and more. Download instantly.</p>
          </Card>
          <Card>
            <h3>Smart Links</h3>
            <p>Create short branded links like qwikko.com/x/yourbrand with real‑time analytics.</p>
          </Card>
          <Card>
            <h3>Analytics</h3>
            <p>Track clicks, countries, devices, and referrers for every link you create.</p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "2rem 0", background: "var(--primary)", borderRadius: "1rem", textAlign: "center", color: "white" }}>
        <h2 style={{ color: "white" }}>Ready to get started?</h2>
        <p style={{ margin: "1rem 0", fontSize: "1.1rem" }}>Join thousands of users who already trust Qwikko.</p>
        <Button href="/login" variant="secondary" style={{ background: "white", color: "var(--primary)", border: "none" }}>Sign Up Free</Button>
      </section>
    </main>
  );
}
