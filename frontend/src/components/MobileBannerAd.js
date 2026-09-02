"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function MobileBannerAd() {
  const containerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!containerRef.current) return;
    if (pathname?.startsWith("/reader")) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;

    if (containerRef.current.dataset.loaded === "1") return;
    containerRef.current.dataset.loaded = "1";

    const s = document.createElement("script");
    s.src = "\/\/wise-belt.com\/bQX.V\/sVdMGylr0bYYW\/cc\/Behm\/9iuCZjUtlQk_P\/TCcrzQNszScW2OMTDGkftONJzdMF3JN\/zZYPxlMBwZ";
    s.async = true;
    s.referrerPolicy = "no-referrer-when-downgrade";
    s.dataset.banner = "wise-belt";
    containerRef.current.appendChild(s);

    return () => {
      if (containerRef.current) {
        containerRef.current.dataset.loaded = "";
        const existing = containerRef.current.querySelector("script[data-banner]");
        if (existing) existing.remove();
      }
    };
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="mobile-banner-ad"
      aria-hidden="true"
    />
  );
}