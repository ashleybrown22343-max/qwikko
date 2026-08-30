import { supabase } from "../../lib/supabase";
import { NextResponse } from "next/server";

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderLandingPage(linkType, content) {
  let title = "Qwikko";
  let body = "";

  if (linkType === "text") {
    title = "Message";
    body = `<p style="font-size:1.1rem;white-space:pre-wrap;">${escapeHtml(content.text)}</p>`;
  } else if (linkType === "wifi") {
    title = "Wi-Fi network";
    body = `
      <p><strong>Network:</strong> ${escapeHtml(content.ssid)}</p>
      <p><strong>Password:</strong> ${escapeHtml(content.password)}</p>
      <p style="color:#666;font-size:0.9rem;">Open your phone's Wi-Fi settings and enter these manually.</p>
    `;
  } else if (linkType === "vcard") {
    title = escapeHtml(content.name || "Contact");
    body = `
      <p><strong>Name:</strong> ${escapeHtml(content.name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(content.vPhone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(content.vEmail)}</p>
    `;
  }

  return `
    <html>
      <head><title>${title}</title><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body style="font-family:system-ui,sans-serif;padding:24px;background:#F7F9FC;color:#16213E;">
        <h1>${title}</h1>
        ${body}
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

  // 🎨 Custom 404 page for unknown links
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
            a:hover { background: #1d4ed8; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404</h1>
            <p>Oops! The link you're trying to access doesn't exist or has been removed.</p>
            <a href="/">Go to Home</a>
          </div>
        </body>
      </html>
    `;
    return new NextResponse(notFoundHtml, {
      status: 404,
      headers: { "content-type": "text/html" },
    });
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

  await supabase
    .from("links")
    .update({ clicks: (link.clicks || 0) + 1 })
    .eq("code", code);

  const redirectTypes = ["url", "whatsapp", "phone", "email"];

  if (redirectTypes.includes(link.link_type)) {
    let destination = link.destination_url;
    if (!/^https?:\/\//i.test(destination) && !/^(tel|mailto):/i.test(destination)) {
      destination = "https://" + destination;
    }
    return NextResponse.redirect(destination);
  }

  const html = renderLandingPage(link.link_type, link.content || {});
  return new NextResponse(html, {
    headers: { "content-type": "text/html" },
  });
      }
