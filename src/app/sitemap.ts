
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.yourdomain.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/appointments",
    "/lab-tests",
    "/home-collection",
    "/reports",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date("2026-10-31"),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
