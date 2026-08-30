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
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "8px" }}>Qwikko</h1>
      <p style={{ color: "#555" }}>
        QR codes + smart links — coming together right here.
      </p>
    </main>
  );
}
