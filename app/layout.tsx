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

const title = "Khám Phá Tây Ninh | Cẩm nang du lịch, Cáp treo Núi Bà Đen & Đặc sản";
const description = "Cẩm nang du lịch Tây Ninh & Sun World Núi Bà Đen 2026: Giá vé cáp treo QR, Tượng Phật Bà 72m, Tượng Di Lặc, Show Nhạc Nước 17h00, Lễ Dâng Đèn, đặt tour, thuê xe VinFast VF3 và mua đặc sản.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Khám Phá Tây Ninh" },
  description,
  keywords: [
    "du lịch Tây Ninh",
    "Núi Bà Đen",
    "Sun World Ba Den Mountain",
    "cẩm nang du lịch Tây Ninh",
    "vé cáp treo Núi Bà Đen 2026",
    "Tượng Phật Bà Tây Bổ Đà Sơn",
    "Show nhạc nước Di Lặc",
    "Lễ dâng đèn hoa đăng Núi Bà Đen",
    "lịch trình du lịch Tây Ninh 1 ngày",
    "thuê xe VinFast VF3 Tây Ninh",
    "đặc sản Tây Ninh",
    "Mãng Cầu Bà Đen",
    "Bánh canh Trảng Bàng",
    "Bò tơ Tây Ninh"
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
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Khám Phá Tây Ninh – Cẩm nang du lịch Núi Bà Đen, tour và đặc sản" }],
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Khám Phá Tây Ninh - Cẩm Nang Du Lịch & Đặt Vé Sun World Núi Bà Đen",
    alternateName: ["Tây Ninh Trips", "Du Lịch Tây Ninh LNM"],
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    image: `${siteUrl}/og.png`,
    description,
    telephone: "+84 584 556 556",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tây Ninh",
      addressRegion: "Tây Ninh",
      addressCountry: "VN"
    },
    areaServed: { "@type": "AdministrativeArea", name: "Tây Ninh, Việt Nam" },
    sameAs: socialProfiles,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84 584 556 556",
      contactType: "customer service",
      availableLanguage: ["Vietnamese"]
    }
  };

  const touristAttractionSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Khu Du Lịch Núi Bà Đen - Sun World Ba Den Mountain",
    description: "Nóc nhà Nam Bộ 986m với Tượng Phật Bà Tây Bổ Đà Sơn cao 72m, Tượng Bồ Tát Di Lặc sa thạch 36m, Show Nhạc Nước 17h00, Lễ Dâng Đèn hoa đăng tối Thứ 7 và Quần thể Chùa Bà hơn 300 năm linh thiêng.",
    url: siteUrl,
    image: `${siteUrl}/destinations/mia-nui-ba-den.jpg`,
    touristType: ["Tâm linh", "Thiên nhiên", "Săn mây", "Văn hóa", "Check-in"],
    geo: {
      "@type": "GeoCoordinates",
      latitude: 11.3789,
      longitude: 106.1683
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Xã Thạnh Tân",
      addressLocality: "Thành phố Tây Ninh",
      addressRegion: "Tây Ninh",
      addressCountry: "VN"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Vé cáp treo Sun World Núi Bà Đen dành cho trẻ em tính như thế nào?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vé cáp treo Sun World Ba Den Mountain tính theo độ cao: Trẻ em dưới 1m00 được miễn phí hoàn toàn. Trẻ em từ 1m00 đến 1m40 áp dụng giá vé trẻ em (150.000đ - 350.000đ). Trẻ em trên 1m40 tính vé người lớn (250.000đ - 450.000đ)."
        }
      },
      {
        "@type": "Question",
        name: "Show Nhạc Nước Tượng Di Lặc trên đỉnh Núi Bà Đen diễn ra lúc mấy giờ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Show Nhạc Nước quanh đại Tượng Bồ Tát Di Lặc diễn ra từ 17h00 hàng ngày. Mỗi suất diễn kéo dài 5 phút, giãn cách 15 phút giữa các suất diễn với sự kết hợp của vòi phun 3D, âm thanh và ánh sáng laser hiện đại."
        }
      },
      {
        "@type": "Question",
        name: "Nghi thức Lễ Dâng Đèn Hoa Đăng trên đỉnh Núi Bà Đen diễn ra khi nào?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nghi thức Dâng Đèn Hoa Đăng diễn ra vào tất cả các tối Thứ 7 hàng tuần (từ 18h30 - 19h30) và các ngày lễ lớn tại quảng trường dưới chân Tượng Phật Bà Tây Bổ Đà Sơn."
        }
      },
      {
        "@type": "Question",
        name: "Nên đi Chùa Bà trước hay Đỉnh Núi Bà Đen trước?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lịch trình chuẩn hành hương truyền thống: Buổi sáng đi Cáp Chùa Hang viếng Chùa Bà 300 năm dâng hương cầu an -> Trưa & chiều đi Cáp Tâm An nối lên Đỉnh Núi 986m ăn Buffet Vân Sơn, chiêm bái Tượng Phật Bà & Tượng Di Lặc -> Chiều đi Cáp Vân Sơn trực tiếp xuống chân núi."
        }
      }
    ]
  };

  return (
    <html lang="vi">
      <body className={beVietnamPro.variable}>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </body>
    </html>
  );
}
