import Script from "next/script";

export default function AdScript() {
  return (
    <Script
      id="grouchy-popunder"
      src="/popunder.js"
      strategy="afterInteractive"
    />
  );
}
