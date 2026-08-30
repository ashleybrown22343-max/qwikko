import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container" style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <span style={{ fontSize: "5rem", fontWeight: 800, color: "var(--primary)" }}>404</span>
      </div>
      <h1>Oops! Link not found</h1>
      <p style={{ color: "var(--text)", margin: "1rem 0" }}>
        The link you’re trying to access doesn’t exist or has been removed.
      </p>
      <div style={{ marginTop: "2rem" }}>
        <Link href="/" className="btn btn-primary" style={{ textDecoration: "none" }}>
          Go to Home
        </Link>
      </div>
    </main>
  );
  }
