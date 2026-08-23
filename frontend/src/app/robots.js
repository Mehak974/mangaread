import { SITE_URL } from "@/lib/seo";
import { headers } from "next/headers";

const PROD_SITE_URL = "https://mangaread.pro";

function getSiteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL || "";
  // Only trust an explicit env URL when it's a real (non-local) origin.
  if (env && !/localhost|127\.0\.0\.1/.test(env)) {
    return env.replace(/\/+$/, "");
  }
  // Otherwise derive from the incoming request (Vercel sets x-forwarded-host).
  try {
    const h = headers();
    const hostHeader = h.get("x-forwarded-host") || h.get("host") || "";
    if (hostHeader && !/localhost|127\.0\.0\.1/.test(hostHeader)) {
      const proto = h.get("x-forwarded-proto") || "https";
      return `${proto}://${hostHeader}`.replace(/\/+$/, "");
    }
  } catch {
    // headers() can be unavailable during static generation — fall through.
  }
  // Safety net: always emit the real production domain so generated URLs
  // stay indexable even if NEXT_PUBLIC_SITE_URL/headers are misconfigured.
  return PROD_SITE_URL;
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
