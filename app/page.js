import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "24px",
        background: "#F7F9FC",
      }}
    >
      <div
        style={{
          position: "relative",
          padding: "32px 48px",
        }}
      >
        <span style={cornerStyle("top", "left")} />
        <span style={cornerStyle("top", "right")} />
        <span style={cornerStyle("bottom", "left")} />
        <span style={cornerStyle("bottom", "right")} />

        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            margin: 0,
            color: "#16213E",
            letterSpacing: "-0.02em",
          }}
        >
          Qwikko
        </h1>
      </div>

      <p style={{ color: "#4A5568", fontSize: "1.05rem", marginTop: "8px" }}>
        QR codes + smart links — coming together right here.
      </p>

      <nav
        style={{
          marginTop: "32px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Link href="/generate" style={navLinkStyle}>
          Generate QR
        </Link>
        <Link href="/create" style={navLinkStyle}>
          Create smart link
        </Link>
        <Link href="/dashboard" style={navLinkStyle}>
          Dashboard
        </Link>
      </nav>
    </main>
  );
}

const navLinkStyle = {
  display: "inline-block",
  background: "#2F6FED",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "8px",
  fontSize: "0.95rem",
  fontWeight: 600,
  textDecoration: "none",
};

function cornerStyle(vertical, horizontal) {
  const size = "20px";
  const thickness = "3px";
  const color = "#FFB020";

  return {
    position: "absolute",
    width: size,
    height: size,
    [vertical]: "0",
    [horizontal]: "0",
    borderTop: vertical === "top" ? `${thickness} solid ${color}` : "none",
    borderBottom: vertical === "bottom" ? `${thickness} solid ${color}` : "none",
    borderLeft: horizontal === "left" ? `${thickness} solid ${color}` : "none",
    borderRight: horizontal === "right" ? `${thickness} solid ${color}` : "none",
  };
        }
