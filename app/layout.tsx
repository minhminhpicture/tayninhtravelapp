import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") || incoming.get("host") || "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "Khám Phá Tây Ninh | App du lịch";
  const description = "Khám phá điểm đến, đặt tour, vé cáp treo và thuê xe tại Tây Ninh.";
  return {
    title,
    description,
    manifest: "/manifest.webmanifest",
    applicationName: "Khám Phá Tây Ninh",
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Tây Ninh" },
    formatDetection: { telephone: true },
    icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1731, height: 909, alt: "Khám Phá Tây Ninh" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b3b2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className={beVietnamPro.variable}>{children}</body></html>;
}
