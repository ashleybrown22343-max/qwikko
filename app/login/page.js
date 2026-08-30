// app/login/page.js
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

  async function handleGoogleAuth() {
    setError("");
    setLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: "400px", padding: "2rem", marginTop: "4rem" }}>
      <h1 style={{ textAlign: "center" }}>{mode === "signup" ? "Create Account" : "Sign In"}</h1>
      <Card style={{ marginTop: "1.5rem" }}>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <Alert type="error">{error}</Alert>}
        {message && <Alert type="success">{message}</Alert>}

        <Button onClick={handleEmailAuth} variant="primary" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Please wait..." : mode === "signup" ? "Sign Up" : "Sign In"}
        </Button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          {mode === "signup" ? (
            <>Already have an account? <a onClick={() => setMode("signin")} style={{ cursor: "pointer", color: "var(--primary)" }}>Sign in</a></>
          ) : (
            <>Need an account? <a onClick={() => setMode("signup")} style={{ cursor: "pointer", color: "var(--primary)" }}>Sign up</a></>
          )}
        </p>

        <hr style={{ margin: "1.5rem 0", border: "none", borderTop: "1px solid var(--border)" }} />

        <Button onClick={handleGoogleAuth} variant="secondary" disabled={loading} style={{ width: "100%" }}>
          Continue with Google
        </Button>
      </Card>
    </main>
  );
}
