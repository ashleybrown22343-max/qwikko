"use client";
import { useState, useRef, useEffect } from "react";

export default function AdGate({ onComplete, children }) {
  const [isAdShowing, setIsAdShowing] = useState(false);
  const [hasShown, setHasShown] = useState(false); // Reset this after each action
  const adContainerRef = useRef(null);

  const runInPagePush = () => {
    setIsAdShowing(true);
    
    // Clear previous container if it exists
    if (adContainerRef.current) {
      adContainerRef.current.innerHTML = "";
    }

    // Create a fixed div at the top for the ad (non-intrusive)
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "fixed";
    tempDiv.style.top = "0";
    tempDiv.style.left = "0";
    tempDiv.style.width = "100%";
    tempDiv.style.zIndex = "99999";
    tempDiv.style.background = "white";
    tempDiv.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    tempDiv.style.padding = "0";
    document.body.appendChild(tempDiv);
    adContainerRef.current = tempDiv;

    // Inject your exact Monetag In-Page Push script
    const script = document.createElement("script");
    script.src = "https://nap5k.com/tag.min.js";
    script.dataset.zone = "11710551";
    script.async = true;
    tempDiv.appendChild(script);

    // Give the ad 5 seconds to fully display
    setTimeout(() => {
      finish();
    }, 5000);
  };

  const finish = () => {
    setIsAdShowing(false);
    if (adContainerRef.current) {
      adContainerRef.current.remove();
      adContainerRef.current = null;
    }
    setHasShown(false); // ✅ Reset so it shows again on the next action
    onComplete();
  };

  const handleClick = () => {
    // If the ad is already showing, don't trigger another one
    if (isAdShowing) return;
    runInPagePush();
  };

  return (
    <>
      <div onClick={handleClick} style={{ width: "100%" }}>
        {children}
      </div>

      {/* Dim the background while ad is loading */}
      {isAdShowing && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 99998 }} />
      )}
    </>
  );
      }
