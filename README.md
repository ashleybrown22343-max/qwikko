# Qwikko

Free QR code generator + branded smart links (`qwikko.com/abc123`) with click/scan analytics, for small businesses and creators.

## What it does

- **QR generator** (`/generate`) — URL, text, email, phone, WhatsApp, WiFi, and vCard QR codes. Downloadable as PNG.
- **Smart links** (`/create`) — turn any URL into a short, trackable link. Optional custom codes (e.g. `qwikko.com/cresoa`).
- **Trackable QR codes** — any QR type can optionally be wrapped in a smart link, so scans show up in analytics too.
- **QR scanner** (`/scan`) — scan codes using the device camera, no app install needed.
- **Dashboard** (`/dashboard`) — per-user view of links, click counts, country/device breakdown, and recent activity.
- **Accounts** — email/password or Google sign-in. Guests can still generate QR codes and create links without an account, but only signed-in users get a dashboard to manage and track theirs.

## Stack

- **Next.js** (App Router) — hosted on Vercel (free tier)
- **Supabase** — Postgres (links, click_logs), Auth (email + Google), Row Level Security
- `qrcode` — client-side QR generation
- `jsqr` — client-side QR scanning via camera

## Project structure

\```
app/
  page.js              → homepage
  generate/page.js      → QR generator
  create/page.js         → smart link creator
  scan/page.js            → camera-based QR scanner
  dashboard/page.js       → per-user link + analytics dashboard
  login/page.js           → sign in / sign up (email + Google)
  [code]/route.js         → resolves a short code: redirects, or shows
                             a landing page for Text/WiFi/vCard types
lib/
  supabase.js            → Supabase client
\```

## Environment variables (set in Vercel)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Access model

- **Guests**: can generate QR codes and create smart links. These are "unowned" — not editable or visible in any dashboard afterward.
- **Signed-in users**: links are tied to their account. Only they can view, edit, or delete their own links, and only they can see the click analytics for them.
- Redirects and click-logging for *any* link (guest or owned) work through two narrow Postgres functions (`get_link_by_code`, `log_click`) rather than public table access, so the tables stay locked down to owners only.

## Known limitations

- No custom domain yet — running on `.vercel.app`.
- Google sign-in currently shows Supabase's project domain during consent (fixable once a custom domain is bought and verified with Google).
- No rate-limiting yet on guest link/QR creation.
- No terms of service or privacy policy pages yet.

## Roadmap

- Buy and connect `qwikko.com`
- Verify domain with Google for proper OAuth branding
- Add terms of service + privacy policy
- Basic SEO (meta tags, Open Graph, favicon)
- Rate-limiting on guest usage
