"use client";
import { useState, useEffect } from "react";

export default function AdGate({ onComplete, zoneId, sdkName, children }) {
  const [isAdShowing, setIsAdShowing] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Inject the Monetag Rewarded Interstitial script once
    if (typeof window === "undefined" || window[sdkName]) return;

    const script = document.createElement("script");
    script.src = `https://n6wxm.com/vignette.min.js`; // Correct domain for your zone
    script.dataset.zone = zoneId;
    script.dataset.sdk = sdkName;
    document.body.appendChild(script);
  }, [zoneId, sdkName]);

  const handleClick = () => {
    // Only show ad once per session to avoid annoying users
    if (hasShown || !window[sdkName]) {
      onComplete();
      return;
    }

    setHasShown(true);
    setIsAdShowing(true);

    // Call the SDK's show function. It returns a Promise that resolves after the ad is seen.
    window[sdkName]()
      .then(() => {
        setIsAdShowing(false);
        onComplete(); // Execute the real action (Generate/Create)
      })
      .catch((err) => {
        console.error("Ad error:", err);
        setIsAdShowing(false);
        onComplete(); // Fallback: proceed even if ad fails
      });
  };

  return (
    <>
      <div onClick={handleClick} style={{ display: "inline-block" }}>
        {children}
      </div>

      {/* Overlay UI while the ad is being prepared (Monetag handles the actual ad frame) */}
      {isAdShowing && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "var(--navy)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p style={{ color: "white", fontSize: "1.2rem" }}>Loading Ad...</p>
        </div>
      )}
    </>
  );
}
