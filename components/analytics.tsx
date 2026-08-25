"use client";

import Script from "next/script";
import { siteConfig } from "@/lib/site-config";

/** 隐私友好统计：Umami 或 Plausible（二选一，通过 env 配置） */
export function Analytics() {
  if (siteConfig.umamiWebsiteId && siteConfig.umamiScriptUrl) {
    return (
      <Script
        defer
        src={siteConfig.umamiScriptUrl}
        data-website-id={siteConfig.umamiWebsiteId}
        strategy="afterInteractive"
      />
    );
  }

  if (siteConfig.plausibleDomain) {
    return (
      <Script
        defer
        data-domain={siteConfig.plausibleDomain}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    );
  }

  return null;
}
