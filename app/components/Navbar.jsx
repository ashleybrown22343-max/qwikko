// app/components/Navbar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const isActive = (path) => pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/" style={{ textDecoration: "none", color: "var(--primary)" }}>
          Qwikko
        </Link>
      </div>
      <div className="navbar-links">
        <Link href="/generate" className={`navbar-link ${isActive("/generate") ? "active" : ""}`}>
          Generate QR
        </Link>
        <Link href="/create" className={`navbar-link ${isActive("/create") ? "active" : ""}`}>
          Create Link
        </Link>
        <Link href="/scan" className={`navbar-link ${isActive("/scan") ? "active" : ""}`}>
          Scan
        </Link>
        {user ? (
          <Link href="/dashboard" className={`navbar-link ${isActive("/dashboard") ? "active" : ""}`}>
            Dashboard
          </Link>
        ) : (
          <Link href="/login" className={`navbar-link ${isActive("/login") ? "active" : ""}`}>
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
