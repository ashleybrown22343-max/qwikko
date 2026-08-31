"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Button, Card, Input, Alert } from "../components/ui";

export default function Login() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle email/password auth
  async function handleEmailAuth() {
    setError("");
    setMessage("");
    setLoading(true);

    if (!email || !password) {
      setError("Enter both email and password.");
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      setMessage("Check your email to confirm your account.");
      setLoading(false);
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    }
  }

  // Handle Google OAuth
  async function handleGoogleAuth() {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", maxWidth: "900px", width: "100%" }}>
        {/* Left side - Brand info (hidden on mobile) */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem", background: "var(--primary)", borderRadius: "12px", color: "white" }}>
          <h2 style={{ color: "white", fontSize: "2rem", marginBottom: "1rem" }}>
            Qwikko
          </h2>
          <p style={{ fontSize: "1.1rem", opacity: "0.9", marginBottom: "2rem" }}>
            QR codes & smart links with powerful analytics.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>✓</span>
              <span>Branded short links</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>✓</span>
              <span>Real-time click analytics</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>✓</span>
              <span>Customizable QR codes</span>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <Card style={{ padding: "2rem", boxShadow: "var(--shadow-md)" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </h1>
          <p style={{ color: "var(--text)", marginBottom: "1.5rem" }}>
            {mode === "signup" ? "Sign up to start using Qwikko" : "Log in to manage your links"}
          </p>

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />

          {error && <Alert type="error">{error}</Alert>}
          {message && <Alert type="success">{message}</Alert>}

          <Button
            onClick={handleEmailAuth}
            variant="primary"
            disabled={loading}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            {loading ? "Please wait..." : mode === "signup" ? "Sign Up" : "Sign In"}
          </Button>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem", color: "var(--text)" }}>
            <span>{mode === "signup" ? "Already have an account?" : "Need an account?"}</span>
            <a
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              style={{ cursor: "pointer", color: "var(--primary)", fontWeight: "600" }}
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </a>
          </div>

          <hr style={{ margin: "1.5rem 0", border: "none", borderTop: "1px solid var(--border)" }} />

          <Button
            onClick={handleGoogleAuth}
            variant="secondary"
            disabled={loading}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 9.5C27.5 9.5 30.7 10.8 33.1 13.2L38.7 7.6C34.6 3.9 29.6 2 24 2C14.9 2 7.1 7.6 3.5 15.4L9.9 20.3C12.3 14.3 17.7 9.5 24 9.5Z" fill="#EA4335" />
              <path d="M46.5 24.3C46.5 22.8 46.4 21.3 46.1 20H24V28.8H36.4C35.7 32.2 33.5 35 30.6 36.8L36.3 42C43.2 38.1 46.5 31.6 46.5 24.3Z" fill="#4285F4" />
              <path d="M9.9 20.3C8.4 23.4 8.4 26.6 9.9 29.7L3.5 34.6C1 29.1 0 22.9 3.5 15.4L9.9 20.3Z" fill="#FBBC05" />
              <path d="M30.6 36.8C27.8 38.2 24.6 39 21.3 39C14.9 39 9.9 34.2 9.9 28.8L3.5 34.6C5.2 40.4 11.5 46 21 46C28 46 33.8 43.4 38.5 39.6L30.6 36.8Z" fill="#34A853" />
            </svg>
            {loading ? "Redirecting..." : "Continue with Google"}
          </Button>
        </Card>
      </div>
    </main>
  );
}
