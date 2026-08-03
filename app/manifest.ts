import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Khám Phá Tây Ninh",
    short_name: "Tây Ninh",
    description: "Khám phá điểm đến, tour, vé cáp treo, thuê xe và đặc sản Tây Ninh.",
    id: "/",
    start_url: "/",
    scope: "/",
    lang: "vi",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone"],
    background_color: "#fbfcf9",
    theme_color: "#0b3b2e",
    orientation: "portrait",
    categories: ["travel", "lifestyle"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
