"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/utils/slugify";
import { proxyImage } from "@/utils/api";
import { abbr } from "@/data/mockData";

export default function TrendingPopularSection({ trending = [], popular = [] }) {
  const [activeTab, setActiveTab] = useState("Trending");
  
  let displayManga = activeTab === "Trending" ? trending : popular;
  
  // Ensure exactly 6 entries
  while (displayManga.length > 0 && displayManga.length < 6) {
    displayManga = [...displayManga, ...displayManga];
  }
  displayManga = displayManga.slice(0, 6);

  return (
    <div className="wt-content-wrapper" style={{ marginTop: "40px", marginBottom: "40px" }}>
      <div className="wt-schedule-header">
        <h2 className="wt-section-title">Trending & Popular Series</h2>
      </div>

      <div className="wt-tabs">
        <button 
          className={`wt-tab ${activeTab === "Trending" ? "active" : ""}`}
          onClick={() => setActiveTab("Trending")}
        >
          Trending
        </button>
        <button 
          className={`wt-tab ${activeTab === "Popular" ? "active" : ""}`}
          onClick={() => setActiveTab("Popular")}
        >
          Popular
        </button>
      </div>

      <div className="wt-grid">
        {displayManga.map((manga) => (
          <Link href={`/manga/${slugify(manga.t || manga.title)}`} key={manga.id} className="wt-card">
            <div className="wt-card-cover">
              {manga.cover ? (
                <Image
                  src={proxyImage(manga.cover, 300)}
                  alt={`Cover for ${manga.t || manga.title}`}
                  fill
                  sizes="(max-width: 600px) 33vw, 20vw"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  loading="lazy"
                />
              ) : (
                <div className="wt-card-placeholder">{abbr(manga.t || manga.title)}</div>
              )}
            </div>
            <div className="wt-card-info">
              <div className="wt-card-genre">{manga.g || "Fantasy"}</div>
              <div className="wt-card-title">{manga.t || manga.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
