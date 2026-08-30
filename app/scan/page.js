"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export default function Scan() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const streamRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      frameRef.current = requestAnimationFrame(tick);
    } catch (err) {
      setError("Camera access denied or unavailable.");
    }
  }

  function stopCamera() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  }

  function tick() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setResult(code.data);
        stopCamera();
        return;
      }
    }

    frameRef.current = requestAnimationFrame(tick);
  }

  function scanAgain() {
    setResult("");
    startCamera();
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1>Scan a QR code</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!result && (
        <video
          ref={videoRef}
          style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}
          muted
          playsInline
        />
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {result && (
        <div style={{ marginTop: "16px" }}>
          <p><strong>Result:</strong></p>
          <p style={{ wordBreak: "break-all" }}>{result}</p>

          {/^https?:\/\//i.test(result) && (
            <a href={result} target="_blank" rel="noopener noreferrer">
              Open link
            </a>
          )}

          <button onClick={scanAgain} style={{ display: "block", marginTop: "16px" }}>
            Scan another
          </button>
        </div>
      )}
    </main>
  );
                        }
