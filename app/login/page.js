"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleEmailAuth() {
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Enter both email and password.");
      return;
    }

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      setMessage("Check your email to confirm your account.");
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.push("/dashboard");
    }
  }

  async function handleGoogleAuth() {
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
    }
  }

  return (
    <main style={{ padding: "24px", maxWidth: "360px" }}>
      <h1>{mode === "signup" ? "Create account" : "Sign in"}</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "8px", marginTop: "8px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "8px", marginTop: "8px" }}
      />

      <button onClick={handleEmailAuth} style={{ marginTop: "12px", width: "100%" }}>
        {mode === "signup" ? "Sign up" : "Sign in"}
      </button>

      <p style={{ marginTop: "8px" }}>
        {mode === "signup" ? (
          <>Already have an account? <a onClick={() => setMode("signin")} style={{ cursor: "pointer", color: "#2F6FED" }}>Sign in</a></>
        ) : (
          <>Need an account? <a onClick={() => setMode("signup")} style={{ cursor: "pointer", color: "#2F6FED" }}>Sign up</a></>
        )}
      </p>

      <hr style={{ margin: "16px 0" }} />

      <button onClick={handleGoogleAuth} style={{ width: "100%" }}>
        Continue with Google
      </button>

      {error && <p style={{ color: "red", marginTop: "12px" }}>{error}</p>}
      {message && <p style={{ color: "green", marginTop: "12px" }}>{message}</p>}
    </main>
  );
}
