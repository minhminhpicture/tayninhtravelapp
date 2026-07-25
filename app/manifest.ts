import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Khám Phá Tây Ninh",
    short_name: "Tây Ninh",
    description: "Điểm đến, tour, vé cáp treo và thuê xe tại Tây Ninh.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfcf9",
    theme_color: "#0b3b2e",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
}
