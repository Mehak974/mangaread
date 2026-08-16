import { prisma } from "@/lib/prisma";
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
    mangaEntries = mangaList.map((m) => ({
      url: `${SITE_URL}/manga/${m.id || m.title}`,
      lastModified: m.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    mangaEntries = [];
  }

  return [...staticEntries, ...articleEntries, ...mangaEntries];
}
