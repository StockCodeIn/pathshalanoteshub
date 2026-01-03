// components/AdsenseAd.tsx
"use client";
import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

type Props = {
  slot: string;
  className?: string;
  style?: React.CSSProperties;
  size?: "default" | "small" | "inline";
  variant?: "display" | "multiplex";
};

export default function AdsenseAd({
  slot,
  className = "",
  style,
  size = "default",
  variant = "display",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}

    const observer = new MutationObserver(() => {
      const iframe = adRef.current?.querySelector("iframe");
      if (iframe && iframe.offsetHeight > 0) {
        wrapperRef.current!.style.display = "block";
        observer.disconnect();
      }
    });

    if (adRef.current) {
      observer.observe(adRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

  const sizeClass =
    size === "small" ? "small" : size === "inline" ? "inline" : "";

  return (
    <>
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        strategy="afterInteractive"
      />

      <div
        ref={wrapperRef}
        className={`ad-wrapper ${variant === "multiplex" ? "ad-multiplex" : "ad-display"}`}
      >
        <div
          ref={adRef}
          className={`ad-slot ${sizeClass} ${className}`}
          style={style}
        >
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </>
  );
}