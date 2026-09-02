"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function DesktopBannerAd() {
  const containerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!containerRef.current) return;
    if (pathname?.startsWith("/reader")) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;

    if (containerRef.current.dataset.loaded === "1") return;
    containerRef.current.dataset.loaded = "1";

    const s = document.createElement("script");
    s.src = "\/\/wise-belt.com\/b.X_VwsidVGel\/0uY\/WOcQ\/oeumH9IuUZDUgl-k\/P\/TQc\/zFNNzTcz1FOtTgM\/tQNFz_MC3aNfzJUE5\/NswS";
    s.async = true;
    s.referrerPolicy = "no-referrer-when-downgrade";
    s.dataset.desktopBanner = "wise-belt";
    containerRef.current.appendChild(s);

    return () => {
      if (containerRef.current) {
        containerRef.current.dataset.loaded = "";
        const existing = containerRef.current.querySelector("script[data-desktopBanner]");
        if (existing) existing.remove();
      }
    };
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="desktop-banner-ad"
      aria-hidden="true"
    />
  );
}