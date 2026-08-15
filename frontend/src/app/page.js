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

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const revalidate = 43200; // Revalidate every 12 hours (ISR) — balances freshness vs cold-start LCP

// Server components can be async
export default async function Home() {
  // ── Critical path: fetch AniList data first (determines the hero image / LCP) ──
  // These are fetched in parallel. The backend /api/home fetch is deliberately
  // NOT in this Promise.all so a slow backend can't delay the hero image.
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
  // Use Promise.race with a 500 ms timeout so a slow backend can't delay
  // the initial page paint. If it doesn't resolve in 500 ms, fall back to
  // AniList "newest" results for the Recently Added section.
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
  let finalPopularNow = popularNow.slice(0, 9);
  let finalTrending = trending.slice(0, 12);
  let finalPopularOverall = popularOverall.slice(0, 12);
  const finalRecentlyAdded = recentlyAdded.slice(0, 10);

  const fallbackHero1 = {
    id: "fallback-solo-leveling",
    t: "Solo Leveling",
    title: "Solo Leveling",
    cover: "https://i.pinimg.com/1200x/f5/ac/5b/f5ac5b72f1a1acd032f165e8e2ed9706.jpg",
    rating: 9.8,
    ch: "Ch 200",
    ongoing: false,
  };
  const fallbackHero2 = {
    id: "fallback-one-piece",
    t: "One Piece",
    title: "One Piece",
    cover: "https://i.pinimg.com/736x/15/26/bb/1526bb11c465be3119bb71279f4e750b.jpg",
    rating: 9.9,
    ch: "Ch 1100",
    ongoing: true,
  };

  const emergencyFallbacks = [fallbackHero1, fallbackHero2, ...finalRecentlyAdded];

  if (finalPopularNow.length === 0) finalPopularNow = emergencyFallbacks.slice(0, 9);
  if (finalTrending.length === 0) finalTrending = emergencyFallbacks.slice(0, 12);
  if (finalPopularOverall.length === 0) finalPopularOverall = emergencyFallbacks.slice(0, 12);

  const featuredHero = finalPopularNow[0];
  const desktopHero = fallbackHero1; // Force Action Manhwa (Solo Leveling)

  const allScheduleItems = [...finalPopularNow, ...finalTrending, ...finalPopularOverall, ...finalRecentlyAdded];
  const uniqueScheduleItems = Array.from(new Map(allScheduleItems.map(item => [item.id, item])).values());

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
