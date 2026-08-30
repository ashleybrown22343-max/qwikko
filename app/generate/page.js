"use client";

import { useState, useRef } from "react";
import QRCode from "qrcode";
import { supabase } from "../../lib/supabase";

const TYPES = ["URL", "Text", "Email", "Phone", "WhatsApp", "WiFi", "vCard"];

function randomCode(length = 6) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function Generate() {
  const [type, setType] = useState("URL");
  const [fields, setFields] = useState({});
  const [trackable, setTrackable] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  function updateField(key, value) {
    setFields({ ...fields, [key]: value });
  }

  function buildRawContent() {
    switch (type) {
      case "URL":
        return fields.url || "";
      case "Text":
        return fields.text || "";
      case "Email":
        return `mailto:${fields.email || ""}`;
      case "Phone":
        return `tel:${fields.phone || ""}`;
      case "WhatsApp":
        const msg = encodeURIComponent(fields.message || "");
        return `https://wa.me/${fields.waPhone || ""}?text=${msg}`;
      case "WiFi":
        return `WIFI:T:${fields.enc || "WPA"};S:${fields.ssid || ""};P:${fields.password || ""};;`;
      case "vCard":
        return `BEGIN:VCARD
VERSION:3.0
N:${fields.name || ""}
TEL:${fields.vPhone || ""}
EMAIL:${fields.vEmail || ""}
END:VCARD`;
      default:
        return "";
    }
  }

  async function drawQr(content) {
    QRCode.toCanvas(canvasRef.current, content, { width: 260 }, (err) => {
      if (err) console.error(err);
    });
  }

  async function generate() {
    setError("");
    setShortUrl("");

    const rawContent = buildRawContent();
    if (!rawContent) return;

    if (!trackable) {
      await drawQr(rawContent);
      return;
    }

    // trackable: create a smart link, encode the short URL in the QR instead
    const code = randomCode();
    const isRedirectType = ["URL", "WhatsApp", "Phone", "Email"].includes(type);

    const row = {
      code,
      link_type: type.toLowerCase(),
    };

    if (isRedirectType) {
      row.destination_url = rawContent;
    } else {
      row.content = fields; // raw field data for Text/WiFi/vCard landing page
    }

    const { error: insertError } = await supabase.from("links").insert(row);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    const url = `${window.location.origin}/${code}`;
    setShortUrl(url);
    await drawQr(url);
  }

  function renderFields() {
    switch (type) {
      case "URL":
        return <input placeholder="https://example.com" onChange={(e) => updateField("url", e.target.value)} />;
      case "Text":
        return <input placeholder="Any text" onChange={(e) => updateField("text", e.target.value)} />;
      case "Email":
        return <input placeholder="someone@example.com" onChange={(e) => updateField("email", e.target.value)} />;
      case "Phone":
        return <input placeholder="+2348012345678" onChange={(e) => updateField("phone", e.target.value)} />;
      case "WhatsApp":
        return (
          <>
            <input placeholder="WhatsApp number, e.g. 2348012345678" onChange={(e) => updateField("waPhone", e.target.value)} />
            <input placeholder="Pre-filled message (optional)" onChange={(e) => updateField("message", e.target.value)} />
          </>
        );
      case "WiFi":
        return (
          <>
            <input placeholder="Network name (SSID)" onChange={(e) => updateField("ssid", e.target.value)} />
            <input placeholder="Password" onChange={(e) => updateField("password", e.target.value)} />
          </>
        );
      case "vCard":
        return (
          <>
            <input placeholder="Full name" onChange={(e) => updateField("name", e.target.value)} />
            <input placeholder="Phone" onChange={(e) => updateField("vPhone", e.target.value)} />
            <input placeholder="Email" onChange={(e) => updateField("vEmail", e.target.value)} />
          </>
        );
      default:
        return null;
    }
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1>Generate a QR code</h1>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        {TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
        {renderFields()}
      </div>

      <label style={{ display: "block", marginTop: "12px" }}>
        <input
          type="checkbox"
          checked={trackable}
          onChange={(e) => setTrackable(e.target.checked)}
        />{" "}
        Make this a trackable smart link
      </label>

      <button onClick={generate} style={{ marginTop: "16px" }}>
        Generate QR
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {shortUrl && (
        <p style={{ marginTop: "12px" }}>
          Smart link: <a href={shortUrl}>{shortUrl}</a>
        </p>
      )}

      <div style={{ marginTop: "24px" }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </main>
  );
      }
