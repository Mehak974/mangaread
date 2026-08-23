import { prisma } from "@/lib/prisma";
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

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "daily", priority: 1, lastModified: "2026-07-01" },
  { path: "/browse", changeFrequency: "daily", priority: 0.9, lastModified: "2026-07-01" },
  { path: "/blog", changeFrequency: "daily", priority: 0.8, lastModified: "2026-07-01" },
  { path: "/about", changeFrequency: "monthly", priority: 0.5, lastModified: "2026-01-01" },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-01-01" },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-01-01" },
  { path: "/dmca", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-01-01" },
];

export default async function sitemap() {
  const SITE_URL = getSiteUrl();
  // Bump each route's `lastModified` string above when that page's content
  // actually changes, rather than stamping every route with the request
  // time. An always-"now" lastmod tells crawlers nothing and can suppress
  // re-crawl prioritization for pages that genuinely did just change.
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let articleEntries = [];
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    articleEntries = articles.map((article) => ({
      url: `${SITE_URL}/blog/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    articleEntries = [];
  }

  // Include manga detail pages so Google can discover them
  let mangaEntries = [];
  try {
    const mangaList = await prisma.manga.findMany({
      select: { id: true, title: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    });
    mangaEntries = mangaList.map((m) => {
      const slug = slugify(m.title || String(m.id));
      return {
        url: `${SITE_URL}/manga/${slug}`,
        lastModified: m.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
      };
    });
  } catch {
    mangaEntries = [];
  }

  return [...staticEntries, ...articleEntries, ...mangaEntries];
}
