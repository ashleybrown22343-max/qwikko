"use client";

import { useState, useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import { supabase } from "../../lib/supabase";
import { Button, Card, Input, Alert } from "../components/ui";

const TYPES = ["URL", "Text", "Email", "Phone", "WhatsApp", "WiFi", "vCard"];

// Predefined themes
const THEMES = {
  "Blue Gradient": {
    dotsOptions: { color: "#2563EB", type: "rounded" },
    backgroundOptions: { color: "#ffffff" },
    cornersSquareOptions: { color: "#1D4ED8", type: "extra-rounded" },
    cornersDotOptions: { color: "#2563EB" },
    imageOptions: { crossOrigin: "anonymous", margin: 5 },
  },
  "Minimal Black": {
    dotsOptions: { color: "#000000", type: "square" },
    backgroundOptions: { color: "#ffffff" },
    cornersSquareOptions: { color: "#000000", type: "square" },
    cornersDotOptions: { color: "#000000" },
  },
  "Corporate Navy": {
    dotsOptions: { color: "#0F172A", type: "classy" },
    backgroundOptions: { color: "#F8FAFC" },
    cornersSquareOptions: { color: "#0F172A", type: "extra-rounded" },
    cornersDotOptions: { color: "#0F172A" },
  },
  "Warm Sunset": {
    dotsOptions: { color: "#F59E0B", type: "dots" },
    backgroundOptions: { color: "#FFF7ED" },
    cornersSquareOptions: { color: "#F97316", type: "dot" },
    cornersDotOptions: { color: "#F97316" },
  },
};

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
  const [theme, setTheme] = useState("Blue Gradient");
  const [foregroundColor, setForegroundColor] = useState("#2563EB");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [useGradient, setUseGradient] = useState(false);
  const [gradientFrom, setGradientFrom] = useState("#2563EB");
  const [gradientTo, setGradientTo] = useState("#1D4ED8");
  const [dotsType, setDotsType] = useState("rounded"); // square, dots, rounded, classy, extra-rounded
  const [cornerSquareType, setCornerSquareType] = useState("extra-rounded"); // square, dot, extra-rounded
  const [cornerDotType, setCornerDotType] = useState("square"); // square, dot
  const [logoUrl, setLogoUrl] = useState("");
  const [size, setSize] = useState(260);
  const [margin, setMargin] = useState(2);

  const qrRef = useRef(null);
  const qrInstance = useRef(null);

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

  // Configure QR instance
  function getQRCodeOptions(content) {
    return {
      width: size,
      height: size,
      type: "canvas",
      data: content,
      margin: margin,
      image: logoUrl || undefined,
      imageOptions: { crossOrigin: "anonymous", margin: 5 },
      qrOptions: { errorCorrectionLevel: "H" },
      dotsOptions: {
        color: useGradient ? undefined : foregroundColor,
        gradient: useGradient ? { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: gradientFrom }, { offset: 1, color: gradientTo }] } : undefined,
        type: dotsType,
      },
      backgroundOptions: { color: backgroundColor },
      cornersSquareOptions: { color: useGradient ? gradientTo : foregroundColor, type: cornerSquareType },
      cornersDotOptions: { color: useGradient ? gradientTo : foregroundColor, type: cornerDotType },
    };
  }

  async function drawQr(content) {
    if (qrInstance.current) {
      qrInstance.current.update({ data: content });
    } else {
      qrInstance.current = new QRCodeStyling(getQRCodeOptions(content));
      qrInstance.current.append(qrRef.current);
    }
  }

  function downloadQr() {
    if (!qrInstance.current) return;
    qrInstance.current.download({ name: "qwikko-qr", extension: "png" });
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

  // Re-draw when customization changes (if QR already generated)
  useEffect(() => {
    if (qrInstance.current) {
      const currentData = qrInstance.current._options?.data;
      if (currentData) {
        qrInstance.current.update(getQRCodeOptions(currentData));
      }
    }
  }, [theme, foregroundColor, backgroundColor, useGradient, gradientFrom, gradientTo, dotsType, cornerSquareType, cornerDotType, logoUrl, size, margin]);

  // Apply theme when selected
  function applyTheme(themeName) {
    const themeOptions = THEMES[themeName];
    if (themeOptions) {
      setTheme(themeName);
      setForegroundColor(themeOptions.dotsOptions.color || "#2563EB");
      setBackgroundColor(themeOptions.backgroundOptions.color || "#FFFFFF");
      setDotsType(themeOptions.dotsOptions.type || "rounded");
      setCornerSquareType(themeOptions.cornersSquareOptions.type || "extra-rounded");
      setCornerDotType(themeOptions.cornersDotOptions.type || "square");
      if (themeOptions.dotsOptions.gradient) {
        setUseGradient(true);
        setGradientFrom(themeOptions.dotsOptions.gradient.colorStops[0].color);
        setGradientTo(themeOptions.dotsOptions.gradient.colorStops[1].color);
      } else {
        setUseGradient(false);
      }
    }
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
    <main className="container" style={{ maxWidth: "800px", padding: "2rem" }}>
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

      {/* Customization Panel */}
      <Card style={{ marginTop: "1rem" }}>
        <h3>Customize QR</h3>

        {/* Theme Selector */}
        <div style={{ marginTop: "1rem" }}>
          <label className="label">Theme</label>
          <select className="input" value={theme} onChange={(e) => applyTheme(e.target.value)}>
            {Object.keys(THEMES).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Advanced Options */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
          <div>
            <label className="label">Foreground Color</label>
            <input type="color" value={foregroundColor} onChange={(e) => setForegroundColor(e.target.value)} style={{ width: "100%", height: "40px", border: "1px solid var(--border)", borderRadius: "8px", padding: "2px" }} />
          </div>
          <div>
            <label className="label">Background Color</label>
            <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} style={{ width: "100%", height: "40px", border: "1px solid var(--border)", borderRadius: "8px", padding: "2px" }} />
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
          <input type="checkbox" checked={useGradient} onChange={(e) => setUseGradient(e.target.checked)} />
          Use Gradient
        </label>
        {useGradient && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "0.5rem" }}>
            <div>
              <label className="label">From</label>
              <input type="color" value={gradientFrom} onChange={(e) => setGradientFrom(e.target.value)} style={{ width: "100%", height: "40px", border: "1px solid var(--border)", borderRadius: "8px", padding: "2px" }} />
            </div>
            <div>
              <label className="label">To</label>
              <input type="color" value={gradientTo} onChange={(e) => setGradientTo(e.target.value)} style={{ width: "100%", height: "40px", border: "1px solid var(--border)", borderRadius: "8px", padding: "2px" }} />
            </div>
          </div>
        )}

        <div style={{ marginTop: "1rem" }}>
          <label className="label">Dot Style</label>
          <select className="input" value={dotsType} onChange={(e) => setDotsType(e.target.value)}>
            <option value="square">Square</option>
            <option value="dots">Dots</option>
            <option value="rounded">Rounded</option>
            <option value="classy">Classy</option>
            <option value="extra-rounded">Extra Rounded</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
          <div>
            <label className="label">Corner Square Style</label>
            <select className="input" value={cornerSquareType} onChange={(e) => setCornerSquareType(e.target.value)}>
              <option value="square">Square</option>
              <option value="dot">Dot</option>
              <option value="extra-rounded">Extra Rounded</option>
            </select>
          </div>
          <div>
            <label className="label">Corner Dot Style</label>
            <select className="input" value={cornerDotType} onChange={(e) => setCornerDotType(e.target.value)}>
              <option value="square">Square</option>
              <option value="dot">Dot</option>
            </select>
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
        <div ref={qrRef} />
        <Button onClick={downloadQr} variant="secondary" style={{ marginTop: "1rem" }}>
          Download QR
        </Button>
      </div>
    </main>
  );
}
