import React from "react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for MangaRead",
};

export default function PrivacyPage() {
  return (
    <div className="wt-home-container">
      <div className="wt-content-wrapper" style={{ padding: "60px 20px", minHeight: "60vh" }}>
        <h1 className="wt-section-title" style={{ fontSize: "36px", marginBottom: "24px" }}>Privacy Policy</h1>
        <div style={{ color: "var(--text2)", fontSize: "16px", lineHeight: "1.8", maxWidth: "800px" }}>
          <p style={{ marginBottom: "20px" }}>Last updated: August 2026</p>
          <p style={{ marginBottom: "20px" }}>
            Your privacy is important to us. This Privacy Policy explains how MangaRead collects, uses, and safeguards your information when you visit our website.
          </p>
          <h3 style={{ color: "var(--text)", marginTop: "24px", marginBottom: "12px", fontSize: "20px" }}>1. Information We Collect</h3>
          <p style={{ marginBottom: "20px" }}>
            We collect information you provide directly to us when you create an account, such as your username and email address. We also automatically collect certain information about your device and usage patterns (like reading history and bookmarks) to provide our sync services.
          </p>
          <h3 style={{ color: "var(--text)", marginTop: "24px", marginBottom: "12px", fontSize: "20px" }}>2. How We Use Information</h3>
          <p style={{ marginBottom: "20px" }}>
            The information we collect is used to personalize your experience, maintain your reading progress across devices, and improve the overall functionality of our platform.
          </p>
          <h3 style={{ color: "var(--text)", marginTop: "24px", marginBottom: "12px", fontSize: "20px" }}>3. Data Security</h3>
          <p style={{ marginBottom: "20px" }}>
            We implement appropriate technical and organizational security measures to protect your data. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
          </p>
          <h3 style={{ color: "var(--text)", marginTop: "24px", marginBottom: "12px", fontSize: "20px" }}>4. Contact Us</h3>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at privacy@mangaread.com.
          </p>
        </div>
      </div>
      <div className="divider"></div>
      <Footer />
    </div>
  );
}
