// app/components/BannerAds.jsx
"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function BannerAds() {
  // Inject the "atOptions" objects for the banners
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 728x90 Banner
      window.atOptions = {
        'key' : '42d8f18597442e7c22e5a15256b0685',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
      // 320x50 Banner
      window.atOptions = {
        'key' : '3387ce4d21845990330977e5f740977a',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      
      {/* Ad 3: Native Banner */}
      <Script
        src="https://pl31157366.profitableratecpmnetwork.com/025fb75007f85066894958fdd706a051/invoke.js"
        strategy="afterInteractive"
      />
      <div id="container-025fb75007f85066894958fdd706a051"></div>

      {/* Ad 4: 728x90 Banner (Desktop) */}
      <div style={{ display: "none", "@media(min-width: 768px)": { display: "block" } }}>
        <Script
          src="https://www.highrevenueformat.com/42d8f18597442e7c22e5a15256b0685/invoke.js"
          strategy="afterInteractive"
        />
      </div>

      {/* Ad 5: 320x50 Banner (Mobile) */}
      <div style={{ display: "block", "@media(min-width: 768px)": { display: "none" } }}>
        <Script
          src="https://www.highrevenueformat.com/3387ce4d21845990330977e5f740977a/invoke.js"
          strategy="afterInteractive"
        />
      </div>
      
    </div>
  );
      }
