"use client";
import { useState, useEffect, useRef } from "react";

export default function AdGate({ onComplete, children }) {
  const [showAd, setShowAd] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [canCancel, setCanCancel] = useState(false);
  const adContainerRef = useRef(null);

  useEffect(() => {
    if (showAd) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanCancel(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showAd]);

  useEffect(() => {
    if (showAd && canCancel) {
      const timeout = setTimeout(() => {
        handleCancel();
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [showAd, canCancel]);

  useEffect(() => {
    if (showAd && adContainerRef.current) {
      const container = adContainerRef.current;
      container.innerHTML = "";
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = "https://underminestudiedboot.com/025fb75007f85066894958fdd706a051/invoke.js";
      container.appendChild(script);
    }
  }, [showAd]);

  const handleClick = () => {
    if (showAd) return;
    setShowAd(true);
    setCountdown(5);
    setCanCancel(false);
  };

  const handleCancel = () => {
    setShowAd(false);
    if (adContainerRef.current) adContainerRef.current.innerHTML = "";
    onComplete();
  };

  return (
    <>
      <div onClick={handleClick} style={{ width: "100%" }}>{children}</div>
      {showAd && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "#ffffff", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem", boxSizing: "border-box" }}>
          <h2 style={{ margin: "1rem 0", fontSize: "1.2rem", color: "var(--navy)" }}>Advertisement</h2>
          <div id="container-025fb75007f85066894958fdd706a051" ref={adContainerRef} style={{ width: "100%", maxWidth: "400px", flexGrow: 1, background: "#f8fafc", overflow: "hidden", borderRadius: "8px" }} />
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            {!canCancel ? (
              <p style={{ color: "var(--text)" }}>Please wait... {countdown}s</p>
            ) : (
              <button onClick={handleCancel} style={{ background: "var(--primary)", color: "white", border: "none", padding: "0.8rem 2.5rem", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" }}>
                Skip Ad
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
  }
