import React from "react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About Us",
  description: "Learn more about our mission to bring the best manga, manhwa, and manhua to readers worldwide.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="wt-home-container">
      <div className="wt-content-wrapper" style={{ padding: "60px 20px", minHeight: "60vh" }}>
        <h1 className="wt-section-title" style={{ fontSize: "36px", marginBottom: "24px" }}>About Us</h1>
        <div style={{ color: "var(--text2)", fontSize: "16px", lineHeight: "1.8", maxWidth: "800px" }}>
          <p style={{ marginBottom: "20px" }}>
            Welcome to MangaRead, your premium destination for high-quality manga, manhwa, and manhua. 
            Our platform is built by fans, for fans, with a singular mission: to provide the cleanest, fastest, and most enjoyable reading experience on the web.
          </p>
          <p style={{ marginBottom: "20px" }}>
            We noticed that many reading sites were cluttered with intrusive ads, slow load times, and confusing navigation. 
            We decided to build something better. With features like cross-device syncing, intelligent bookmarks, and a sleek, distraction-free "Webtoon" layout, MangaRead is designed to let you get lost in your favorite stories.
          </p>
          <p style={{ marginBottom: "20px" }}>
            Whether you are into action-packed Shonen, heartwarming Romance, or gripping Fantasy epics, our catalog spans thousands of titles updated daily.
          </p>
          <p>
            Thank you for being part of our community. Happy reading!
          </p>
        </div>
      </div>
      <div className="divider"></div>
      <Footer />
    </div>
  );
}
