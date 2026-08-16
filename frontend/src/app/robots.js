import { SITE_URL } from "@/lib/seo";
import { headers } from "next/headers";

function getSiteUrl() {
  const host = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
    return host.replace(/\/+$/, "");
  }
  try {
    const h = headers();
    const hostHeader = h.get("x-forwarded-host") || h.get("host") || "";
    const proto = h.get("x-forwarded-proto") || "https";
    return hostHeader ? `${proto}://${hostHeader}` : host.replace(/\/+$/, "");
  } catch {
    return host.replace(/\/+$/, "");
  }
}

export default function robots() {
  const SITE_URL = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        "/login",
        "/signup",
        "/settings",
        "/profile",
        "/library",
        "/history",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
