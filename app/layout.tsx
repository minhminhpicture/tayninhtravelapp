import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const siteUrl = "https://tayninh.lnm.vn";
const socialProfiles = [
  "https://www.tiktok.com/@tayninhtrips",
  "https://www.facebook.com/tayninhtrip",
  "https://www.facebook.com/groups/253074593088919",
];

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const title = "Khám Phá Tây Ninh | Tour, điểm đến & đặc sản";
const description = "Cẩm nang du lịch Tây Ninh: khám phá Núi Bà Đen, điểm đến nổi bật, đặt tour, vé cáp treo, thuê xe và mua đặc sản qua Zalo.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Khám Phá Tây Ninh" },
  description,
  keywords: [
    "du lịch Tây Ninh",
    "Núi Bà Đen",
    "tour Tây Ninh",
    "vé cáp treo Núi Bà Đen",
    "thuê xe Tây Ninh",
    "đặc sản Tây Ninh",
    "Mãng Cầu Bà Đen",
  ],
  authors: [{ name: "Tây Ninh Trips", url: socialProfiles[0] }],
  creator: "Tây Ninh Trips",
  publisher: "Khám Phá Tây Ninh",
  applicationName: "Khám Phá Tây Ninh",
  category: "travel",
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Tây Ninh" },
  formatDetection: { telephone: true, address: true, email: false },
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Khám Phá Tây Ninh",
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Khám Phá Tây Ninh – tour, điểm đến và đặc sản" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: "#0b3b2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Khám Phá Tây Ninh",
    alternateName: "Tây Ninh Trips",
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    image: `${siteUrl}/og.png`,
    description,
    telephone: "+84 584 556 556",
    areaServed: { "@type": "AdministrativeArea", name: "Tây Ninh, Việt Nam" },
    sameAs: socialProfiles,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84 584 556 556",
      contactType: "customer service",
      availableLanguage: ["Vietnamese"],
    },
  };

  return (
    <html lang="vi">
      <body className={beVietnamPro.variable}>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
