// components/OpenPaperButtonClient.tsx
"use client";
import { useState } from "react";
import ExternalRedirectModal from "./ExternalRedirectModal";

export default function OpenPaperButtonClient({ url, label }: { url: string; label?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: "10px 14px",
          background: "#0b5cff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        📄 View / Download Question Paper
      </button>

      {open && <ExternalRedirectModal externalUrl={url} label={label} onClose={() => setOpen(false)} />}
    </>
  );
}
