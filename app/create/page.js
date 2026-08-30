"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

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
  const [isGuest, setIsGuest] = useState(true);

  async function handleCreate() {
    setError("");
    setShortUrl("");

    if (!destination) {
      setError("Paste a destination URL first.");
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
        return;
      }
      if (RESERVED.includes(code.toLowerCase())) {
        setError(`"${code}" is reserved. Try a different code.`);
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
      return;
    }

    setShortUrl(`${window.location.origin}/${code}`);
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1>Create a smart link</h1>

      <input
        placeholder="https://your-destination.com"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />

      <input
        placeholder="Custom code (optional), e.g. cresoa"
        value={customCode}
        onChange={(e) => setCustomCode(e.target.value)}
        style={{ width: "100%", padding: "8px", marginTop: "8px" }}
      />

      <button onClick={handleCreate} style={{ marginTop: "12px" }}>
        Create link
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {shortUrl && (
        <div style={{ marginTop: "16px" }}>
          <p>Your link: <a href={shortUrl}>{shortUrl}</a></p>
          {isGuest && (
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Sign in to manage, edit, or track this link later — otherwise it's guest-created and can't be recovered.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
