import { supabase } from "../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { code } = params;

  const { data: link, error } = await supabase
    .from("links")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !link) {
    return new NextResponse("Link not found", { status: 404 });
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

  let destination = link.destination_url;
  if (!/^https?:\/\//i.test(destination)) {
    destination = "https://" + destination;
  }

  return NextResponse.redirect(destination);
}
