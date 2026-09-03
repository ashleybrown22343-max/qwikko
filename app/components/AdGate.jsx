"use client";
import { useState, useEffect, useRef } from "react";

export default function AdGate({ onComplete, zoneId, sdkName, children }) {
  const [isAdShowing, setIsAdShowing] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const adsterraContainerRef = useRef(null);

  useEffect(() => {
    // Inject Monetag script once
    if (!window[sdkName] && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://n6wxm.com/vignette.min.js";
      script.dataset.zone = zoneId;
      script.async = true;
      document.body.appendChild(script);
    }
  }, [zoneId, sdkName]);

  const finish = () => {
    setIsAdShowing(false);
    onComplete();
  };

  const runFallbackAdsterra = () => {
    // If no container, just finish
    if (!adsterraContainerRef.current) {
      finish();
      return;
    }

    // Inject Adsterra Invoke script
    const s = document.createElement("script");
    s.src = "https://www.highrevenueformat.com/3387ce4d21845990330977e5f740977a/invoke.js";
    s.async = true;
    adsterraContainerRef.current.appendChild(s);

    // Give the fallback ad 5 seconds to show, then proceed
    setTimeout(() => finish(), 5000);
  };

  const attemptMonetag = () => {
    if (window[sdkName]) {
      // Add a timeout in case it hangs
      const timeout = setTimeout(() => runFallbackAdsterra(), 5000);

      window[sdkName]()
        .then(() => {
          clearTimeout(timeout);
          finish();
        })
        .catch(() => {
          clearTimeout(timeout);
          runFallbackAdsterra();
        });
    } else {
      runFallbackAdsterra();
    }
  };

  const handleClick = () => {
    // Only show once per session
    if (hasShown || localStorage.getItem("qwikko_ad_shown")) {
      onComplete();
      return;
    }

    localStorage.setItem("qwikko_ad_shown", "true");
    setHasShown(true);
    setIsAdShowing(true);
    
    // Wait a moment for Monetag SDK to attach if it was just loaded
    setTimeout(() => attemptMonetag(), 1000);
  };

  return (
    <>
      <div onClick={handleClick} style={{ display: "inline-block", width: "100%" }}>
        {children}
      </div>

      {/* Real Ad Overlay (No placeholders, real scripts are injected) */}
      {isAdShowing && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "#0f172a", zIndex: 9999, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          
          {/* Monetag calls its own full-screen */}
          {!adsterraContainerRef.current && <p style={{ color: "white" }}>Loading Ad...</p>}

          {/* Adsterra Fallback Container */}
          <div ref={adsterraContainerRef} style={{ width: "320px", height: "50px", background: "#fff", borderRadius: "8px", overflow: "hidden" }} />
          
          <p style={{ color: "#94a3b8", marginTop: "20px", fontSize: "0.9rem" }}>Please wait...</p>
        </div>
      )}
    </>
  );
      }
