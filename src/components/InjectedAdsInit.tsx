// components/InjectedAdsInit.tsx
"use client";
import { useEffect } from "react";

export default function InjectedAdsInit() {
  useEffect(() => {
    try {
      // call push() to initialize any newly rendered ins.adsbygoogle nodes
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      // ignore errors
      console.warn("ads init error", e);
    }
  }, []);

  return null;
}
