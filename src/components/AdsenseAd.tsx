// src/components/AdsenseAd.tsx
"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdsenseAdProps {
  slot: string;
  // ad type: display (728x90 leaderboard), in-article (fluid), multiplex (autorelaxed), in-feed (fluid list)
  variant?: "display" | "in-article" | "multiplex" | "in-feed";
}

export default function AdsenseAd({
  slot,
  variant = "display",
}: AdsenseAdProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const insEl = useRef<HTMLElement | null>(null);

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

        // Wait for element to have proper width (CLS prevention)
        // useEffect के अंदर checkAndLoad फंक्शन को ऐसे बदलें:
        const checkAndLoad = () => {
          if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            window.requestIdleCallback(() => {
              loadAd();
            });
          } else {
            setTimeout(loadAd, 200);
          }
        };

        const loadAd = () => {
          try {
            if (!insEl.current?.getAttribute("data-adsbygoogle-status")) {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              insEl.current?.setAttribute("data-adsbygoogle-status", "loaded");
            }
          } catch (e) {
            console.error("Adsense push failed", e);
          }
        };

        checkAndLoad();
        observer.disconnect();
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [slot, variant]);

  // Different styles for different ad types
  const getAdStyles = () => {
    switch (variant) {
      case "display":
        return {
          display: "block",
          width: "100%",
          height: "100%",
        };
      case "in-article":
        return { display: "block", textAlign: "center" as const, width: "100%", height: "100%" };
      case "multiplex":
        return { display: "block", width: "100%", height: "100%" };
      default:
        return { display: "block", width: "100%", height: "100%" };
    }
  };

  // Different data attributes for different ad types
  const getAdAttributes = () => {
    const baseAttrs = {
      "data-ad-client": process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
      "data-ad-slot": slot,
    };

    switch (variant) {
      case "display":
        // Display ads: auto format with full-width responsive
        return {
          ...baseAttrs,
          "data-ad-format": "auto",
          "data-full-width-responsive": "true",
        };
      case "in-article":
        // In-article: fluid format for content between
        return {
          ...baseAttrs,
          "data-ad-format": "fluid",
          "data-ad-layout": "in-article",
        };
      case "multiplex":
        // Multiplex: autorelaxed format for recommendations
        return {
          ...baseAttrs,
          "data-ad-format": "autorelaxed",
        };
      case "in-feed":
        // In-feed: fluid format for list/feed content
        return {
          ...baseAttrs,
          "data-ad-format": "fluid",
          "data-ad-layout-key": "-ef+6k-30-ac+ty", // layout key for in-feed
        };
      default:
        return baseAttrs;
    }
  };

  const adAttrs = getAdAttributes();

  return (
    <div ref={wrapperRef} className={`ad-wrapper ${variant}`}>
      <div className="ad-slot">
        <ins
          ref={(el) => { insEl.current = el; }}
          className="adsbygoogle"
          style={getAdStyles()}
          {...adAttrs}
        />
      </div>
    </div>
  );
}
