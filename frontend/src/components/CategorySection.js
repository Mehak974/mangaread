"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/utils/slugify";
import { proxyImage } from "@/utils/api";
import { abbr } from "@/data/mockData";

const CATEGORIES = ["Action", "Romance", "Fantasy", "Drama", "Comedy"];

export default function CategorySection({ allManga = [] }) {
  const [activeCategory, setActiveCategory] = useState("Action");

  // Filter manga by the active category
  let filteredManga = allManga.filter(manga => {
    if (!manga.g) return false;
    const genres = Array.isArray(manga.g) ? manga.g.join(" ") : manga.g;
    return genres.toLowerCase().includes(activeCategory.toLowerCase());
  });

  // Ensure exactly 6 entries
  while (filteredManga.length > 0 && filteredManga.length < 6) {
    filteredManga = [...filteredManga, ...filteredManga];
  }
  filteredManga = filteredManga.slice(0, 6);

  return (
    <div className="wt-content-wrapper" style={{ marginTop: "40px" }}>
      <div className="wt-schedule-header">
        <h2 className="wt-section-title">Popular Series by Category</h2>
      </div>

      <div className="wt-tabs">
        {CATEGORIES.map(category => (
          <button 
            key={category} 
            className={`wt-tab ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="wt-grid">
        {filteredManga.length > 0 ? (
          filteredManga.map((manga) => (
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
          ))
        ) : (
          <div style={{ padding: "40px", color: "var(--text3)", gridColumn: "1 / -1", textAlign: "center" }}>
            No series found for {activeCategory}.
          </div>
        )}
      </div>
    </div>
  );
}
