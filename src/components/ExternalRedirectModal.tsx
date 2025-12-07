// components/ExternalRedirectModal.tsx
"use client";
import { useState, useEffect } from "react";
import AdsenseAd from "./AdsenseAd";

type Props = {
  externalUrl: string;
  label?: string;
  onClose?: () => void;
};

export default function ExternalRedirectModal({ externalUrl, label = "Official site", onClose }: Props) {
  const [open, setOpen] = useState(true);
  const [countdown, setCountdown] = useState<number>(5); // optional visible countdown

  useEffect(() => {
    if (!open) return;
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [open, countdown]);

  function handleProceed() {
    // open in new tab (safe)
    window.open(externalUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
    onClose?.();
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "min(920px, 96%)",
          maxHeight: "90vh",
          overflow: "auto",
          background: "#fff",
          borderRadius: 10,
          padding: 20,
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>You are leaving to {label}</h2>
            <p style={{ margin: "6px 0 0 0", color: "#444", fontSize: 14 }}>
              Click <strong>Proceed to Official Site</strong> to open the external page in a new tab.
            </p>
          </div>

          <button
            aria-label="Close"
            onClick={() => {
              setOpen(false);
              onClose?.();
            }}
            style={{ border: "none", background: "transparent", fontSize: 26, cursor: "pointer", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Ads area (1-2 units). Replace slot placeholders with your real slot IDs. */}
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            {/* Replace "REPLACE_WITH_SLOT_ID_TOP" with the numeric slot id from AdSense */}
            <AdsenseAd slot="3697566809" />
          </div>

          <div style={{ marginBottom: 8 }}>
            {/* Optional second ad. Replace if you created a second slot for modal, else remove this block */}
            <AdsenseAd slot="2435799482" />
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
          <button
            onClick={handleProceed}
            style={{
              padding: "10px 16px",
              background: "#0b5cff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            View Question Paper {countdown > 0 ? `(${countdown}s)` : ""}
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onClose?.();
            }}
            style={{
              padding: "10px 14px",
              background: "#eee",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Cancel
          </button>
        </div>

        <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
          Note: Ads may appear here. You are not required to click them.
        </p>
      </div>
    </div>
  );
}
