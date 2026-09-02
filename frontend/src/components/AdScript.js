import Script from "next/script";

export default function AdScript() {
  return (
    <Script
      id="edible-popunder"
      src="/popunder.js"
      strategy="afterInteractive"
    />
  );
}
