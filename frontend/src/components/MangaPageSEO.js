"use client";

import { useEffect } from "react";

const DEFAULT_OG_IMAGE = "/og-default.svg";

function setMeta(name, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setLink(rel, href) {
  let tag = document.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

function setJsonLd(id, data) {
  let tag = document.getElementById(id);
  if (!tag) {
    tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = id;
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function MangaPageSEO({ manga, titleSlug, genres = [] }) {
  useEffect(() => {
    if (!manga) return;

    const name = manga.title || decodeURIComponent(titleSlug).replace(/-/g, " ");
    const description = manga.description
      ? manga.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160)
      : `Read ${name} online — ${(genres || []).slice(0, 3).join(", ")}.`;

    document.title = `Read ${name} Online · MangaReader`;

    setMeta("description", description);
    setMeta("keywords", [
      name,
      ...genres.slice(0, 5),
      "manga",
      "read online",
      "manga reader",
      "free manga",
    ].join(", "));

    setMeta("og:title", name);
    setMeta("og:description", description);
    setMeta("og:type", "article");
    setMeta("og:url", `https://mangaread.pro/manga/${titleSlug}`);
    setMeta("og:image", manga.cover || DEFAULT_OG_IMAGE);
    setMeta("og:image:alt", `Cover art for ${name}`);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", name);
    setMeta("twitter:description", description);
    setMeta("twitter:image", manga.cover || DEFAULT_OG_IMAGE);

    setLink("canonical", `https://mangaread.pro/manga/${titleSlug}`);

    setJsonLd("__manga_breadcrumb__", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mangaread.pro" },
        { "@type": "ListItem", position: 2, name: "Browse", item: "https://mangaread.pro/browse" },
        { "@type": "ListItem", position: 3, name, item: `https://mangaread.pro/manga/${titleSlug}` },
      ],
    });

    setJsonLd("__manga_webpage__", {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name,
      description,
      url: `https://mangaread.pro/manga/${titleSlug}`,
      isPartOf: { "@type": "WebSite", url: "https://mangaread.pro", name: "MangaReader" },
      primaryImageOfPage: manga.cover ? { "@type": "ImageObject", url: manga.cover } : undefined,
      inLanguage: "en",
    });
  }, [manga, titleSlug, genres]);

  return null;
}
