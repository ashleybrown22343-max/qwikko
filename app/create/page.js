// app/create/page.js
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Button, Card, Input, Alert } from "../../components/ui";

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
      setError("Paste a destination URL first.");
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
      <h1>Create a Smart Link</h1>
      <Card style={{ marginTop: "1rem" }}>
        <Input
          label="Destination URL"
          placeholder="https://your-destination.com"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <Input
          label="Custom code (optional)"
          placeholder="e.g. cresoa"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
        />

        {error && <Alert type="error">{error}</Alert>}

        <Button onClick={handleCreate} variant="primary" disabled={loading} style={{ marginTop: "1rem", width: "100%" }}>
          {loading ? "Creating..." : "Create Link"}
        </Button>
      </Card>

      {shortUrl && (
        <Alert type="success" style={{ marginTop: "1rem" }}>
          <p>Your link: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
          {isGuest && (
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--text)" }}>
              Sign in to manage, edit, or track this link later — otherwise it's guest-created and can't be recovered.
            </p>
          )}
        </Alert>
      )}
    </main>
  );
      }
