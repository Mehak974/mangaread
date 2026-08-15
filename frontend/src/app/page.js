import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ALL_GENRES, abbr } from "@/data/mockData";
import { slugify } from "@/utils/slugify";
import { getMangaList, isExplicitNSFW } from "@/utils/anilist";
import { proxyImage } from "@/utils/api";
import MangaCard from "@/components/MangaCard";
import Footer from "@/components/Footer";
import HomeGenreFilter from "@/components/HomeGenreFilter";
import HomeAuthNudge from "@/components/HomeAuthNudge";
import DailySchedule from "@/components/DailySchedule";
import CategorySection from "@/components/CategorySection";
import TrendingPopularSection from "@/components/TrendingPopularSection";

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.mangaread.pro";

export const revalidate = 43200; // Revalidate every 12 hours (ISR) — balances freshness vs cold-start LCP

// Server components can be async
export default async function Home() {
  // ── Critical path: fetch AniList data first (determines the hero image / LCP) ──
  const [popularNowRes, trendingRes, popularOverallRes] = await Promise.all([
    getMangaList({ perPage: 12, genre: "Fantasy", countryOfOrigin: "KR", sort: ["POPULARITY_DESC"] }),
    getMangaList({ perPage: 16, sort: ["TRENDING_DESC"] }),
    getMangaList({ perPage: 16, sort: ["POPULARITY_DESC"] }),
  ]);

  let popularNow = popularNowRes?.media?.length > 0
    ? popularNowRes.media
    : [];

  let trending = trendingRes?.media?.length > 0
    ? trendingRes.media
    : [];

  let popularOverall = popularOverallRes?.media?.length > 0
    ? popularOverallRes.media
    : [];

  // ── Non-critical: backend fetch for Recently Added (below the fold on mobile) ──
  const backendPromise = fetch(`${apiBase}/api/home`)
    .then(r => r.json())
    .catch(() => ({ data: [] }));

  const recentRes = await Promise.race([
    backendPromise,
    new Promise(resolve => setTimeout(() => resolve({ data: [] }), 500)),
  ]);

  let recentlyAdded = [];
  if (recentRes?.data && recentRes.data.length > 0) {
    const allRecentItems = [];
    for (const section of recentRes.data) {
      if (section.items) {
        section.items.forEach(item => {
          allRecentItems.push({ ...item, sourceId: section.sourceId });
        });
      }
    }
    recentlyAdded = allRecentItems.slice(0, 20).map(m => ({
      id: m.href || m.title,
      t: m.title,
      cover: m.cover,
      ch: m.chapter || 'Ch 1',
      g: 'Ongoing',
      latest_source: m.sourceId,
      hot: true
    }));
  }

  if (recentlyAdded.length < 20) {
    const recentFallback = await getMangaList({ perPage: 20, sort: ["UPDATED_AT_DESC"] }).catch(() => ({ media: [] }));
    const fallbackMedia = recentFallback?.media?.length > 0
      ? recentFallback.media
      : [];

    const existingTitles = new Set(recentlyAdded.map(m => (m.t || m.title || "").toLowerCase()));
    const uniqueFallback = fallbackMedia.filter(m => !existingTitles.has((m.t || m.title || "").toLowerCase()));
    recentlyAdded = [...recentlyAdded, ...uniqueFallback].slice(0, 20);
  }

  // ── Resilience: if AniList is down, use backend scraper data for ALL sections ──
  const hasAnilistData = popularNow.length > 0 || trending.length > 0 || popularOverall.length > 0;

  if (!hasAnilistData && recentRes?.data && recentRes.data.length > 0) {
    const backendItems = [];
    for (const section of recentRes.data) {
      if (section.items && section.items.length > 0) {
        backendItems.push(...section.items.map(item => ({ ...item, sourceId: section.sourceId })));
      }
    }

    const shuffled = backendItems.sort(() => Math.random() - 0.5);

    popularNow = shuffled.slice(0, 9).map(m => ({
      id: m.href || m.title,
      t: m.title,
      cover: m.cover,
      ch: m.chapter || 'Ch 1',
      g: 'Ongoing',
      hot: true
    }));

    trending = shuffled.slice(0, 12).map(m => ({
      id: m.href || m.title,
      t: m.title,
      cover: m.cover,
      ch: m.chapter || 'Ch 1',
      g: 'Ongoing',
      hot: true
    }));

    popularOverall = shuffled.slice(0, 12).map(m => ({
      id: m.href || m.title,
      t: m.title,
      cover: m.cover,
      ch: m.chapter || 'Ch 1',
      g: 'Ongoing',
      hot: true
    }));
  }

  let finalPopularNow = popularNow.slice(0, 9);
  let finalTrending = trending.slice(0, 12);
  let finalPopularOverall = popularOverall.slice(0, 12);
  const finalRecentlyAdded = recentlyAdded.slice(0, 10);

  const allScheduleItems = [...finalPopularNow, ...finalTrending, ...finalPopularOverall, ...finalRecentlyAdded];
  const uniqueScheduleItems = Array.from(new Map(allScheduleItems.map(item => [item.id, item])).values());

  const featuredHero = finalPopularNow[0];
  const desktopHero = featuredHero;

  // Preload the LCP hero image so the browser starts fetching it as early as possible
  const heroImageUrl = featuredHero?.cover ? proxyImage(featuredHero.cover, 400) : null;

  return (
    <div className="wt-home-container">
      {heroImageUrl && (
        <link rel="preload" as="image" href={heroImageUrl} fetchPriority="high" />
      )}
      
      {/* WEBTOON STYLE HERO BANNER */}
      {desktopHero && (
        <section className="wt-hero">
          <Link href={`/manga/${slugify(desktopHero.t || desktopHero.title)}`} className="wt-hero-link">
            <div className="wt-hero-bg">
              {desktopHero.cover && (
                <Image
                  src={proxyImage(desktopHero.cover)}
                  alt="Hero Background"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              )}
            </div>
            <div className="wt-hero-content">
              <div className="wt-hero-badge">UP</div>
              <h1 className="wt-hero-title">{desktopHero.t || desktopHero.title}</h1>
              <p className="wt-hero-genre">{desktopHero.g || "Fantasy"} • {desktopHero.ch}</p>
              <div className="wt-hero-desc">
                Sync reading across devices, bookmark chapters, track progress, and discover what's next.
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* WEBTOON DAILY SCHEDULE */}
      <div className="wt-content-wrapper">
        <DailySchedule items={uniqueScheduleItems} />
      </div>

      {/* POPULAR BY CATEGORY */}
      <CategorySection allManga={[...finalTrending, ...finalPopularOverall, ...finalPopularNow]} />

      {/* TRENDING & POPULAR */}
      <TrendingPopularSection trending={finalTrending} popular={finalPopularOverall} />

      {/* SUPPORT US SECTION */}
      <div className="wt-content-wrapper" style={{ marginTop: "40px", marginBottom: "40px" }}>
        <div style={{
          backgroundColor: "var(--bg2)",
          borderRadius: "var(--r)",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          border: "1px solid var(--border)",
          flexWrap: "wrap"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ fontSize: "28px", lineHeight: "1" }}>☕</div>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text)", margin: "0 0 4px 0" }}>Support MangaReader</h2>
              <p style={{ color: "var(--text2)", margin: 0, fontSize: "14px" }}>
                Help us keep the servers running and the reading experience ad-free.
              </p>
            </div>
          </div>
          <a 
            href="https://ko-fi.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="wt-coffee-btn"
            style={{ whiteSpace: "nowrap" }}
          >
            Buy Us a Coffee
          </a>
        </div>
      </div>

      <div className="divider"></div>

      <Footer />
    </div>
  );
}
