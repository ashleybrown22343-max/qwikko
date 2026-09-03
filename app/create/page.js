"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Button, Card, Input, Alert } from "../components/ui";
import AdGate from "../components/AdGate";

const RESERVED = ["generate", "create", "dashboard", "scan", "login"];

function randomCode(length = 6) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function CreateLink() {
  const [destination, setDestination] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  async function handleCreate() {
    setError("");
    setShortUrl("");
    setLoading(true);

    if (!destination) {
      setError("Please paste a destination URL first.");
      setLoading(false);
      return;
    }

    let finalDestination = destination.trim();
    if (!/^https?:\/\//i.test(finalDestination)) {
      finalDestination = "https://" + finalDestination;
    }

    let code = customCode.trim();

    if (code) {
      if (!/^[a-zA-Z0-9-]+$/.test(code)) {
        setError("Custom code can only contain letters, numbers, and hyphens.");
        setLoading(false);
        return;
      }
      if (RESERVED.includes(code.toLowerCase())) {
        setError(`"${code}" is reserved. Try a different code.`);
        setLoading(false);
        return;
      }
    } else {
      code = randomCode();
    }

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session ? session.user.id : null;
    setIsGuest(!session);

    const row = {
      code,
      destination_url: finalDestination,
      link_type: "url",
      user_id: userId,
    };

    const { error: insertError } = await supabase.from("links").insert(row);

    if (insertError) {
      if (insertError.message.includes("duplicate") || insertError.code === "23505") {
        setError(`"${code}" is already taken. Try a different one.`);
      } else {
        setError(insertError.message);
      }
      setLoading(false);
      return;
    }

    setShortUrl(`${window.location.origin}/${code}`);
    setLoading(false);
  }

  return (
    <main className="container" style={{ maxWidth: "600px", padding: "2rem" }}>
      {/* Friendly Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>
          Create Your <span style={{ color: "var(--primary)" }}>Smart Link</span>
        </h1>
        <p style={{ color: "var(--text)", fontSize: "1.05rem" }}>
          Turn any long URL into a branded, trackable link in seconds.
        </p>
      </div>

      {/* Main Form Card */}
      <Card style={{ boxShadow: "var(--shadow-md)" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <label className="label" style={{ fontWeight: "600" }}>
            Where should it go?
          </label>
          <Input
            placeholder="https://your-destination.com"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <p style={{ fontSize: "0.85rem", color: "var(--text)", marginTop: "0.25rem" }}>
            Paste the full URL you want people to land on.
          </p>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label className="label" style={{ fontWeight: "600" }}>
            Customize your code (optional)
          </label>
          <Input
            placeholder="e.g. cresoa"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
          />
          <p style={{ fontSize: "0.85rem", color: "var(--text)", marginTop: "0.25rem" }}>
            Leave blank for a random code. Use letters, numbers, or hyphens.
          </p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {/* AdGate Wrapper - Shows the big native ad with countdown */}
        <div style={{ marginTop: "1.5rem" }}>
          <AdGate key={adKey} onComplete={handleCreate}>
            <Button variant="primary" disabled={loading} style={{ width: "100%", padding: "1rem", fontSize: "1.05rem" }}>
              {loading ? "Creating your link..." : "Create Link"}
            </Button>
          </AdGate>
        </div>
      </Card>

      {/* Success State */}
      {shortUrl && (
        <div style={{ marginTop: "1.5rem" }}>
          <Alert type="success" style={{ background: "var(--primary-light)", border: "1px solid var(--primary)", borderRadius: "12px" }}>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0 0 0.5rem", color: "var(--navy)" }}>🎉 Link created!</h3>
              <p style={{ margin: "0 0 1rem" }}>
                Your link is ready:{" "}
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", fontWeight: "700", wordBreak: "break-all" }}>
                  {shortUrl}
                </a>
              </p>
              {isGuest && (
                <p style={{ fontSize: "0.9rem", color: "var(--text)", marginTop: "0.5rem" }}>
                  ⚠️ You're a guest. Sign in to manage, edit, or track this link later — otherwise it can't be recovered.
                </p>
              )}
              <Button href="/dashboard" variant="secondary" style={{ marginTop: "1rem" }}>
                View Dashboard
              </Button>
            </div>
          </Alert>
        </div>
      )}

      {/* Helpful Tip Section */}
      <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text)" }}>
        <p>
          💡 <strong>Pro tip:</strong> You can use your custom code to make your link memorable, like <code>/sale</code> or <code>/menu</code>.
        </p>
      </div>
    </main>
  );
  }
