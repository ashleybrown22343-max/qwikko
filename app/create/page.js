"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

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
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  async function handleCreate() {
    setError("");
    setShortUrl("");

    if (!destination) {
      setError("Paste a destination URL first.");
      return;
    }

    const code = randomCode();

    const { error: insertError } = await supabase
      .from("links")
      .insert({ code, destination_url: destination });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setShortUrl(`${window.location.origin}/x/${code}`);
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

      <button onClick={handleCreate} style={{ marginTop: "12px" }}>
        Create link
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {shortUrl && (
        <p style={{ marginTop: "16px" }}>
          Your link: <a href={shortUrl}>{shortUrl}</a>
        </p>
      )}
    </main>
  );
    }
