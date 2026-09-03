"use client";
import { useState, useRef } from "react";

export default function AdGate({ onComplete, children }) {
  const [isAdShowing, setIsAdShowing] = useState(false);
  const adContainerRef = useRef(null);

  const runAdsterraAd = () => {
    setIsAdShowing(true);
    if (adContainerRef.current) {
      adContainerRef.current.innerHTML = "";
    }
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "fixed";
    tempDiv.style.top = "0";
    tempDiv.style.left = "0";
    tempDiv.style.width = "100%";
    tempDiv.style.zIndex = "99999";
    tempDiv.style.background = "white";
    tempDiv.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    document.body.appendChild(tempDiv);
    adContainerRef.current = tempDiv;

    const script = document.createElement("script");
    script.src = "https://pl31145407.profitableratecpmnetwork.com/25/62/2a/25622aa3eb2e34686edc45155c84e026.js";
    script.async = true;
    tempDiv.appendChild(script);

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
    onComplete();
  };

  const handleClick = () => {
    if (isAdShowing) return;
    runAdsterraAd();
  };

  return (
    <>
      <div onClick={handleClick} style={{ width: "100%" }}>
        {children}
      </div>
      {isAdShowing && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 99998 }} />
      )}
    </>
  );
        }
