// app/generate/page.js
"use client";

import { useState, useRef } from "react";
import QRCode from "qrcode";
import { supabase } from "../../lib/supabase";
import { Button, Card, Input, Alert, Spinner } from "../../components/ui";

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
  const [loading, setLoading] = useState(false);
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

  function downloadQr() {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qwikko-qr.png";
    a.click();
  }

  async function generate() {
    setError("");
    setShortUrl("");
    setLoading(true);

    const rawContent = buildRawContent();
    if (!rawContent) {
      setError("Please fill in the required fields.");
      setLoading(false);
      return;
    }

    if (!trackable) {
      await drawQr(rawContent);
      setLoading(false);
      return;
    }

    const code = randomCode();
    const isRedirectType = ["URL", "WhatsApp", "Phone", "Email"].includes(type);

    const row = {
      code,
      link_type: type.toLowerCase(),
    };

    if (isRedirectType) {
      row.destination_url = rawContent;
    } else {
      row.content = fields;
    }

    // Add user id if logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session) row.user_id = session.user.id;

    const { error: insertError } = await supabase.from("links").insert(row);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    const url = `${window.location.origin}/${code}`;
    setShortUrl(url);
    await drawQr(url);
    setLoading(false);
  }

  function renderFields() {
    switch (type) {
      case "URL":
        return <Input label="Destination URL" placeholder="https://example.com" value={fields.url || ""} onChange={(e) => updateField("url", e.target.value)} />;
      case "Text":
        return <Input label="Text content" placeholder="Any text" value={fields.text || ""} onChange={(e) => updateField("text", e.target.value)} />;
      case "Email":
        return <Input label="Email address" placeholder="someone@example.com" value={fields.email || ""} onChange={(e) => updateField("email", e.target.value)} />;
      case "Phone":
        return <Input label="Phone number" placeholder="+2348012345678" value={fields.phone || ""} onChange={(e) => updateField("phone", e.target.value)} />;
      case "WhatsApp":
        return (
          <>
            <Input label="WhatsApp number" placeholder="2348012345678" value={fields.waPhone || ""} onChange={(e) => updateField("waPhone", e.target.value)} />
            <Input label="Pre-filled message (optional)" placeholder="Hello!" value={fields.message || ""} onChange={(e) => updateField("message", e.target.value)} />
          </>
        );
      case "WiFi":
        return (
          <>
            <Input label="Network name (SSID)" placeholder="MyWiFi" value={fields.ssid || ""} onChange={(e) => updateField("ssid", e.target.value)} />
            <Input label="Password" placeholder="password" value={fields.password || ""} onChange={(e) => updateField("password", e.target.value)} />
          </>
        );
      case "vCard":
        return (
          <>
            <Input label="Full name" placeholder="John Doe" value={fields.name || ""} onChange={(e) => updateField("name", e.target.value)} />
            <Input label="Phone" placeholder="+1234567890" value={fields.vPhone || ""} onChange={(e) => updateField("vPhone", e.target.value)} />
            <Input label="Email" placeholder="john@example.com" value={fields.vEmail || ""} onChange={(e) => updateField("vEmail", e.target.value)} />
          </>
        );
      default:
        return null;
    }
  }

  return (
    <main className="container" style={{ maxWidth: "600px", padding: "2rem" }}>
      <h1>Generate a QR Code</h1>
      <Card style={{ marginTop: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label className="label">Type</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {renderFields()}

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
          <input type="checkbox" checked={trackable} onChange={(e) => setTrackable(e.target.checked)} />
          Make this a trackable smart link
        </label>

        {error && <Alert type="error">{error}</Alert>}

        <Button onClick={generate} variant="primary" disabled={loading} style={{ marginTop: "1rem", width: "100%" }}>
          {loading ? "Generating..." : "Generate QR"}
        </Button>
      </Card>

      {shortUrl && (
        <Alert type="success" style={{ marginTop: "1rem" }}>
          Smart link: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
        </Alert>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <canvas ref={canvasRef} />
        {canvasRef.current && (
          <Button onClick={downloadQr} variant="secondary" style={{ marginTop: "1rem" }}>
            Download QR
          </Button>
        )}
      </div>
    </main>
  );
        }
