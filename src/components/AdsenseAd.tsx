"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdsenseAdProps {
  slot: string;
  variant?: "display" | "multiplex";
}

export default function AdsenseAd({
  slot,
  variant = "display",
}: AdsenseAdProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const insEl = useRef<HTMLElement | null>(null); // ✅ EXACT TYPE

  useEffect(() => {
    // Admin check
    const isAdmin = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("admin_token="));

    // Bot check
    const ua = navigator.userAgent.toLowerCase();
    const isBot =
      /bot|googlebot|crawler|spider|robot|slurp|bingbot|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot/.test(
        ua
      );

    if (isAdmin || isBot) return;
    if (!wrapperRef.current || !insEl.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const width = wrapperRef.current!.offsetWidth;
        if (width === 0) return;

        try {
          if (!insEl.current!.getAttribute("data-adsbygoogle-status")) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        } catch (e) {
          console.error("Adsense push failed", e);
        }

        observer.disconnect();
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [slot]);

  const containerClass =
    variant === "multiplex"
      ? "ad-container ad-multiplex-min"
      : "ad-container ad-display-min";

  return (
    <div ref={wrapperRef} className="ad-wrapper display">
      <div className="ad-slot">
        <ins
          ref={(el) => {
            insEl.current = el;
          }}
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={variant === "multiplex" ? "autorelaxed" : "auto"}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );

}
