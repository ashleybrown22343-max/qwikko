"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import { supabase } from "../../lib/supabase";
import { Button, Card, Input, Alert } from "../../components/ui";

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
  
  // Customization states
  const [qrColor, setQrColor] = useState("#2563EB");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [size, setSize] = useState(260);
  const [margin, setMargin] = useState(2);
  const [logoUrl, setLogoUrl] = useState("");

  const canvasRef = useRef(null);

  function updateField(key, value) {
    setFields({ ...fields, [key]: value });
  }

  function buildRawContent() {
    switch (type) {
      case "URL": return fields.url || "";
      case "Text": return fields.text || "";
      case "Email": return `mailto:${fields.email || ""}`;
      case "Phone": return `tel:${fields.phone || ""}`;
      case "WhatsApp": {
        const msg = encodeURIComponent(fields.message || "");
        return `https://wa.me/${fields.waPhone || ""}?text=${msg}`;
      }
      case "WiFi": return `WIFI:T:${fields.enc || "WPA"};S:${fields.ssid || ""};P:${fields.password || ""};;`;
      case "vCard": return `BEGIN:VCARD\nVERSION:3.0\nN:${fields.name || ""}\nTEL:${fields.vPhone || ""}\nEMAIL:${fields.vEmail || ""}\nEND:VCARD`;
      default: return "";
    }
  }

  async function drawQr(content) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Generate the QR code
    await new Promise((resolve) => {
      QRCode.toCanvas(canvas, content, {
        width: size,
        margin: margin,
        color: { dark: qrColor, light: bgColor },
        errorCorrectionLevel: 'H', // High for logo overlay
      }, (err) => {
        if (err) console.error(err);
        resolve();
      });
    });

    // Overlay Logo (if provided)
    if (logoUrl) {
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.crossOrigin = "anonymous"; // For URL logos
      img.onload = () => {
        const logoSize = size * 0.2; // Logo is 20% of QR size
        const x = (size - logoSize) / 2;
        const y = (size - logoSize) / 2;
        
        // Draw white background behind logo for visibility
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
        ctx.drawImage(img, x, y, logoSize, logoSize);
      };
      img.src = logoUrl;
    }
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

    const row = { code, link_type: type.toLowerCase() };
    if (isRedirectType) row.destination_url = rawContent;
    else { row.content = fields; row.destination_url = null; }

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
      case "URL": return <Input label="Destination URL" placeholder="https://example.com" value={fields.url || ""} onChange={(e) => updateField("url", e.target.value)} />;
      case "Text": return <Input label="Text content" placeholder="Any text" value={fields.text || ""} onChange={(e) => updateField("text", e.target.value)} />;
      case "Email": return <Input label="Email address" placeholder="someone@example.com" value={fields.email || ""} onChange={(e) => updateField("email", e.target.value)} />;
      case "Phone": return <Input label="Phone number" placeholder="+2348012345678" value={fields.phone || ""} onChange={(e) => updateField("phone", e.target.value)} />;
      case "WhatsApp": return (
        <>
          <Input label="WhatsApp number" placeholder="2348012345678" value={fields.waPhone || ""} onChange={(e) => updateField("waPhone", e.target.value)} />
          <Input label="Pre-filled message (optional)" placeholder="Hello!" value={fields.message || ""} onChange={(e) => updateField("message", e.target.value)} />
        </>
      );
      case "WiFi": return (
        <>
          <Input label="Network name (SSID)" placeholder="MyWiFi" value={fields.ssid || ""} onChange={(e) => updateField("ssid", e.target.value)} />
          <Input label="Password" placeholder="password" value={fields.password || ""} onChange={(e) => updateField("password", e.target.value)} />
        </>
      );
      case "vCard": return (
        <>
          <Input label="Full name" placeholder="John Doe" value={fields.name || ""} onChange={(e) => updateField("name", e.target.value)} />
          <Input label="Phone" placeholder="+1234567890" value={fields.vPhone || ""} onChange={(e) => updateField("vPhone", e.target.value)} />
          <Input label="Email" placeholder="john@example.com" value={fields.vEmail || ""} onChange={(e) => updateField("vEmail", e.target.value)} />
        </>
      );
      default: return null;
    }
  }

  return (
    <main className="container" style={{ maxWidth: "700px", padding: "2rem" }}>
      <h1>Generate a QR Code</h1>
      <Card style={{ marginTop: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label className="label">Type</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
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

      {/* Customization Section */}
      <Card style={{ marginTop: "1rem" }}>
        <h3>Customize QR</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
          <div>
            <label className="label">Foreground Color</label>
            <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} style={{ width: "100%", height: "40px", border: "1px solid var(--border)", borderRadius: "8px", padding: "2px" }} />
          </div>
          <div>
            <label className="label">Background Color</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: "100%", height: "40px", border: "1px solid var(--border)", borderRadius: "8px", padding: "2px" }} />
          </div>
        </div>
        
        <div style={{ marginTop: "1rem" }}>
          <label className="label">Size: {size}px</label>
          <input type="range" min="200" max="500" value={size} onChange={(e) => setSize(Number(e.target.value))} style={{ width: "100%" }} />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label className="label">Margin: {margin}</label>
          <input type="range" min="0" max="10" value={margin} onChange={(e) => setMargin(Number(e.target.value))} style={{ width: "100%" }} />
        </div>

        <Input label="Logo URL (optional)" placeholder="https://example.com/logo.png" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
      </Card>

      {shortUrl && (
        <Alert type="success" style={{ marginTop: "1rem" }}>
          Smart link: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
        </Alert>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <canvas ref={canvasRef} />
        <Button onClick={downloadQr} variant="secondary" style={{ marginTop: "1rem" }}>
          Download QR
        </Button>
      </div>
    </main>
  );
                      }
