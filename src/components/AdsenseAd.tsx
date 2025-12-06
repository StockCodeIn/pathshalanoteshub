// components/AdsenseAd.tsx
"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

type Props = {
  slot: string;        // AdSense slot id (string)
  className?: string;  // optional styling wrapper class
  style?: React.CSSProperties;
};

export default function AdsenseAd({ slot, className, style }: Props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT} // e.g. ca-pub-XXXXX
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
