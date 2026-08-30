// app/scan/page.js
"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Button, Card, Alert } from "../../components/ui";

export default function Scan() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(true);
  const streamRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  async function startCamera() {
    setError("");
    setScanning(true);
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
      setScanning(false);
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
        setScanning(false);
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
    <main className="container" style={{ maxWidth: "500px", padding: "2rem" }}>
      <h1>Scan a QR Code</h1>

      {error && <Alert type="error">{error}</Alert>}

      {scanning && (
        <Card style={{ marginTop: "1rem", padding: "0" }}>
          <video
            ref={videoRef}
            style={{ width: "100%", borderRadius: "8px 8px 0 0", display: "block" }}
            muted
            playsInline
          />
        </Card>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {!scanning && result && (
        <Card style={{ marginTop: "1rem" }}>
          <p><strong>Result:</strong></p>
          <p style={{ wordBreak: "break-all" }}>{result}</p>

          {/^https?:\/\//i.test(result) && (
            <a href={result} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "1rem" }}>
              Open link
            </a>
          )}

          <Button onClick={scanAgain} variant="primary" style={{ marginTop: "1rem", display: "block" }}>
            Scan Another
          </Button>
        </Card>
      )}
    </main>
  );
  }
