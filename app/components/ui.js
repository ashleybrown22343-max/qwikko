// app/components/ui.js
import Link from "next/link";

export function Button({ children, variant = "primary", href, onClick, type = "button", ...props }) {
  const className = `btn btn-${variant}`;
  if (href) {
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={className} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <label className="label">{label}</label>}
      <input className="input" {...props} />
      {error && <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: "0.25rem" }}>{error}</p>}
    </div>
  );
}

export function Card({ children, style }) {
  return <div className="card" style={style}>{children}</div>;
}

export function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

export function Alert({ type, children }) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}

export function Spinner() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <div className="spinner" />
    </div>
  );
    }
