"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/utils/slugify";
import { proxyImage } from "@/utils/api";
import { abbr } from "@/data/mockData";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function DailySchedule({ items = [] }) {
  const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const initialActiveDay = currentDayIndex === 0 ? "SUN" : DAYS[currentDayIndex - 1];
  const [activeDay, setActiveDay] = useState(initialActiveDay);

  // Distribute the items across the 7 days (since we don't have real schedule data)
  const scheduleData = {
    MON: [], TUE: [], WED: [], THU: [], FRI: [], SAT: [], SUN: []
  };

  items.forEach((item, index) => {
    const day = DAYS[index % 7];
    scheduleData[day].push(item);
  });

  return (
    <div className="wt-schedule">
      <div className="wt-schedule-header">
        <h2 className="wt-section-title">Originals</h2>
      </div>
      
      <div className="wt-tabs">
        {DAYS.map(day => (
          <button 
            key={day} 
            className={`wt-tab ${activeDay === day ? "active" : ""}`}
            onClick={() => setActiveDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="wt-grid">
        {(() => {
          let activeManga = scheduleData[activeDay] || [];
          while (activeManga.length > 0 && activeManga.length < 5) {
            activeManga = [...activeManga, ...activeManga];
          }
          activeManga = activeManga.slice(0, 5);
          
          if (activeManga.length === 0) {
            return (
              <div style={{ padding: "40px", color: "var(--text3)", gridColumn: "1 / -1", textAlign: "center" }}>
                No updates today.
              </div>
            );
          }

          return activeManga.map((manga) => (
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
              {manga.hot && <div className="wt-badge hot">HOT</div>}
              {manga.latest_source && <div className="wt-badge new">NEW</div>}
            </div>
            <div className="wt-card-info">
              <div className="wt-card-genre">{manga.g || "Fantasy"}</div>
              <div className="wt-card-title">{manga.t || manga.title}</div>
              <div className="wt-card-author">{manga.ch || "Ch 1"}</div>
            </div>
          </Link>
        ))})()}
      </div>
    </div>
  );
}
