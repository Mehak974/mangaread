import React from "react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "DMCA",
  description: "Digital Millennium Copyright Act Notice",
};

export default function DMCAPage() {
  return (
    <div className="wt-home-container">
      <div className="wt-content-wrapper" style={{ padding: "60px 20px", minHeight: "60vh" }}>
        <h1 className="wt-section-title" style={{ fontSize: "36px", marginBottom: "24px" }}>DMCA Policy</h1>
        <div style={{ color: "var(--text2)", fontSize: "16px", lineHeight: "1.8", maxWidth: "800px" }}>
          <p style={{ marginBottom: "20px" }}>
            MangaRead respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, the text of which may be found on the U.S. Copyright Office website, we will respond expeditiously to claims of copyright infringement.
          </p>
          <p style={{ marginBottom: "20px" }}>
            Please note that MangaRead does not host any files on our servers. All contents are provided by non-affiliated third parties. However, we are committed to helping rights holders protect their intellectual property.
          </p>
          <h3 style={{ color: "var(--text)", marginTop: "24px", marginBottom: "12px", fontSize: "20px" }}>Filing a Takedown Notice</h3>
          <p style={{ marginBottom: "20px" }}>
            If you are a copyright owner, or are authorized to act on behalf of one, and you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please submit your notice in writing to our designated copyright agent at <strong>dmca@mangaread.com</strong>.
          </p>
          <p>
            Your notice must include:
          </p>
          <ul style={{ marginLeft: "20px", marginTop: "10px", marginBottom: "20px" }}>
            <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed.</li>
            <li>Your contact information, including your address, telephone number, and an email address.</li>
          </ul>
        </div>
      </div>
      <div className="divider"></div>
      <Footer />
    </div>
  );
}
