/**
 * app/robots.js
 * Configures search engine crawl rules.
 * Disallows private and transaction routes (/cart, /checkout, /orders, /kitchen, /api/)
 * and provides pointer to the dynamic XML sitemap.
 */
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://addiseats.et";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cart",
        "/checkout",
        "/orders",
        "/kitchen",
        "/api/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
