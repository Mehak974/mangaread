import React from "react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for MangaRead",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="wt-home-container">
      <div className="wt-content-wrapper" style={{ padding: "60px 20px", minHeight: "60vh" }}>
        <h1 className="wt-section-title" style={{ fontSize: "36px", marginBottom: "24px" }}>Terms of Service</h1>
        <div style={{ color: "var(--text2)", fontSize: "16px", lineHeight: "1.8", maxWidth: "800px" }}>
          <p style={{ marginBottom: "20px" }}>Last updated: August 2026</p>
          <p style={{ marginBottom: "20px" }}>
            Please read these Terms of Service carefully before using MangaRead. By accessing or using our platform, you agree to be bound by these Terms.
          </p>
          <h3 style={{ color: "var(--text)", marginTop: "24px", marginBottom: "12px", fontSize: "20px" }}>1. Acceptance of Terms</h3>
          <p style={{ marginBottom: "20px" }}>
            By using MangaRead, you agree to these Terms. If you do not agree to all the terms and conditions, then you may not access the website.
          </p>
          <h3 style={{ color: "var(--text)", marginTop: "24px", marginBottom: "12px", fontSize: "20px" }}>2. Use License</h3>
          <p style={{ marginBottom: "20px" }}>
            Permission is granted to temporarily view the materials on MangaRead for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>
          <h3 style={{ color: "var(--text)", marginTop: "24px", marginBottom: "12px", fontSize: "20px" }}>3. Content Disclaimer</h3>
          <p style={{ marginBottom: "20px" }}>
            MangaRead acts solely as an aggregator and does not host any manga content on its own servers. All content is indexed from third-party sources and we do not claim ownership of the intellectual property displayed.
          </p>
          <h3 style={{ color: "var(--text)", marginTop: "24px", marginBottom: "12px", fontSize: "20px" }}>4. Modifications</h3>
          <p>
            MangaRead may revise these Terms of Service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms.
          </p>
        </div>
      </div>
      <div className="divider"></div>
      <Footer />
    </div>
  );
}
