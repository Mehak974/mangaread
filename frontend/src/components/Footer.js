"use client";

import React from "react";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          {/* Webtoon-style logo in footer */}
          <div style={{ fontFamily: "var(--font)", fontSize: "16px", fontWeight: "800", letterSpacing: "-0.5px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0", marginBottom: "10px", cursor: "default" }}>
            MANGA<span style={{ background: "var(--accent)", color: "#111111", borderRadius: "4px", padding: "1px 6px", marginLeft: "5px", fontSize: "12px", fontWeight: "900", letterSpacing: "0", textTransform: "none" }}>READ</span>
          </div>
          <p className="footer-tag">A cleaner corner of the internet for people who actually read manga.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/browse">Browse All</Link>
          <Link href="/browse?sort=trending">Trending</Link>
          <Link href="/browse?sort=latest">New Releases</Link>
          <Link href="/browse?sort=completed">Completed</Link>
        </div>
        <div>
          <h2>Account</h2>
          <Link href="/library">Library</Link>
          <Link href="/history">History</Link>
          <Link href="/settings">Settings</Link>
          <Link href="/about?tab=support">Support Us</Link>
        </div>
        <div>
          <h2>Stay Updated</h2>
          <NewsletterForm />
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 MangaRead.</span>
        <span className="footer-bottom-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/about?tab=contact">Contact</Link>
          <Link href="/dmca">DMCA</Link>
        </span>
      </div>
    </footer>
  );
}
