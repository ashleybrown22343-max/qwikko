"use client";

import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    // Check if script already exists to avoid duplicates
    if (document.getElementById("adsterra-social-bar")) return;

    const script = document.createElement("script");
    script.id = "adsterra-social-bar";
    script.src = "https://pl31145407.profitableratecpmnetwork.com/25/62/2a/25622aa3eb2e34686edc45155c84e026.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // This creates a fixed, non-intrusive footer space so the ad doesn't push your content
  return <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 50, height: "50px", pointerEvents: "none" }} />;
}
