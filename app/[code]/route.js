import { supabase } from "../../lib/supabase";
import { NextResponse } from "next/server";

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderLandingPage(linkType, content) {
  let title = "Qwikko";
  let body = "";

  // Common styles for all landing pages
  const styles = `
    body { font-family: system-ui, sans-serif; background: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 2rem; max-width: 400px; width: 100%; text-align: center; }
    h1 { color: #0f172a; margin-bottom: 1rem; }
    .info { margin-bottom: 1rem; }
    .label { font-weight: 600; color: #64748b; }
    .value { font-size: 1.1rem; color: #0f172a; word-break: break-all; }
    a { color: #2563eb; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
    button { background: #2563eb; color: white; border: none; padding: 0.7rem 1rem; border-radius: 8px; cursor: pointer; font-size: 1rem; width: 100%; margin-top: 1rem; }
    button:hover { background: #1d4ed8; }
  `;

  if (linkType === "text") {
    title = "Message";
    body = `
      <div class="info">
        <p class="value" style="white-space: pre-wrap;">${escapeHtml(content.text)}</p>
      </div>
      <a href="/">Go to Qwikko</a>
    `;
  } else if (linkType === "wifi") {
    title = "Wi-Fi Network";
    body = `
      <div class="info">
        <div><span class="label">Network:</span> <span class="value">${escapeHtml(content.ssid)}</span></div>
        <div style="margin-top: 0.5rem;"><span class="label">Password:</span> <span class="value">${escapeHtml(content.password)}</span></div>
      </div>
      <button onclick="navigator.clipboard.writeText('${escapeHtml(content.password)}')">Copy Password</button>
      <p style="color: #64748b; font-size: 0.85rem; margin-top: 1rem;">Open your phone's Wi-Fi settings and enter these manually.</p>
    `;
  } else if (linkType === "vcard") {
    title = escapeHtml(content.name || "Contact");
    body = `
      <div class="info">
        <div><span class="label">Name:</span> <span class="value">${escapeHtml(content.name)}</span></div>
        <div style="margin-top: 0.5rem;"><span class="label">Phone:</span> <span class="value">${escapeHtml(content.vPhone)}</span></div>
        <div style="margin-top: 0.5rem;"><span class="label">Email:</span> <span class="value">${escapeHtml(content.vEmail)}</span></div>
      </div>
      <a href="tel:${escapeHtml(content.vPhone)}">Call ${escapeHtml(content.name)}</a>
    `;
  }

  return `
    <html>
      <head>
        <title>${title} - Qwikko</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>${styles}</style>
      </head>
      <body>
        <div class="card">
          <h1>${title}</h1>
          ${body}
        </div>
      </body>
    </html>
  `;
}

export async function GET(request, { params }) {
  const { code } = params;

  const { data: link, error } = await supabase
    .from("links")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !link) {
    const notFoundHtml = `
      <html>
        <head>
          <title>Link not found - Qwikko</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { font-family: system-ui, sans-serif; background: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; color: #0f172a; }
            .container { text-align: center; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
            h1 { font-size: 5rem; color: #2563eb; margin: 0; }
            p { color: #64748b; margin: 1rem 0; }
            a { display: inline-block; background: #2563eb; color: white; padding: 0.6rem 1.2rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404</h1>
            <p>Oops! The link you're trying to access doesn't exist.</p>
            <a href="/">Go to Home</a>
          </div>
        </body>
      </html>
    `;
    return new NextResponse(notFoundHtml, { status: 404, headers: { "content-type": "text/html" } });
  }

  const country = request.headers.get("x-vercel-ip-country") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const referrer = request.headers.get("referer") || "direct";

  await supabase.from("click_logs").insert({
    link_code: code,
    country,
    device: userAgent,
    referrer,
  });

  await supabase.from("links").update({ clicks: (link.clicks || 0) + 1 }).eq("code", code);

  const redirectTypes = ["url", "whatsapp", "phone", "email"];

  if (redirectTypes.includes(link.link_type)) {
    let destination = link.destination_url;
    if (!/^https?:\/\//i.test(destination) && !/^(tel|mailto):/i.test(destination)) {
      destination = "https://" + destination;
    }
    return NextResponse.redirect(destination);
  }

  const html = renderLandingPage(link.link_type, link.content || {});
  return new NextResponse(html, { headers: { "content-type": "text/html" } });
}
