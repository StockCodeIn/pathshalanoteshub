// components/OpenPaperButtonClient.tsx
"use client";

export default function OpenPaperButtonClient({
  url,
}: {
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        padding: "10px 14px",
        background: "#0b5cff",
        color: "#fff",
        borderRadius: 6,
        textDecoration: "none",
        fontWeight: 500,
      }}
    >
      📄 View / Download Question Paper
    </a>
  );
}
