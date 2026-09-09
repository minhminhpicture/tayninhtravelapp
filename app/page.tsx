"use client";

import {
  Bike,
  BusFront,
  CalendarDays,
  CableCar,
  CarFront,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Compass,
  Copy,
  Download,
  ExternalLink,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Navigation,
  NotebookTabs,
  PartyPopper,
  Plus,
  ReceiptText,
  Route,
  Search,
  Send,
  Share2,
  ShoppingBag,
  Sparkles,
  Star,
  Ticket,
  Utensils,
  UsersRound,
  Video,
  X,
} from "lucide-react";
import { type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { addDays, lunarToSolar, toISODate, vietnamTodayISO } from "@/lib/vietnamese-lunar";

type Tab = "home" | "explore" | "tour" | "events" | "food" | "rental" | "plan" | "saved" | "guide";
type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};
type InstallPlatform = "ios" | "android" | "in-app" | "desktop";
type VehicleType = "motorbike" | "vf3";
type RentalDraft = {
  id: string;
  vehicle: VehicleType;
  startDate: string;
  endDate: string;
  quantity: number;
};
type AssistantPosition = { x: number; y: number };
type AssistantDrag = { pointerX: number; pointerY: number; x: number; y: number };

const destinations = [
  { id: "nui-ba-den", name: "Núi Bà Đen", type: "Tâm linh · Thiên nhiên", image: "/destinations/mia-nui-ba-den.jpg", time: "Cả ngày", rating: "4.9", address: "Xã Thạnh Tân, Tây Ninh", mapQuery: "Núi Bà Đen, Tây Ninh" },
  { id: "thap-binh-thanh", name: "Tháp cổ Bình Thạnh", type: "Di tích · Kiến trúc", image: "/destinations/thap-binh-thanh-upload.jpeg", time: "1 giờ", rating: "4.7", address: "ĐT786, xã Bình Thạnh, Tây Ninh", mapQuery: "Tháp cổ Bình Thạnh, Tây Ninh" },
  { id: "thap-chop-mat", name: "Tháp Chóp Mạt", type: "Di tích · Văn hóa Óc Eo", image: "/destinations/mia-thap-chop-mat.jpg", time: "1 giờ", rating: "4.6", address: "Ấp Xóm Mới, xã Tân Phong, Tây Ninh", mapQuery: "Tháp Chóp Mạt, Tân Biên, Tây Ninh" },
  { id: "toa-thanh", name: "Tòa Thánh Tây Ninh", type: "Văn hóa · Kiến trúc", image: "/destinations/mia-toa-thanh.jpg", time: "2 giờ", rating: "4.8", address: "Đường Phạm Hộ Pháp, Hòa Thành, Tây Ninh", mapQuery: "Tòa Thánh Tây Ninh" },
  { id: "chua-go-ken", name: "Chùa Gò Kén", type: "Tâm linh · Check-in", image: "/destinations/chua-go-ken-upload.webp", time: "1.5 giờ", rating: "4.7", address: "QL22B, Long Thành Trung, Tây Ninh", mapQuery: "Chùa Gò Kén, Tây Ninh" },
  { id: "ho-dau-tieng", name: "Hồ Dầu Tiếng", type: "Cắm trại · Hoàng hôn", image: "/destinations/mia-ho-dau-tieng.jpg", time: "3 giờ", rating: "4.8", address: "Khu vực hồ Dầu Tiếng, Tây Ninh", mapQuery: "Hồ Dầu Tiếng, Tây Ninh" },
  { id: "lo-go", name: "Vườn quốc gia Lò Gò – Xa Mát", type: "Sinh thái · Khám phá", image: "/destinations/mia-lo-go-xa-mat.jpg", time: "Nửa ngày", rating: "4.8", address: "QL22B, xã Tân Bình, Tân Biên, Tây Ninh", mapQuery: "Vườn quốc gia Lò Gò Xa Mát, Tây Ninh" },
  { id: "ma-thien-lanh", name: "Ma Thiên Lãnh", type: "Thiên nhiên · Trekking", image: "/destinations/mia-ma-thien-lanh.jpg", time: "Nửa ngày", rating: "4.7", address: "Xã Bình Minh, Tây Ninh", mapQuery: "Ma Thiên Lãnh, Tây Ninh" },
];

const services = [
  { id: "guide", title: "Cẩm nang du lịch", note: "Bí kíp Sun World & Tra cứu du khách", image: "/destinations/mia-nui-ba-den.jpg", icon: NotebookTabs, color: "purple" },
  { id: "tour", title: "Tour Tây Ninh", note: "1 ngày · 2 ngày 1 đêm", image: "/tour.webp", icon: BusFront, color: "mint" },
  { id: "ticket", title: "Vé cáp treo", note: "Đặt online · Nhận vé nhanh", image: "/cable-car.jpg", icon: CableCar, color: "amber" },
  { id: "rental", title: "Thuê xe", note: "Kiểm tra lịch xe máy · VinFast VF3", image: "/vehicle.png", icon: CarFront, color: "blue" },
];

const quickActions = [
  { label: "Cẩm nang", icon: NotebookTabs, action: "guide" },
  { label: "Vé cáp treo", icon: Ticket, action: "service" },
  { label: "Tour", icon: Route, action: "service" },
  { label: "Thuê xe", icon: Bike, action: "service" },
  { label: "Ẩm thực", icon: Utensils, action: "food" },
  { label: "Đặc sản", icon: ShoppingBag, action: "food" },
];

const heroSlides = [
  { image: "/destinations/trang-ta-not-upload.png", alt: "Toàn cảnh thiên nhiên Trảng Tà Nốt, Tây Ninh" },
  { image: "/destinations/chua-go-ken-upload.webp", alt: "Toàn cảnh Chùa Gò Kén nhìn từ trên cao" },
  { image: "/destinations/thap-binh-thanh-upload.jpeg", alt: "Tháp cổ Bình Thạnh giữa khuôn viên xanh" },
];

const socialChannels = [
  {
    label: "TikTok Tây Ninh Trips",
    note: "Video ngắn và trải nghiệm thực tế",
    url: "https://www.tiktok.com/@tayninhtrips",
    icon: Video,
    tone: "tiktok",
  },
  {
    label: "Facebook Tây Ninh Trip",
    note: "Tin mới và gợi ý hành trình",
    url: "https://www.facebook.com/tayninhtrip",
    icon: MessageCircle,
    tone: "facebook",
  },
  {
    label: "Cộng đồng Tây Ninh",
    note: "Chia sẻ kinh nghiệm cùng thành viên",
    url: "https://www.facebook.com/groups/253074593088919",
    icon: UsersRound,
    tone: "group",
  },
];

const tourDays = [
  {
    day: "Ngày 1",
    title: "Nội thành Tây Ninh",
    image: "/destinations/toa-thanh.webp",
    stops: [
      { time: "07:30", name: "Đến Tây Ninh, nhận phòng & ăn sáng" },
      { time: "08:00", name: "Đình Hiệp Ninh" },
      { time: "09:30", name: "Chùa Giác Ngạn" },
      { time: "12:00", name: "Tòa Thánh Tây Ninh" },
      { time: "15:00", name: "Chùa Gò Kén" },
      { time: "18:00", name: "Ăn tối & nghỉ đêm" },
    ],
  },
  {
    day: "Ngày 2",
    title: "Núi Bà Đen & Hồ Dầu Tiếng",
    image: "/destinations/nui-ba-den.jpg",
    stops: [
      { time: "06:00", name: "Trả phòng, ăn sáng gần chân núi" },
      { time: "07:30", name: "Quần thể tâm linh Núi Bà Đen" },
      { time: "10:30", name: "Đỉnh Núi Bà Đen & các công trình biểu tượng" },
      { time: "12:00", name: "Ăn trưa, di chuyển xuống núi" },
      { time: "13:30", name: "Chùa Khedol" },
      { time: "14:30", name: "Chùa Thái Sơn – núi Cậu" },
      { time: "17:00", name: "Dùng bữa bên Hồ Dầu Tiếng" },
    ],
  },
];

type EventItem = {
  name: string;
  lunarDate: string;
  startDate: string;
  endDate: string;
  location: string;
  image: string;
  note: string;
  mapQuery: string;
  url?: string;
};

type AnnualEvent = Omit<EventItem, "startDate" | "endDate"> & {
  lunarStart: { day: number; month: number };
  lunarEnd?: { day: number; month: number };
  throughLunarMonthEnd?: boolean;
};

const annualEvents: AnnualEvent[] = [
  {
    name: "Lễ vía Đức Phật Di Lặc",
    lunarDate: "Mùng 1 tháng Giêng",
    lunarStart: { day: 1, month: 1 },
    location: "Núi Bà Đen",
    image: "/events/xuan-nui-ba-den.jpg",
    note: "Nghi lễ cầu an đầu năm, dâng hương và chiêm bái tượng Phật lớn trên đỉnh núi.",
    mapQuery: "Khu du lịch Núi Bà Đen, Tây Ninh",
  },
  {
    name: "Hội Xuân Núi Bà Đen",
    lunarDate: "Mùng 4 – hết tháng Giêng",
    lunarStart: { day: 4, month: 1 },
    throughLunarMonthEnd: true,
    location: "Khu du lịch Núi Bà Đen",
    image: "/events/xuan-nui-ba-den.jpg",
    note: "Sự kiện lớn nhất đầu năm với nghi thức Phật giáo, dâng hương, cầu bình an, văn hóa dân gian và biểu diễn nghệ thuật.",
    mapQuery: "Khu du lịch Núi Bà Đen, Tây Ninh",
  },
  {
    name: "Đại lễ vía Đức Chí Tôn",
    lunarDate: "Mùng 9 tháng Giêng",
    lunarStart: { day: 9, month: 1 },
    lunarEnd: { day: 10, month: 1 },
    location: "Tòa Thánh Tây Ninh",
    image: "/events/yen-dieu-tri-cung.jpg",
    note: "Đại lễ quan trọng nhất của đạo Cao Đài, tín đồ khắp nơi quy tụ về Tòa Thánh với nghi thức trang trọng.",
    mapQuery: "Tòa Thánh Tây Ninh",
  },
  {
    name: "Lễ hội truyền thống Động Kim Quang",
    lunarDate: "14 tháng Giêng",
    lunarStart: { day: 14, month: 1 },
    location: "Động Kim Quang, Núi Bà Đen",
    image: "/events/dong-kim-quang.jpg",
    note: "Lễ rước kiệu, dâng hương và biểu diễn văn nghệ dân gian gắn với lịch sử, tín ngưỡng địa phương.",
    mapQuery: "Động Kim Quang, Tây Ninh",
  },
  {
    name: "Lễ vía Quán Thế Âm Bồ Tát",
    lunarDate: "19 tháng 2 âm lịch",
    lunarStart: { day: 19, month: 2 },
    location: "Núi Bà Đen",
    image: "/events/xuan-nui-ba-den.jpg",
    note: "Đại lễ tôn kính Quán Thế Âm Bồ Tát với hàng ngàn phật tử dâng hương, tụng kinh và phóng sinh.",
    mapQuery: "Khu du lịch Núi Bà Đen, Tây Ninh",
  },
  {
    name: "Đại lễ Phật Đản",
    lunarDate: "Rằm tháng 4 âm lịch",
    lunarStart: { day: 15, month: 4 },
    location: "Các chùa & Tòa Thánh Tây Ninh",
    image: "/events/dong-kim-quang.jpg",
    note: "Kỷ niệm ngày Đức Phật Thích Ca đản sinh, các chùa tổ chức lễ tắm Phật, thả đèn hoa đăng trang trọng.",
    mapQuery: "Núi Bà Đen, Tây Ninh",
  },
  {
    name: "Lễ vía Bà Linh Sơn Thánh Mẫu",
    lunarDate: "Mùng 4–6 tháng 5 âm lịch",
    lunarStart: { day: 4, month: 5 },
    lunarEnd: { day: 6, month: 5 },
    location: "Núi Bà Đen",
    image: "/events/via-ba-linh-son.jpg",
    note: "Lễ hội tâm linh lớn nhất miền Nam với nghi thức Trình thập cúng, thu hút hàng triệu khách hành hương.",
    mapQuery: "Linh Sơn Tiên Thạch Tự, Tây Ninh",
  },
  {
    name: "Lễ Vu Lan – Báo hiếu",
    lunarDate: "Rằm tháng 7 âm lịch",
    lunarStart: { day: 15, month: 7 },
    location: "Các chùa Tây Ninh",
    image: "/events/vu-lan-hoa-dang.jpg",
    note: "Mùa Vu Lan báo hiếu, các chùa tổ chức lễ cầu siêu, bông hồng cài áo và thả đèn hoa đăng trên sông.",
    mapQuery: "Núi Bà Đen, Tây Ninh",
  },
  {
    name: "Đại lễ Hội yến Diêu Trì Cung",
    lunarDate: "Rằm tháng 8 âm lịch",
    lunarStart: { day: 15, month: 8 },
    location: "Tòa Thánh Tây Ninh",
    image: "/events/yen-dieu-tri-cung.jpg",
    note: "Đại lễ quan trọng của đạo Cao Đài với nghi thức trang trọng, múa rồng, múa lân và diễn hành xe hoa.",
    mapQuery: "Tòa Thánh Tây Ninh",
  },
  {
    name: "Lễ kỷ niệm Đức Quyền Giáo Tông",
    lunarDate: "12 tháng 10 âm lịch",
    lunarStart: { day: 12, month: 10 },
    location: "Tòa Thánh Tây Ninh",
    image: "/events/yen-dieu-tri-cung.jpg",
    note: "Lễ tưởng niệm Đức Quyền Giáo Tông, tín đồ Cao Đài khắp nơi hội tụ dâng hương và tế lễ long trọng.",
    mapQuery: "Tòa Thánh Tây Ninh",
  },
  {
    name: "Lễ giỗ Quan Lớn Trà Vong",
    lunarDate: "15 tháng 10 âm lịch",
    lunarStart: { day: 15, month: 10 },
    location: "Đền Trà Vong, Trảng Bàng",
    image: "/events/quan-lon-tra-vong.jpg",
    note: "Dịp tưởng nhớ vị tướng có công bảo vệ vùng đất, kết hợp hát bội, diễn tuồng và hội chợ ẩm thực.",
    mapQuery: "Đền thờ Quan Lớn Trà Vong, Tây Ninh",
  },
];

function resolveAnnualEvents(lunarYear: number): EventItem[] {
  return annualEvents.map(({ lunarStart, lunarEnd, throughLunarMonthEnd, ...event }) => {
    const startDate = toISODate(lunarToSolar(lunarStart.day, lunarStart.month, lunarYear));
    let endDate = startDate;
    if (lunarEnd) endDate = toISODate(lunarToSolar(lunarEnd.day, lunarEnd.month, lunarYear));
    if (throughLunarMonthEnd) {
      const nextMonthStart = toISODate(lunarToSolar(1, lunarStart.month + 1, lunarYear));
      endDate = addDays(nextMonthStart, -1);
    }
    return { ...event, startDate, endDate };
  });
}

function eventsAroundToday(today: string): EventItem[] {
  const year = Number(today.slice(0, 4));
  return [...resolveAnnualEvents(year), ...resolveAnnualEvents(year + 1)];
}

function getEventStatus(event: EventItem, today: string): "happening" | "upcoming" | "past" {
  if (today >= event.startDate && today <= event.endDate) return "happening";
  if (today < event.startDate) return "upcoming";
  return "past";
}

function getMonthLabel(monthIndex: number): string {
  const labels = ["Th\u00e1ng 1", "Th\u00e1ng 2", "Th\u00e1ng 3", "Th\u00e1ng 4", "Th\u00e1ng 5", "Th\u00e1ng 6", "Th\u00e1ng 7", "Th\u00e1ng 8", "Th\u00e1ng 9", "Th\u00e1ng 10", "Th\u00e1ng 11", "Th\u00e1ng 12"];
  return labels[monthIndex] || "";
}

function formatDateRange(startDate: string, endDate: string): string {
  const fmt = (d: string) => { const p = d.split("-"); return `${p[2]}/${p[1]}/${p[0]}`; };
  if (startDate === endDate) return fmt(startDate);
  return `${fmt(startDate)} \u2013 ${fmt(endDate)}`;
}

const foodCategories = [
  { id: "all", label: "Tất cả" },
  { id: "savory", label: "Món mặn" },
  { id: "ricepaper", label: "Bánh tráng" },
  { id: "gift", label: "Đặc sản quà" },
  { id: "vegetarian", label: "Món chay" },
  { id: "sweet", label: "Món ngọt" },
];

const foods = [
  { name: "Mãng Cầu Bà Đen", category: "gift", image: "/foods/mang-cau.jpg", note: "Đặc sản nổi bật của vùng chân Núi Bà Đen, thơm và có vị ngọt thanh.", url: "https://zalo.me/2227000692046430780" },
  { name: "Bánh canh Trảng Bàng", category: "savory", image: "/foods/banh-canh-trang-bang.jpg", note: "Sợi bánh canh mềm dai, nước dùng xương ngọt thanh, thường dùng kèm thịt heo và rau." },
  { name: "Bò tơ Tây Ninh", category: "savory", image: "/foods/bo-to.jpg", note: "Thịt mềm, ngọt vừa; phổ biến với các món nướng, lẩu, nhúng giấm." },
  { name: "Ốc núi Bà Đen", category: "savory", image: "/foods/oc-nui.jpg", note: "Ốc sống trong hang đá, có vị thảo mộc; thường hấp, luộc hoặc xào." },
  { name: "Mắm chua thịt luộc", category: "savory", image: "/foods/mam-chua-thit-luoc.jpg", note: "Vị chua, cay, mặn, ngọt; ăn cùng thịt luộc, bánh tráng và rau sống." },
  { name: "Bánh xèo rau rừng", category: "savory", image: "/foods/banh-xeo-rau-rung.jpg", note: "Bánh xèo giòn cuốn cùng nhiều loại rau rừng đặc trưng Tây Ninh." },
  { name: "Bánh tráng phơi sương", category: "ricepaper", image: "/foods/banh-trang-phoi-suong.jpg", note: "Bánh dẻo dai, có thể dùng trực tiếp; đặc sản nổi tiếng của Trảng Bàng." },
  { name: "Bánh tráng cuốn", category: "ricepaper", image: "/foods/banh-trang-cuon.jpg", note: "Nhiều vị mặn, ngọt, cay, chua; thường cuốn cùng tép hành, bơ hoặc muối." },
  { name: "Bánh tráng nướng", category: "ricepaper", image: "/foods/banh-trang-nuong.jpg", note: "Món ăn vặt giòn thơm, dễ mua khi khám phá Tây Ninh." },
  { name: "Muối Tây Ninh", category: "gift", image: "/foods/muoi-tay-ninh.jpg", note: "Có cả loại chay và mặn; phù hợp dùng tại chỗ hoặc mua về làm quà." },
  { name: "Nem bưởi", category: "vegetarian", image: "/foods/nem-buoi.jpg", note: "Món chay đặc trưng, có vị chua ngọt và kết cấu dai nhẹ." },
  { name: "Bánh canh chay", category: "vegetarian", image: "/foods/banh-canh-chay.jpg", note: "Lựa chọn thanh nhẹ, phù hợp hành trình tham quan vùng đất Thánh." },
  { name: "Kẹo thèo lèo", category: "sweet", image: "/foods/keo-theo-leo.jpg", note: "Món ngọt giòn thơm từ đậu phộng và mạch nha, tiện mua làm quà." },
  { name: "Mứt chùm ruột", category: "sweet", image: "/foods/mut-chum-ruot.jpg", note: "Vị chua ngọt, màu đỏ bắt mắt, là món quà vặt quen thuộc." },
];

export default function HomePage() {
  const today = useMemo(() => vietnamTodayISO(), []);
  const allEvents = useMemo(() => eventsAroundToday(today), [today]);
  const [tab, setTab] = useState<Tab>("home");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string[]>(["nui-ba-den", "toa-thanh"]);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [installHint, setInstallHint] = useState(false);
  const [installPlatform, setInstallPlatform] = useState<InstallPlatform>("desktop");
  const [isInstalled, setIsInstalled] = useState(false);
  const [toast, setToast] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantPosition, setAssistantPosition] = useState<AssistantPosition | null>(null);
  const [assistantDragging, setAssistantDragging] = useState(false);
  const [assistantHintVisible, setAssistantHintVisible] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);
  const [foodCategory, setFoodCategory] = useState("all");
  const [vehicle, setVehicle] = useState<VehicleType>("motorbike");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [rentalNote, setRentalNote] = useState("");
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [rentalDrafts, setRentalDrafts] = useState<RentalDraft[]>([]);
  const assistantRef = useRef<HTMLElement | null>(null);
  const assistantDragRef = useRef<AssistantDrag | null>(null);
  const assistantDidDragRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("tn-favorites");
    if (saved) setFavorites(JSON.parse(saved));
    const drafts = localStorage.getItem("tn-rental-drafts");
    if (drafts) setRentalDrafts(JSON.parse(drafts));
    const userAgent = navigator.userAgent;
    const inAppBrowser = /Zalo|FBAN|FBAV|FB_IAB|Instagram|Line\/|Messenger|TikTok/i.test(userAgent);
    const isiOS = /iPad|iPhone|iPod/i.test(userAgent)
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(userAgent);
    setInstallPlatform(inAppBrowser ? "in-app" : isiOS ? "ios" : isAndroid ? "android" : "desktop");
    setIsInstalled(
      window.matchMedia("(display-mode: standalone)").matches
      || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone)),
    );

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((registration) => registration.update()).catch(() => undefined);
    }
    const onInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    const onInstalled = () => {
      setInstallPrompt(null);
      setInstallHint(false);
      setIsInstalled(true);
      notify("Ứng dụng đã được cài đặt");
    };
    window.addEventListener("beforeinstallprompt", onInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    const hintTimer = window.setTimeout(() => setAssistantHintVisible(false), 4200);
    const content = document.querySelector<HTMLElement>(".screen-content");
    const hideHint = () => setAssistantHintVisible(false);
    content?.addEventListener("scroll", hideHint, { passive: true, once: true });
    window.addEventListener("scroll", hideHint, { passive: true, once: true });
    return () => {
      window.clearTimeout(hintTimer);
      content?.removeEventListener("scroll", hideHint);
      window.removeEventListener("scroll", hideHint);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("tn-assistant-position");
    if (!saved) return;
    try {
      const position = JSON.parse(saved) as AssistantPosition;
      if (Number.isFinite(position.x) && Number.isFinite(position.y)) {
        setAssistantPosition(position);
        setAssistantHintVisible(false);
      }
    } catch {
      localStorage.removeItem("tn-assistant-position");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tn-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("tn-rental-drafts", JSON.stringify(rentalDrafts));
  }, [rentalDrafts]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const content = document.querySelector<HTMLElement>(".screen-content");
    content?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  const results = useMemo(() => destinations.filter((item) =>
    `${item.name} ${item.type}`.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  const filteredFoods = useMemo(
    () => foodCategory === "all" ? foods : foods.filter((item) => item.category === foodCategory),
    [foodCategory],
  );

  const dateRangeValid = Boolean(startDate && endDate && startDate <= endDate);
  const vehicleLabel = vehicle === "motorbike" ? "Xe máy" : "VinFast VF3";
  const quoteText = [
    "YÊU CẦU KIỂM TRA & BÁO GIÁ THUÊ XE TÂY NINH",
    `Loại xe: ${vehicleLabel}`,
    `Ngày nhận: ${startDate || "Chưa chọn"}`,
    `Ngày trả: ${endDate || "Chưa chọn"}`,
    `Số lượng: ${quantity}`,
    `Khách hàng: ${customerName || "Chưa cung cấp"}`,
    `Số điện thoại: ${customerPhone || "Chưa cung cấp"}`,
    `Ghi chú: ${rentalNote || "Không có"}`,
    "Tôi muốn trao đổi thêm và nhận báo giá thuê xe qua Zalo.",
  ].join("\n");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const clampAssistantPosition = (x: number, y: number) => {
    const assistant = assistantRef.current;
    const frame = assistant?.closest<HTMLElement>(".app-frame");
    const frameRect = frame?.getBoundingClientRect();
    const width = assistant?.offsetWidth || 78;
    const height = assistant?.offsetHeight || 76;
    const minX = Math.max(8, (frameRect?.left || 0) + 8);
    const maxX = Math.max(minX, Math.min(window.innerWidth - 8, frameRect?.right || window.innerWidth) - width - 8);
    const minY = Math.max(76, (frameRect?.top || 0) + 76);
    const maxY = Math.max(minY, Math.min(window.innerHeight, frameRect?.bottom || window.innerHeight) - height - 88);
    return { x: Math.min(maxX, Math.max(minX, x)), y: Math.min(maxY, Math.max(minY, y)) };
  };

  const startAssistantDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (assistantOpen) return;
    const rect = assistantRef.current?.getBoundingClientRect();
    if (!rect) return;
    assistantDragRef.current = { pointerX: event.clientX, pointerY: event.clientY, x: rect.left, y: rect.top };
    assistantDidDragRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveAssistant = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const start = assistantDragRef.current;
    if (!start) return;
    const deltaX = event.clientX - start.pointerX;
    const deltaY = event.clientY - start.pointerY;
    if (!assistantDidDragRef.current && Math.hypot(deltaX, deltaY) < 6) return;
    assistantDidDragRef.current = true;
    setAssistantDragging(true);
    setAssistantHintVisible(false);
    setAssistantPosition(clampAssistantPosition(start.x + deltaX, start.y + deltaY));
  };

  const finishAssistantDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const start = assistantDragRef.current;
    if (!start) return;
    assistantDragRef.current = null;
    setAssistantDragging(false);
    if (!assistantDidDragRef.current) return;
    const currentPosition = clampAssistantPosition(
      start.x + event.clientX - start.pointerX,
      start.y + event.clientY - start.pointerY,
    );
    const assistant = assistantRef.current;
    const frameRect = assistant?.closest<HTMLElement>(".app-frame")?.getBoundingClientRect();
    const width = assistant?.offsetWidth || 78;
    const leftEdge = Math.max(8, (frameRect?.left || 0) + 8);
    const rightEdge = Math.min(window.innerWidth - 8, frameRect?.right || window.innerWidth) - width - 8;
    const snapped = clampAssistantPosition(
      currentPosition.x + width / 2 < ((frameRect?.left || 0) + (frameRect?.right || window.innerWidth)) / 2 ? leftEdge : rightEdge,
      currentPosition.y,
    );
    setAssistantPosition(snapped);
    localStorage.setItem("tn-assistant-position", JSON.stringify(snapped));
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  const install = async () => {
    if (isInstalled) {
      notify("Ứng dụng đã có trên màn hình chính");
      return;
    }
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (choice.outcome === "accepted") notify("Đang thêm ứng dụng vào thiết bị");
      else setInstallHint(true);
    } else {
      setInstallHint(true);
    }
  };

  const copyAppLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    notify("Đã sao chép đường dẫn ứng dụng");
  };

  const openMap = (name = "Tây Ninh") => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`, "_blank");
  const openZalo = () => window.open("https://zalo.me/0584556556", "_blank");
  const openTicket = () => window.open("https://nuibaden.lnm.vn", "_blank");
  const copyQuote = async () => {
    if (!dateRangeValid) {
      notify("Vui lòng chọn ngày nhận và ngày trả hợp lệ");
      return false;
    }
    await navigator.clipboard.writeText(quoteText);
    notify("Đã sao chép nội dung báo giá");
    return true;
  };
  const sendQuoteToZalo = async () => {
    const copied = await copyQuote();
    if (!copied) return;
    window.open("https://zalo.me/0584556556", "_blank");
  };
  const saveRentalDraft = () => {
    if (!dateRangeValid) {
      notify("Vui lòng chọn ngày thuê hợp lệ");
      return;
    }
    setRentalDrafts((drafts) => [
      ...drafts,
      { id: crypto.randomUUID(), vehicle, startDate, endDate, quantity },
    ]);
    notify("Đã lưu lịch tạm trên thiết bị");
  };

  return (
    <main className="app-shell">
      <div className="app-frame">
        <header className="topbar">
          <button className="brand" onClick={() => setTab("home")} aria-label="Về trang chủ">
            <span className="brand-mark"><img src="/icon-192.png" alt="" /></span>
            <span><small>KHÁM PHÁ</small>TÂY NINH</span>
          </button>
          {!isInstalled && (
            <button className="install-top" onClick={install} aria-label="Cài ứng dụng Khám Phá Tây Ninh">
              <Download size={17} />
              <span>Cài app</span>
            </button>
          )}
        </header>

        <div className="screen-content">
          {tab === "home" && (
            <>
              <section className="hero-panel">
                <div className="hero-card">
                  <img src={heroSlides[heroSlide].image} alt={heroSlides[heroSlide].alt} />
                  <div className="hero-shade" />
                  <div className="hero-copy">
                    <span className="eyebrow"><Sparkles size={14} /> Hành trình của riêng bạn</span>
                    <h1>Chạm Tây Ninh trong từng khoảnh khắc</h1>
                    <p>Tour địa phương · Vé cáp treo · Thuê xe tiện lợi</p>
                    <button onClick={() => setTab("explore")}>Khám phá ngay <ChevronRight size={17} /></button>
                  </div>
                  <div className="hero-dots" aria-label="Chọn ảnh">
                    {heroSlides.map((slide, index) => (
                      <button key={slide.image} className={heroSlide === index ? "active" : ""} onClick={() => setHeroSlide(index)} aria-label={`Ảnh ${index + 1}`} />
                    ))}
                  </div>
                </div>
              </section>

              <section className="section quick-section">
                <div className="section-title"><h2>Tiện ích nhanh</h2><button onClick={() => setTab("explore")}>Xem tất cả</button></div>
                <div className="quick-grid">
                  {quickActions.map(({ label, icon: Icon, action }) => (
                    <button key={label} onClick={() => {
                      if (label === "Cẩm nang" || action === "guide") setTab("guide");
                      else if (label === "Vé cáp treo") openTicket();
                      else if (action === "support") openZalo();
                      else if (action === "food") setTab("food");
                      else if (action === "events") setTab("events");
                      else if (label === "Thuê xe") setTab("rental");
                      else if (label === "Tour") setTab("tour");
                      else setTab("explore");
                    }}>
                      <span><Icon size={23} strokeWidth={1.8} /></span>
                      <b>{label}</b>
                    </button>
                  ))}
                </div>
              </section>

              <section className="section">
                <div className="section-title"><div><span>GỢI Ý CHO BẠN</span><h2>Điểm đến nổi bật</h2></div><button onClick={() => setTab("explore")}>Xem thêm</button></div>
                <div className="card-scroll">
                  {destinations.slice(0, 4).map((item) => (
                    <DestinationCard key={item.id} item={item} favorite={favorites.includes(item.id)} onFavorite={() => toggleFavorite(item.id)} onMap={() => openMap(item.mapQuery)} />
                  ))}
                </div>
              </section>

              <section className="section">
                <div className="section-title"><div><span>DỄ DÀNG ĐẶT TRƯỚC</span><h2>Dịch vụ du lịch</h2></div></div>
                <div className="service-list">
                  {services.map(({ id, title, note, image, icon: Icon, color }) => (
                    <button className="service-card" key={title} onClick={() => id === "guide" ? setTab("guide") : id === "rental" ? setTab("rental") : id === "ticket" ? openTicket() : setTab("tour")}>
                      <img src={image} alt="" />
                      <span className={`service-icon ${color}`}><Icon size={21} /></span>
                      <span className="service-copy"><b>{title}</b><small>{note}</small></span>
                      <ChevronRight size={20} />
                    </button>
                  ))}
                </div>
              </section>

              <HomeEventsSection events={allEvents} onViewAll={() => setTab("events")} onMap={openMap} />

              <section className="section social-section">
                <div className="section-title"><div><span>KẾT NỐI CỘNG ĐỒNG</span><h2>Theo dõi Tây Ninh Trips</h2></div></div>
                <div className="social-list">
                  {socialChannels.map(({ label, note, url, icon: Icon, tone }) => (
                    <a className={`social-card ${tone}`} href={url} target="_blank" rel="me noopener noreferrer" key={url}>
                      <span className="social-icon"><Icon size={21} /></span>
                      <span className="social-copy"><b>{label}</b><small>{note}</small></span>
                      <ExternalLink size={17} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </section>

              {!isInstalled && (
                <section className="install-card">
                  <div><Download size={24} /></div>
                  <span><b>Cài ứng dụng Khám Phá Tây Ninh</b><small>Mở nhanh, toàn màn hình, dùng tiện lợi như app.</small></span>
                  <button onClick={install}>Cài ngay</button>
                </section>
              )}
            </>
          )}

          {tab === "explore" && (
            <section className="page-section">
              <span className="page-kicker">ĐI ĐÂU HÔM NAY?</span>
              <h1>Khám phá Tây Ninh</h1>
              <button className="search-box" onClick={() => setSearchOpen(true)}><Search size={19} /> Tìm điểm đến, dịch vụ...<span>⌘K</span></button>
              <div className="filter-row"><button className="active">Tất cả</button><button>Tâm linh</button><button>Thiên nhiên</button><button onClick={() => setTab("food")}>Ẩm thực</button></div>
              <div className="destination-grid">
                {destinations.map((item) => (
                  <DestinationCard key={item.id} item={item} favorite={favorites.includes(item.id)} onFavorite={() => toggleFavorite(item.id)} onMap={() => openMap(item.mapQuery)} />
                ))}
              </div>
              <h2 className="subheading">Dịch vụ nổi bật</h2>
              <div className="service-list">
                {services.map(({ id, title, note, image, icon: Icon, color }) => (
                  <button className="service-card" key={title} onClick={() => id === "guide" ? setTab("guide") : id === "rental" ? setTab("rental") : id === "ticket" ? openTicket() : setTab("tour")}>
                    <img src={image} alt="" /><span className={`service-icon ${color}`}><Icon size={21} /></span>
                    <span className="service-copy"><b>{title}</b><small>{note}</small></span><ChevronRight size={20} />
                  </button>
                ))}
              </div>
            </section>
          )}

          {tab === "tour" && (
            <section className="page-section tour-page">
              <span className="page-kicker">GỢI Ý HÀNH TRÌNH</span>
              <h1>Tour Tây Ninh 2 ngày 1 đêm</h1>
              <div className="tour-cover">
                <img src="/tour.webp" alt="Tour khám phá Tây Ninh 2 ngày 1 đêm" />
              </div>
              <div className="tour-overview">
                <div><CalendarDays size={20} /><span><small>Thời lượng</small><b>2 ngày 1 đêm</b></span></div>
                <div><BusFront size={20} /><span><small>Khởi hành</small><b>Theo yêu cầu</b></span></div>
                <div><MapPin size={20} /><span><small>Điểm nổi bật</small><b>8+ điểm đến</b></span></div>
              </div>
              <p className="tour-lead">Hành trình kết hợp văn hóa, tâm linh và thiên nhiên: khám phá nội thành Tây Ninh trong ngày đầu, dành ngày hai cho Núi Bà Đen, núi Cậu và Hồ Dầu Tiếng.</p>

              <div className="tour-style-grid">
                <span>Tâm linh</span><span>Thiên nhiên</span><span>Ẩm thực</span><span>Check-in</span>
              </div>

              <div className="tour-itinerary">
                {tourDays.map((day) => (
                  <article className="tour-day" key={day.day}>
                    <div className="tour-day-head">
                      <img src={day.image} alt="" />
                      <div><span>{day.day}</span><h2>{day.title}</h2></div>
                    </div>
                    <div className="tour-stops">
                      {day.stops.map((stop) => (
                        <div key={`${day.day}-${stop.time}-${stop.name}`}>
                          <time>{stop.time}</time><i /><b>{stop.name}</b>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="tour-note">
                <Sparkles size={21} />
                <div><b>Lịch trình có thể tùy chỉnh</b><p>Thời gian, điểm đón, bữa ăn và điểm tham quan sẽ được tư vấn theo nhóm khách, gia đình hoặc đoàn riêng.</p></div>
              </div>
              <button className="primary-wide tour-zalo" onClick={openZalo}><MessageCircle size={19} /> Liên hệ Zalo để tìm hiểu thêm</button>
            </section>
          )}

          {tab === "food" && (
            <section className="page-section food-page">
              <span className="page-kicker">HƯƠNG VỊ ĐẤT THÁNH</span>
              <h1>Ẩm thực & đặc sản Tây Ninh</h1>
              <div className="food-hero">
                <img src="/foods/banh-canh-trang-bang.jpg" alt="Đặc sản ẩm thực Tây Ninh" />
                <div>
                  <span><Utensils size={16} /> Cẩm nang món ngon</span>
                  <h2>Ăn gì khi đến Tây Ninh?</h2>
                  <p>Từ bánh canh Trảng Bàng, bò tơ đến bánh tráng phơi sương và các món quà địa phương.</p>
                </div>
              </div>
              <button className="specialty-cta" onClick={() => window.open("https://zalo.me/2227000692046430780", "_blank")}>
                <span><ShoppingBag size={19} /><b>Đặt mua đặc sản</b></span>
                <small>Tư vấn nhanh qua Zalo OA</small>
                <ChevronRight size={19} />
              </button>
              <div className="food-filters" aria-label="Lọc món ăn">
                {foodCategories.map((category) => (
                  <button key={category.id} className={foodCategory === category.id ? "active" : ""} onClick={() => setFoodCategory(category.id)}>
                    {category.label}
                  </button>
                ))}
              </div>
              <div className="food-list">
                {filteredFoods.map((item) => {
                  const externalUrl = "url" in item ? item.url : undefined;
                  return (
                    <article className="food-card" key={item.name}>
                      <img src={item.image} alt={item.name} loading="lazy" />
                      <div><h3>{item.name}</h3><p>{item.note}</p></div>
                      <button
                        onClick={() => externalUrl ? window.open(externalUrl, "_blank") : openMap(`${item.name}, Tây Ninh`)}
                        aria-label={externalUrl ? `Mở trang ${item.name}` : `Tìm ${item.name} trên bản đồ`}
                      >
                        {externalUrl ? <ChevronRight size={18} /> : <MapPin size={18} />}
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {tab === "events" && (
            <EventsPage events={allEvents} onMap={openMap} />
          )}

          {tab === "rental" && (
            <section className="page-section rental-page">
              <span className="page-kicker">CHỦ ĐỘNG KHÁM PHÁ</span>
              <h1>Đặt thuê xe</h1>
              <div className="rental-intro">
                <img src="/vehicle.png" alt="Thuê xe máy và VinFast VF3 tại Tây Ninh" />
                <div><b>Kiểm tra lịch nhanh</b><span>Chọn xe và thời gian để tạo yêu cầu báo giá.</span></div>
              </div>

              <div className="form-section">
                <label className="field-label">1. Chọn loại xe</label>
                <div className="vehicle-options">
                  <button className={vehicle === "motorbike" ? "active" : ""} onClick={() => { setVehicle("motorbike"); setQuoteVisible(false); }}>
                    <span><Bike size={25} /></span><b>Xe máy</b><small>Linh hoạt · Tiết kiệm</small>
                    {vehicle === "motorbike" && <i><Check size={13} /></i>}
                  </button>
                  <button className={vehicle === "vf3" ? "active" : ""} onClick={() => { setVehicle("vf3"); setQuoteVisible(false); }}>
                    <span><CarFront size={25} /></span><b>VinFast VF3</b><small>Nhỏ gọn · Có điều hòa</small>
                    {vehicle === "vf3" && <i><Check size={13} /></i>}
                  </button>
                </div>
              </div>

              <div className="form-section">
                <label className="field-label">2. Thời gian & số lượng</label>
                <div className="date-grid">
                  <label><span>Ngày nhận</span><input type="date" value={startDate} onChange={(event) => { setStartDate(event.target.value); setQuoteVisible(false); }} /></label>
                  <label><span>Ngày trả</span><input type="date" value={endDate} onChange={(event) => { setEndDate(event.target.value); setQuoteVisible(false); }} /></label>
                </div>
                <div className="quantity-field">
                  <span><b>Số lượng xe</b><small>Tối thiểu 1 xe</small></span>
                  <div><button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><b>{quantity}</b><button onClick={() => setQuantity((value) => Math.min(20, value + 1))}><Plus size={16} /></button></div>
                </div>
              </div>

              <div className="form-section">
                <label className="field-label">3. Thông tin liên hệ</label>
                <div className="date-grid">
                  <label><span>Họ và tên</span><input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Tên khách thuê" /></label>
                  <label><span>Số điện thoại</span><input type="tel" inputMode="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="09xx xxx xxx" /></label>
                </div>
                <label className="text-field"><span>Ghi chú thêm</span><textarea value={rentalNote} onChange={(event) => setRentalNote(event.target.value)} placeholder="Giờ nhận xe, giao tận nơi, loại xe mong muốn..." rows={3} /></label>
              </div>

              <div className="rental-actions">
                <button className="secondary-action" onClick={saveRentalDraft}><NotebookTabs size={18} /> Lưu lịch tạm</button>
                <button className="quote-action" onClick={() => {
                  if (!dateRangeValid) return notify("Vui lòng chọn ngày thuê hợp lệ");
                  setQuoteVisible(true);
                }}><ReceiptText size={19} /> Tạo báo giá</button>
              </div>

              {quoteVisible && (
                <div className="quote-card">
                  <div className="quote-head"><span><ReceiptText size={20} /></span><div><b>Yêu cầu báo giá</b><small>Giá thuê được xác nhận sau khi kiểm tra xe.</small></div></div>
                  <dl>
                    <div><dt>Loại xe</dt><dd>{vehicleLabel}</dd></div>
                    <div><dt>Thời gian</dt><dd>{startDate} → {endDate}</dd></div>
                    <div><dt>Số lượng</dt><dd>{quantity} xe</dd></div>
                  </dl>
                  <button onClick={copyQuote}><Copy size={18} /> Sao chép nội dung</button>
                  <button className="zalo-action" onClick={sendQuoteToZalo}><Send size={18} /> Sao chép & mở Zalo</button>
                </div>
              )}

              {rentalDrafts.length > 0 && (
                <div className="draft-list">
                  <div className="section-title"><div><span>TRÊN THIẾT BỊ NÀY</span><h2>Lịch đã lưu tạm</h2></div></div>
                  {rentalDrafts.map((draft) => (
                    <div className="draft-row" key={draft.id}>
                      <span>{draft.vehicle === "motorbike" ? <Bike size={19} /> : <CarFront size={19} />}</span>
                      <div><b>{draft.vehicle === "motorbike" ? "Xe máy" : "VinFast VF3"} · {draft.quantity} xe</b><small>{draft.startDate} → {draft.endDate}</small></div>
                      <button onClick={() => setRentalDrafts((items) => items.filter((item) => item.id !== draft.id))} aria-label="Xóa lịch tạm"><X size={17} /></button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === "plan" && (
            <section className="page-section">
              <span className="page-kicker">LỊCH TRÌNH THÔNG MINH</span>
              <h1>Chuyến đi của bạn</h1>
              <div className="plan-summary">
                <div><CalendarDays size={24} /><span><small>Gợi ý lịch trình</small><b>Tây Ninh · 1 ngày</b></span></div>
                <button onClick={() => notify("Đã lưu lịch trình trên thiết bị")}><Check size={17} /> Lưu</button>
              </div>
              <div className="timeline">
                {destinations.slice(0, 5).map((item, index) => {
                  const selected = selectedPlan.includes(item.id);
                  return (
                    <button key={item.id} className={selected ? "timeline-item selected" : "timeline-item"} onClick={() => setSelectedPlan((list) => selected ? list.filter((id) => id !== item.id) : [...list, item.id])}>
                      <span className="time">{["07:30", "10:30", "13:30", "15:00", "17:00"][index]}</span>
                      <span className="timeline-dot">{selected && <Check size={12} />}</span>
                      <img src={item.image} alt="" />
                      <span><b>{item.name}</b><small>{item.time} · Chạm để {selected ? "bỏ" : "thêm"}</small></span>
                    </button>
                  );
                })}
              </div>
              <button className="primary-wide" onClick={openZalo}><MessageCircle size={19} /> Nhờ tư vấn lịch trình</button>
            </section>
          )}

          {tab === "saved" && (
            <section className="page-section">
              <span className="page-kicker">BỘ SƯU TẬP CỦA BẠN</span>
              <h1>Đã lưu</h1>
              {favorites.length ? (
                <div className="destination-grid">
                  {destinations.filter((item) => favorites.includes(item.id)).map((item) => (
                    <DestinationCard key={item.id} item={item} favorite onFavorite={() => toggleFavorite(item.id)} onMap={() => openMap(item.mapQuery)} />
                  ))}
                </div>
              ) : (
                <div className="empty-state"><span><Heart size={28} /></span><h2>Chưa có điểm đến đã lưu</h2><p>Nhấn biểu tượng trái tim để lưu nơi bạn muốn ghé thăm.</p><button onClick={() => setTab("explore")}>Bắt đầu khám phá</button></div>
              )}
              <div className="support-panel">
                <MessageCircle size={25} />
                <span><b>Cần hỗ trợ chuyến đi?</b><small>Hotline/Zalo: 0584 556 556</small></span>
                <button onClick={openZalo}>Nhắn ngay</button>
              </div>
            </section>
          )}

          {tab === "guide" && (
            <GuidePage
              onMap={openMap}
              onTicket={openTicket}
              onZalo={openZalo}
              onTour={() => setTab("tour")}
              onRental={() => setTab("rental")}
            />
          )}
        </div>

        <nav className="bottom-nav" aria-label="Điều hướng chính">
          <NavButton active={tab === "home"} icon={Home} label="Trang chủ" onClick={() => setTab("home")} />
          <NavButton active={tab === "guide"} icon={NotebookTabs} label="Cẩm nang" onClick={() => setTab("guide")} />
          <button className="nav-main" onClick={openZalo} aria-label="Liên hệ Zalo hỗ trợ du lịch 0584 556 556"><MessageCircle size={22} /></button>
          <NavButton active={tab === "explore"} icon={Compass} label="Khám phá" onClick={() => setTab("explore")} />
          <NavButton active={tab === "tour"} icon={Route} label="Tour" onClick={() => setTab("tour")} />
        </nav>

        {searchOpen && (
          <div className="modal-backdrop" onClick={() => setSearchOpen(false)}>
            <section className="search-modal" onClick={(event) => event.stopPropagation()}>
              <div className="modal-handle" />
              <div className="modal-head"><h2>Tìm kiếm</h2><button onClick={() => setSearchOpen(false)}><X size={21} /></button></div>
              <label><Search size={20} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Bạn muốn đi đâu?" /></label>
              <div className="search-results">
                {results.map((item) => (
                  <button key={item.id} onClick={() => { openMap(item.mapQuery); setSearchOpen(false); }}>
                    <img src={item.image} alt="" /><span><b>{item.name}</b><small>{item.type}</small></span><Navigation size={18} />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {installHint && (
          <div className="modal-backdrop" onClick={() => setInstallHint(false)}>
            <section className="install-modal" role="dialog" aria-modal="true" aria-label="Hướng dẫn cài ứng dụng" onClick={(event) => event.stopPropagation()}>
              <button className="modal-close" onClick={() => setInstallHint(false)}><X size={21} /></button>
              <span className="install-visual"><Share2 size={29} /></span>
              <h2>Thêm vào màn hình chính</h2>
              {installPlatform === "in-app" && (
                <>
                  <span className="install-platform">Zalo · Facebook · TikTok</span>
                  <ol className="install-steps">
                    <li><b>1</b><span>Nhấn menu <strong>⋯</strong> của trình duyệt hiện tại.</span></li>
                    <li><b>2</b><span>Chọn <strong>Mở bằng Safari</strong> trên iPhone hoặc <strong>Mở bằng Chrome</strong> trên Android.</span></li>
                    <li><b>3</b><span>Quay lại nhấn <strong>Cài app</strong> và làm theo hướng dẫn.</span></li>
                  </ol>
                  <button className="primary-wide" onClick={copyAppLink}><Copy size={18} /> Sao chép đường dẫn</button>
                </>
              )}
              {installPlatform === "ios" && (
                <>
                  <span className="install-platform">iPhone · iPad</span>
                  <ol className="install-steps">
                    <li><b>1</b><span>Mở trang này bằng <strong>Safari</strong>.</span></li>
                    <li><b>2</b><span>Nhấn nút <strong>Chia sẻ</strong> ở thanh công cụ.</span></li>
                    <li><b>3</b><span>Chọn <strong>Thêm vào Màn hình chính</strong>, sau đó nhấn <strong>Thêm</strong>.</span></li>
                  </ol>
                  <button className="primary-wide" onClick={() => setInstallHint(false)}>Đã hiểu</button>
                </>
              )}
              {installPlatform === "android" && (
                <>
                  <span className="install-platform">Điện thoại Android</span>
                  <ol className="install-steps">
                    <li><b>1</b><span>Mở trang này bằng <strong>Chrome</strong>.</span></li>
                    <li><b>2</b><span>Nhấn menu <strong>⋮</strong> ở góc trên bên phải.</span></li>
                    <li><b>3</b><span>Chọn <strong>Cài đặt ứng dụng</strong> hoặc <strong>Thêm vào màn hình chính</strong>.</span></li>
                  </ol>
                  <button className="primary-wide" onClick={() => setInstallHint(false)}>Đã hiểu</button>
                </>
              )}
              {installPlatform === "desktop" && (
                <>
                  <span className="install-platform">Máy tính</span>
                  <p>Trong Chrome hoặc Edge, nhấn biểu tượng cài đặt ở cuối thanh địa chỉ, hoặc mở menu trình duyệt và chọn <b>Cài đặt Khám Phá Tây Ninh</b>.</p>
                  <button className="primary-wide" onClick={() => setInstallHint(false)}>Đã hiểu</button>
                </>
              )}
            </section>
          </div>
        )}

        {toast && <div className="toast"><Check size={16} /> {toast}</div>}
      </div>
    </main>
  );
}

function DestinationCard({ item, favorite, onFavorite, onMap }: { item: typeof destinations[number]; favorite: boolean; onFavorite: () => void; onMap: () => void }) {
  return (
    <article className="destination-card">
      <div className="destination-image">
        <img src={item.image} alt={item.name} />
        <button className={favorite ? "heart active" : "heart"} onClick={onFavorite} aria-label={favorite ? `Bỏ lưu ${item.name}` : `Lưu ${item.name}`}><Heart size={17} fill={favorite ? "currentColor" : "none"} /></button>
        <span><Star size={13} fill="currentColor" /> {item.rating}</span>
      </div>
      <div className="destination-info">
        <b>{item.name}</b><small>{item.type}</small>
        <small className="destination-address"><MapPin size={12} /> {item.address}</small>
        <button onClick={onMap}><MapPin size={14} /> Chỉ đường</button>
      </div>
    </article>
  );
}

function NavButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof Home; label: string; onClick: () => void }) {
  return <button className={active ? "active" : ""} onClick={onClick} aria-current={active ? "page" : undefined}><Icon size={21} strokeWidth={active ? 2.4 : 1.8} /><span>{label}</span></button>;
}

function HomeEventsSection({ events, onViewAll, onMap }: { events: EventItem[]; onViewAll: () => void; onMap: (q: string) => void }) {
  const today = vietnamTodayISO();

  const happeningEvents = events.filter((e) => getEventStatus(e, today) === "happening");
  const upcomingEvents = events
    .filter((e) => getEventStatus(e, today) === "upcoming")
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 5);

  const featuredEvent = happeningEvents[0] || upcomingEvents[0];
  const scrollEvents = [...happeningEvents, ...upcomingEvents].filter((e) => e !== featuredEvent).slice(0, 6);

  if (!featuredEvent) return null;

  const featuredStatus = getEventStatus(featuredEvent, today);
  const monthLabel = getMonthLabel(Number(featuredEvent.startDate.slice(5, 7)) - 1);

  return (
    <section className="section home-events">
      <div className="section-title">
        <div>
          <span>{featuredStatus === "happening" ? "ĐANG DIỄN RA" : "LỊCH ÂM VIỆT NAM"} · {monthLabel.toUpperCase()}</span>
          <h2>Lễ hội văn hóa Tây Ninh</h2>
        </div>
        <button onClick={onViewAll}>Tất cả lễ hội</button>
      </div>
      <article className="month-event-card">
        <img src={featuredEvent.image} alt={featuredEvent.name} />
        <div className="month-event-copy">
          <span><PartyPopper size={14} /> {featuredStatus === "happening" ? "Đang diễn ra" : "Lễ hội tiêu biểu"}</span>
          <h3>{featuredEvent.name}</h3>
          <p>{featuredEvent.note}</p>
          <small><MapPin size={13} /> {featuredEvent.location}</small>
          <small><CalendarDays size={13} /> {featuredEvent.lunarDate} · DL: {formatDateRange(featuredEvent.startDate, featuredEvent.endDate)}</small>
          <div>
            {featuredEvent.url ? (
              <button onClick={() => window.open(featuredEvent.url, "_blank")}>Xem chi tiết <ChevronRight size={14} /></button>
            ) : (
              <button onClick={() => onMap(featuredEvent.mapQuery)}>Chỉ đường <ChevronRight size={14} /></button>
            )}
            <button onClick={() => onMap(featuredEvent.mapQuery)} aria-label="Mở địa điểm trên Google Maps"><Navigation size={15} /></button>
          </div>
        </div>
      </article>

      {scrollEvents.length > 0 && (
        <div className="events-scroll">
          {scrollEvents.map((event) => {
            const status = getEventStatus(event, today);
            return (
              <article className="event-scroll-card" key={event.name}>
                <img src={event.image} alt={event.name} loading="lazy" />
                <div>
                  <span className={`event-status ${status}`}>{status === "happening" ? "Đang diễn ra" : "Sắp diễn ra"}</span>
                  <h4>{event.name}</h4>
                  <small><CalendarDays size={11} /> {event.lunarDate} · DL: {formatDateRange(event.startDate, event.endDate)}</small>
                  <small><MapPin size={11} /> {event.location}</small>
                </div>
                <button onClick={() => onMap(event.mapQuery)} aria-label={`Chỉ đường đến ${event.name}`}><Navigation size={14} /></button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function EventsPage({ events, onMap }: { events: EventItem[]; onMap: (q: string) => void }) {
  const today = vietnamTodayISO();
  const currentYear = today.slice(0, 4);
  const happening = events.filter((e) => getEventStatus(e, today) === "happening");
  const upcoming = events.filter((e) => getEventStatus(e, today) === "upcoming").sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past = events.filter((e) => getEventStatus(e, today) === "past" && e.startDate.startsWith(currentYear)).sort((a, b) => b.startDate.localeCompare(a.startDate));
  const featured = happening[0] || upcoming[0];
  const monthLabel = featured ? getMonthLabel(Number(featured.startDate.slice(5, 7)) - 1) : "";

  return (
    <section className="page-section events-page">
      <span className="page-kicker">TỰ ĐỘNG CẬP NHẬT THEO LỊCH ÂM VIỆT NAM</span>
      <h1>Lễ hội văn hóa Tây Ninh</h1>

      {featured && (
        <article className="event-featured">
          <img src={featured.image} alt={featured.name} />
          <div>
            <span><PartyPopper size={15} /> {getEventStatus(featured, today) === "happening" ? "Đang diễn ra" : "Sắp tới"} · {monthLabel}</span>
            <h2>{featured.name}</h2>
            <p>{featured.note}</p>
            {featured.url ? (
              <button onClick={() => window.open(featured.url, "_blank")}><ChevronRight size={15} /> Xem chi tiết</button>
            ) : (
              <button onClick={() => onMap(featured.mapQuery)}><Navigation size={15} /> Chỉ đường</button>
            )}
          </div>
        </article>
      )}

      {happening.length > 0 && (
        <>
          <h2 className="events-group-title"><span className="status-dot happening" /> Đang diễn ra</h2>
          <div className="event-list">
            {happening.map((event) => (
              <EventCard key={event.name} event={event} onMap={onMap} status="happening" />
            ))}
          </div>
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <h2 className="events-group-title"><span className="status-dot upcoming" /> Sắp tới</h2>
          <div className="event-list">
            {upcoming.map((event) => (
              <EventCard key={event.name} event={event} onMap={onMap} status="upcoming" />
            ))}
          </div>
        </>
      )}

      {past.length > 0 && (
        <>
          <h2 className="events-group-title"><span className="status-dot past" /> Đã qua</h2>
          <div className="event-list">
            {past.map((event) => (
              <EventCard key={event.name} event={event} onMap={onMap} status="past" />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function EventCard({ event, onMap, status }: { event: EventItem; onMap: (q: string) => void; status: "happening" | "upcoming" | "past" }) {
  return (
    <article className={`event-card ${status === "past" ? "event-past" : ""}`}>
      <img src={event.image} alt={event.name} loading="lazy" />
      <div>
        <span className="event-date"><CalendarDays size={13} /> {event.lunarDate} · DL: {formatDateRange(event.startDate, event.endDate)}</span>
        <h2>{event.name}</h2>
        <small><MapPin size={12} /> {event.location}</small>
        <p>{event.note}</p>
        <div className="event-actions">
          <button onClick={() => onMap(event.mapQuery)}>Chỉ đường <Navigation size={14} /></button>
          {event.url && <button onClick={() => window.open(event.url, "_blank")}>Chi tiết <ChevronRight size={14} /></button>}
        </div>
      </div>
    </article>
  );
}

type GuideCategory = "all" | "cable" | "attraction" | "transport" | "food" | "tips" | "itinerary";

interface GuideArticle {
  id: string;
  category: GuideCategory;
  title: string;
  badge: string;
  image: string;
  images?: { url: string; caption: string }[];
  summary: string;
  highlights: string[];
  content: string[];
  tips?: string;
  mapQuery?: string;
  actionText?: string;
  actionType?: "map" | "ticket" | "zalo" | "tour" | "rental";
}

interface GuideFaq {
  id: string;
  question: string;
  answer: string;
  category: GuideCategory;
}

const guideCategories: { id: GuideCategory; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "cable", label: "Cáp treo & Vé" },
  { id: "attraction", label: "Điểm đến" },
  { id: "transport", label: "Di chuyển" },
  { id: "food", label: "Ẩm thực" },
  { id: "tips", label: "Mẹo & Lưu ý" },
  { id: "itinerary", label: "Lịch trình" },
];

const guideArticles: GuideArticle[] = [
  {
    id: "tuyen-cap-van-son",
    category: "cable",
    title: "Tuyến cáp Vân Sơn – Hành trình chinh phục Nóc nhà Nam Bộ 986m",
    badge: "Sun World Ba Den",
    image: "/guide/nui-ba-den-toan-canh-that.webp",
    images: [
      { url: "/guide/nui-ba-den-toan-canh-that.webp", caption: "Toàn cảnh Đỉnh Núi Bà Đen & Tượng Phật Bà 72m từ trên cao" },
      { url: "/guide/nhac-nuoc-di-lac-that.jpg", caption: "Show Nhạc Nước bên Tượng Bồ Tát Di Lặc sa thạch về đêm" },
      { url: "/guide/chua-ba-chieu-toi.webp", caption: "Linh Sơn Tiên Thạch Tự (Chùa Bà) lung linh chiều tối" },
    ],
    summary: "Tuyến cáp treo đưa du khách từ chân núi lên thẳng đỉnh Núi Bà Đen, chiêm bái Tượng Phật Bà Tây Bổ Đà Sơn và Tượng Bồ Tát Di Lặc sa thạch.",
    highlights: [
      "Chiêm bái Tượng Phật Bà Bằng Đồng cao nhất Châu Á (72m)",
      "Đại tượng Phật Bồ Tát Di Lặc sa thạch lớn bậc nhất thế giới (36m)",
      "Trung tâm triển lãm Phật giáo công nghệ 3D Mapping & Hologram",
      "Bách hoa quán & Cảnh quan mây ngàn đỉnh núi"
    ],
    content: [
      "Tuyến cáp Vân Sơn sở hữu chiều dài 1.847m, rút ngắn thời gian di chuyển lên đỉnh Núi Bà Đen chỉ còn khoảng 8 phút.",
      "Giá vé khứ hồi tham khảo 2026: 450.000 VNĐ (Người lớn), 350.000 VNĐ (Trẻ em 1m-1m4). Miễn phí cho trẻ em dưới 1m.",
      "Du khách nên kết hợp mua Vé Combo Cáp treo + Buffet Vân Sơn để tiết kiệm chi phí và thưởng thức hơn 80 món ăn đặc sắc tại đỉnh núi."
    ],
    tips: "💡 Mẹo: Du khách nên đặt vé trước trực tuyến để có mã QR code, quét mã vào thẳng cổng cáp treo mà không cần xếp hàng mua vé giấy.",
    mapQuery: "Đỉnh Núi Bà Đen, Tây Ninh",
    actionText: "Đặt vé cáp treo online",
    actionType: "ticket"
  },
  {
    id: "tuyen-cap-chua-hang",
    category: "cable",
    title: "Tuyến cáp Chùa Hang – Hành hương Quần thể Chùa Bà hơn 300 năm",
    badge: "Tâm linh linh thiêng",
    image: "/guide/phat-tu-dang-huong-chua-ba.webp",
    images: [
      { url: "/guide/phat-tu-dang-huong-chua-ba.webp", caption: "Phật tử dâng hương chiêm bái Chùa Bà" },
      { url: "/guide/chua-ba-chieu-toi.webp", caption: "Linh Sơn Tiên Thạch Tự lung linh chiều tối" },
    ],
    summary: "Tuyến cáp đưa du khách lên khu vực Chùa Bà (Linh Sơn Tiên Thạch Tự), trung tâm hành hương tâm linh lớn bậc nhất miền Nam.",
    highlights: [
      "Chiêm bái Linh Sơn Tiên Thạch Tự (Chùa Bà) hơn 300 năm",
      "Khám phá Hang Cậu, Hang Gió, Chùa Hang linh thiêng",
      "Ngắm toàn cảnh thung lũng núi Bà Đen từ lưng chừng núi"
    ],
    content: [
      "Tuyến cáp Chùa Hang có chiều dài 1.246m, đưa du khách cập bến Ga Chùa Hang trang nghiêm chỉ sau 5 phút.",
      "Giá vé khứ hồi tham khảo: 250.000 VNĐ (Người lớn), 150.000 VNĐ (Trẻ em 1m-1m4).",
      "Du khách có thể lựa chọn Tuyến cáp Tâm An để di chuyển nối tiếp từ Chùa Bà lên thẳng đỉnh núi nếu muốn tham quan cả hai phân khu."
    ],
    tips: "💡 Lưu ý: Khi đến chiêm bái Chùa Bà, du khách lưu ý ăn mặc lịch sự, trang nghiêm, kín đáo.",
    mapQuery: "Linh Sơn Tiên Thạch Tự, Tây Ninh",
    actionText: "Chỉ đường Chùa Bà",
    actionType: "map"
  },
  {
    id: "huong-dan-di-chuyen",
    category: "transport",
    title: "Cách di chuyển từ TP.HCM & các tỉnh đến Tây Ninh tiện lợi nhất",
    badge: "Cẩm nang di chuyển",
    image: "/destinations/trang-ta-not-upload.png",
    summary: "Tổng hợp các phương tiện di chuyển nhanh chóng: Xe khách, Limousine, xe máy và ô tô cá nhân đến Tây Ninh.",
    highlights: [
      "Xe khách/Limousine: Chạy thẳng từ TP.HCM đến chân núi Bà Đen (1.5 - 2 tiếng)",
      "Xe cá nhân (Ô tô/Xe máy): Di chuyển lộ trình QL22 -> Cầu vượt Gò Dầu -> Đ. Bời Lời",
      "Di chuyển tại Tây Ninh: Thuê xe máy dạo phố hoặc VinFast VF3 có điều hòa mát mẻ"
    ],
    content: [
      "Khoảng cách từ trung tâm TP.HCM đến Núi Bà Đen khoảng 95km. Xe khách và limousine đưa đón tận nơi chạy liên tục các chuyến từ 4h00 sáng.",
      "Nếu đi bằng xe máy hoặc ô tô cá nhân, du khách chạy theo Quốc lộ 22 đến ngã ba Trảng Bàng, rẽ về hướng TP. Tây Ninh và theo đường Bời Lời đi thẳng đến khu du lịch Sun World.",
      "Để chủ động tham quan các điểm phụ như Tòa Thánh, Hồ Dầu Tiếng, Tháp Bình Thạnh, du khách có thể đặt thuê xe máy hoặc xe VinFast VF3 ngay trên ứng dụng."
    ],
    tips: "💡 Gợi ý: Nếu đi cùng gia đình hoặc nhóm bạn, thuê xe VinFast VF3 là lựa chọn lý tưởng vừa mát mẻ vừa dễ di chuyển trong nội thành.",
    actionText: "Kiểm tra lịch thuê xe",
    actionType: "rental"
  },
  {
    id: "checkin-dinh-nui",
    category: "attraction",
    title: "Top 5 điểm check-in không thể bỏ lỡ tại Sun World Ba Den Mountain",
    badge: "Check-in & Trải nghiệm",
    image: "/guide/nui-ba-den-toan-canh-that.webp",
    images: [
      { url: "/guide/nui-ba-den-toan-canh-that.webp", caption: "Toàn cảnh Đỉnh Núi Bà Đen từ trên cao" },
      { url: "/guide/nhac-nuoc-di-lac-that.jpg", caption: "Show Nhạc Nước Di Lặc lung linh về đêm" },
      { url: "/guide/phat-tu-dang-huong-chua-ba.webp", caption: "Khu vực chiêm bái Chùa Bà Núi Bà Đen" },
    ],
    summary: "Khám phá các công trình biểu tượng tâm linh và kiến trúc đỉnh cao trên nóc nhà Nam Bộ.",
    highlights: [
      "Tượng Phật Bà Tây Bổ Đà Sơn đúc bằng 170 tấn đồng đỏ",
      "Tượng Bồ Tát Di Lặc sa thạch với nụ cười hoan hỉ trên đại đĩa bối",
      "Màn chiếu phim Phật giáo 3D Mapping tại tâm đỉnh núi",
      "Cột mốc tọa độ 986m & Trảng hoa ngàn sắc nở quanh năm",
      "Lễ dâng đèn hoa đăng lung linh vào tối Thứ 7 hàng tuần"
    ],
    content: [
      "Đỉnh Núi Bà Đen không chỉ là di tích tâm linh linh thiêng mà còn là thiên đường thưởng ngoạn cảnh sắc thiên nhiên.",
      "Tại trung tâm triển lãm Phật giáo dưới chân tượng Phật Bà, du khách được khám phá những bí ẩn vũ trụ và di sản Phật giáo thế giới qua công nghệ Hologram và 3D Mapping hiện đại.",
      "Vào lúc chiều muộn và buổi tối, đỉnh núi khoác lên mình không gian lung linh huyền ảo với hàng ngàn ngọn đèn hoa đăng tỏa sáng."
    ],
    tips: "💡 Thời gian: Nên có mặt trên đỉnh núi trước 17h00 để ngắm trọn vẹn khoảnh khắc hoàng hôn tuyệt đẹp và tham gia lễ dâng đèn hoa đăng.",
    mapQuery: "Núi Bà Đen, Tây Ninh",
    actionText: "Xem trên Google Maps",
    actionType: "map"
  },
  {
    id: "am-thuc-buffet-van-son",
    category: "food",
    title: "Thưởng thức ẩm thực Buffet Vân Sơn & Đặc sản Tây Ninh đỉnh núi",
    badge: "Ẩm thực phong phú",
    image: "/guide/buffet-van-son-dinh-nui.jpg",
    images: [
      { url: "/guide/buffet-van-son-dinh-nui.jpg", caption: "Không gian nhà hàng Buffet Vân Sơn trên đỉnh Núi Bà Đen" },
      { url: "/foods/banh-canh-trang-bang.jpg", caption: "Bánh canh Trảng Bàng đặc sản Tây Ninh" },
      { url: "/foods/bo-to.jpg", caption: "Bò tơ Tây Ninh nướng thơm lừng" },
    ],
    summary: "Trải nghiệm nhà hàng Buffet Vân Sơn với hơn 80 món ăn mặn/chay đặc sắc cùng ẩm thực Tây Ninh truyền thống.",
    highlights: [
      "Hơn 80 món ăn đa dạng từ ẩm thực Á - Âu đến đặc sản 3 miền",
      "Khu ẩm thực Chay phong phú chuẩn phong vị hành hương",
      "Không gian nhà hàng sang trọng kính tràn viễn cảnh ngắm mây núi",
      "Đặc sản mang về: Mãng cầu Bà Đen, Muối ớt Tây Ninh, Bánh tráng phơi sương"
    ],
    content: [
      "Nhà hàng Buffet Vân Sơn trên đỉnh núi là điểm dừng chân ẩm thực lý tưởng sau hành trình chiêm bái.",
      "Thực đơn buffet được thay đổi theo mùa, chuẩn bị công phu từ nguồn nguyên liệu tươi ngon nhất.",
      "Ngoài ra du khách còn có thể thưởng thức các món ăn vặt nổi tiếng như Bánh canh Trảng Bàng, Bò tơ Tây Ninh, Ốc núi và Mãng cầu ngọt thanh tại thị xã Tây Ninh."
    ],
    tips: "💡 Tiết kiệm: Đặt Combo Vé Cáp + Buffet Vân Sơn giúp bạn tiết kiệm đến 15% so với mua lẻ từng dịch vụ.",
    actionText: "Xem chi tiết Tour",
    actionType: "tour"
  },
  {
    id: "meo-san-may-trang-phuc",
    category: "tips",
    title: "Bí kíp săn mây đỉnh núi & Trang phục chuẩn mực khi du lịch Tây Ninh",
    badge: "Kinh nghiệm du khách",
    image: "/guide/nui-ba-den-toan-canh-that.webp",
    images: [
      { url: "/guide/nui-ba-den-toan-canh-that.webp", caption: "Biển mây trắng xóa phủ tràn đỉnh núi" },
      { url: "/guide/nhac-nuoc-di-lac-that.jpg", caption: "Cảnh sắc lung linh đỉnh núi khi chiều tối" },
    ],
    summary: "Thời điểm vàng để bắt trọn hiện tượng biển mây bồng bềnh và hướng dẫn chuẩn bị trang phục phù hợp.",
    highlights: [
      "Săn mây: Từ 06h00 – 08h00 sáng các ngày mùa khô hoặc ngay sau cơn mưa rào",
      "Nhiệt độ đỉnh núi: Luôn thấp hơn chân núi từ 8 – 10°C, không khí mát lạnh quanh năm",
      "Trang phục: Kín đáo trang nghiêm khi đi chùa/chiêm bái; áo khoác mỏng, nón, giày thể thao mềm",
      "Văn hóa: Giữ yên tĩnh tại khu vực chiêm bái, giữ gìn vệ sinh môi trường cảnh quan"
    ],
    content: [
      "Núi Bà Đen nổi tiếng với các hiện tượng mây hiếm gặp như mây đĩa bay (mây nón), mây phượng hoàng và biển mây trắng xóa phủ tràn đỉnh núi.",
      "Để săn mây thành công, bạn nên đi chuyến cáp treo sớm nhất lúc 5h30 - 6h00 sáng.",
      "Nên chuẩn bị sẵn giày thể thao ôm chân để thoải mái di chuyển qua các bậc thang chiêm bái và mang theo áo khoác nhẹ vì đỉnh núi gió nhiều và se lạnh về chiều tối."
    ],
    tips: "💡 Lưu ý quan trọng: Chuẩn bị sạc dự phòng vì cảnh đẹp đỉnh núi sẽ khiến bạn chụp ảnh liên tục đấy!"
  },
  {
    id: "lich-trinh-goi-y-1-2-ngay",
    category: "itinerary",
    title: "Lịch trình gợi ý: Khám phá trọn vẹn Tây Ninh 1 ngày & 2 ngày 1 đêm",
    badge: "Lịch trình tối ưu",
    image: "/tour.webp",
    summary: "Thiết kế hành trình phù hợp cho cả đi trong ngày và nghỉ đêm khám phá Tây Ninh.",
    highlights: [
      "Lịch trình 1 ngày: Chinh phục Đỉnh Núi Bà Đen -> Viếng Chùa Bà -> Tòa Thánh Tây Ninh -> Thưởng thức Bánh canh Trảng Bàng",
      "Lịch trình 2 ngày 1 đêm: Ngày 1 (Nội thành, Tòa Thánh, Chùa Gò Kén, chợ đêm) - Ngày 2 (Núi Bà Đen, Hồ Dầu Tiếng, Tháp Bình Thạnh)",
      "Kết hợp ngắm hoàng hôn Hồ Dầu Tiếng & săn mây đỉnh núi Bà Đen"
    ],
    content: [
      "Dù bạn chỉ có 1 ngày rảnh rỗi hay dành trọn vẹn cuối tuần 2 ngày 1 đêm, Tây Ninh luôn mang đến những trải nghiệm phong phú.",
      "Lịch trình gợi ý trên ứng dụng giúp bạn sắp xếp thời gian di chuyển hợp lý giữa các điểm, không bị gấp gáp.",
      "Bạn cũng có thể xem chi tiết tab Tour để tham khảo các mốc thời gian cụ thể."
    ],
    tips: "💡 Đăng ký tư vấn: Bạn có thể nhấn nút Nhờ tư vấn Zalo để được gợi ý lịch trình riêng theo nhu cầu gia đình.",
    actionText: "Xem chi tiết Tour",
    actionType: "tour"
  },
  {
    id: "le-hoi-van-hoa-nui-ba-den",
    category: "attraction",
    title: "Lễ hội & Văn hóa truyền thống đặc sắc tại Núi Bà Đen",
    badge: "Lễ hội tâm linh",
    image: "/events/via-ba-linh-son.jpg",
    images: [
      { url: "/guide/phat-tu-dang-huong-chua-ba.webp", caption: "Không khí dâng hương trang nghiêm dịp lễ hội" },
      { url: "/guide/chua-ba-chieu-toi.webp", caption: "Điện Quan Âm Chùa Bà lung linh ánh đèn" },
    ],
    summary: "Khám phá không gian lễ hội tâm linh lớn bậc nhất miền Nam: Hội xuân Núi Bà, Lễ vía Bà Linh Sơn Thánh Mẫu, Lễ vía Di Lặc và Lễ dâng đèn.",
    highlights: [
      "Hội Xuân Núi Bà Đen (Mùng 4 - hết tháng Giêng): Mở đầu năm mới với hàng triệu lượt khách hành hương cầu an, chương trình nghệ thuật dân gian & bắn pháo hoa",
      "Lễ Vía Bà Linh Sơn Thánh Mẫu (Mùng 4-6 tháng 5 Âm lịch): Di sản văn hóa phi vật thể quốc gia với các nghi thức Trình thập cúng, Lễ tắm Bà, múa lân sư rồng",
      "Lễ Vía Đức Phật Di Lặc (Mùng 1 tháng Giêng): Cầu bình an, hỷ lạc đầu năm tại đại tượng Di Lặc sa thạch",
      "Nghi thức Dâng đèn hoa đăng Thứ 7 hàng tuần: Thắp sáng hàng ngàn ngọn hoa đăng lung linh cầu nguyện quốc thái dân an"
    ],
    content: [
      "Núi Bà Đen được mệnh danh là trung tâm hành hương tâm linh bậc nhất Nam Bộ, gắn liền với huyền thoại Linh Sơn Thánh Mẫu.",
      "Hàng năm, Khu du lịch Sun World diễn ra nhiều lễ hội quy mô lớn kết hợp nghi thức tôn giáo trang nghiêm cùng các hoạt động văn hóa nghệ thuật hiện đại.",
      "Du khách đến Núi Bà vào các dịp lễ hội không chỉ để cầu nguyện bình an, tài lộc mà còn được hòa mình vào không gian di sản văn hóa đặc sắc của vùng đất Thánh."
    ],
    tips: "💡 Khuyên dùng: Nếu tham gia các ngày chính lễ, du khách nên đi cáp treo từ sớm (5h30 sáng) để có trải nghiệm thoải mái nhất.",
    actionText: "Xem Lịch Lễ hội",
    actionType: "map"
  },
  {
    id: "huong-dan-1-ngay-nui-ba-den",
    category: "itinerary",
    title: "Hướng dẫn trọn gói: Lịch trình 1 ngày (Chùa Bà trước -> Đỉnh Núi Bà Đen sau)",
    badge: "Lịch trình truyền thống",
    image: "/guide/nui-ba-den-toan-canh-that.webp",
    images: [
      { url: "/guide/phat-tu-dang-huong-chua-ba.webp", caption: "Sáng: Dâng hương chiêm bái Chùa Bà" },
      { url: "/guide/nui-ba-den-toan-canh-that.webp", caption: "Trưa: Nối cáp Tâm An lên Đỉnh Núi 986m" },
      { url: "/guide/nhac-nuoc-di-lac-that.jpg", caption: "Chiều tối: Thưởng thức Show Nhạc Nước Di Lặc" },
    ],
    summary: "Lịch trình chuẩn hành hương & trải nghiệm: Sáng viếng Chùa Bà 300 năm linh thiêng -> Trưa & chiều lên Đỉnh 986m chiêm bái Tượng Phật Bà, Tượng Di Lặc & ăn Buffet Vân Sơn.",
    highlights: [
      "07:30 - 08:10: Đến chân núi & Đi cáp Chùa Hang lên Quần thể Chùa Bà (5 phút)",
      "08:10 - 10:30: Viếng Linh Sơn Tiên Thạch Tự (Chùa Bà hơn 300 năm), dâng hương cầu an, viếng Hang Cậu & Chùa Hang",
      "10:30 - 10:45: Đi tuyến cáp Tâm An từ Chùa Bà nối thẳng lên Đỉnh Núi Bà Đen 986m",
      "10:45 - 11:45: Chiêm bái Tượng Phật Bà Tây Bổ Đà Sơn (72m) & Xem triển lãm Phật giáo 3D Mapping",
      "11:45 - 13:15: Thưởng thức Buffet Vân Sơn đỉnh núi (>80 món mặn/chay phong phú)",
      "13:15 - 15:30: Chiêm bái Đại tượng Phật Di Lặc sa thạch (36m), check-in mốc 986m, dạo Vườn Bách Hoa",
      "15:30 - 17:00: Ngắm mây núi / hoàng hôn, đi cáp Vân Sơn từ đỉnh thẳng xuống chân núi (8 phút). (Tối Thứ 7 ở lại dâng đèn hoa đăng)"
    ],
    content: [
      "Lịch trình đi Chùa Bà trước - Đỉnh núi sau là lựa chọn hành hương truyền thống được đông đảo du khách yêu thích. Buổi sáng sớm không khí Chùa Bà rất tĩnh mịch, mát mẻ và trang nghiêm để dâng hương cầu bình an.",
      "Điểm đặc biệt là du khách sử dụng Tuyến cáp Tâm An nối thẳng từ Chùa Bà lên Đỉnh Núi mà không cần phải đi xuống lại chân núi rồi mới đi lên.",
      "Du khách nên mua Gói Combo Cáp treo + Buffet Vân Sơn để vừa tối ưu chi phí vừa quét mã QR đi thẳng cổng nhanh chóng."
    ],
    tips: "💡 Mẹo di chuyển: Đi cáp Chùa Hang (Lên Chùa) -> Cáp Tâm An (Nối lên Đỉnh) -> Cáp Vân Sơn (Trực tiếp xuống chân núi) là tuyến di chuyển 1 chiều cực kỳ mượt mà!",
    mapQuery: "Núi Bà Đen, Tây Ninh",
    actionText: "Đặt vé cáp treo QR",
    actionType: "ticket"
  },
  {
    id: "show-nhac-nuoc-dang-den-tay-bo-da-son",
    category: "attraction",
    title: "Show Nhạc Nước Di Lặc, Lễ Dâng Đăng & Tượng Phật Bà Tây Bổ Đà Sơn",
    badge: "Show diễn & Tâm linh đỉnh cao",
    image: "/guide/nhac-nuoc-di-lac-that.jpg",
    images: [
      { url: "/guide/nhac-nuoc-di-lac-that.jpg", caption: "Show Nhạc Nước bên Tượng Bồ Tát Di Lặc sa thạch 36m" },
      { url: "/guide/nui-ba-den-toan-canh-that.webp", caption: "Toàn cảnh Đỉnh Núi Bà Đen & Tượng Phật Bà 72m" },
      { url: "/guide/phat-tu-dang-huong-chua-ba.webp", caption: "Không khí dâng hương trang nghiêm Núi Bà" },
    ],
    summary: "Chiêm bái Tượng Phật Bà Tây Bổ Đà Sơn (72m), thưởng thức Show Nhạc Nước Di Lặc từ 17h00 và Lễ Dâng Đèn lung linh tối Thứ 7.",
    highlights: [
      "Tượng Phật Bà Tây Bổ Đà Sơn (72m): Đúc bằng 170 tấn đồng đỏ, Kỷ lục Tượng Phật bằng đồng cao nhất Châu Á trên đỉnh núi",
      "Show Nhạc Nước Tượng Di Lặc (Từ 17h00 hàng ngày): Trình diễn ánh sáng laser, âm thanh & công nghệ vòi phun 3D hiện đại quanh tượng Di Lặc sa thạch (36m) và thác nước 35m",
      "Nghi thức Dâng Đèn Hoa Đăng (Tối Thứ 7 hàng tuần): Diễn ra tại quảng trường dưới chân Tượng Phật Bà, du khách tự tay viết lời nguyện ước & thả đèn lung linh",
      "Khung giờ show nhạc nước: Mỗi suất diễn kéo dài 5 phút, giãn cách 15 phút giữa các suất"
    ],
    content: [
      "Đỉnh Núi Bà Đen hội tụ những kiệt tác tâm linh kỳ vĩ cùng các show trình diễn nghệ thuật đẳng cấp thế giới.",
      "Tượng Phật Bà Tây Bổ Đà Sơn đứng uy nghiêm giữa biển mây ngàn là biểu tượng tâm linh cầu bình an và may mắn.",
      "Vào cuối chiều từ 17h00, du khách được thưởng thức Show Nhạc Nước bên tượng Phật Di Lặc với sự kết hợp ảo diệu giữa ánh sáng laser, nước và âm nhạc.",
      "Đặc biệt vào mỗi tối Thứ 7, hàng ngàn ngọn hoa đăng tỏa sáng dưới chân đại tượng Phật Bà tạo nên không gian chữa lành thiêng liêng."
    ],
    tips: "💡 Gợi ý trải nghiệm cuối tuần: Nên chọn chuyến đi chiều (15h30 lên đỉnh), chiêm bái Tượng Phật Bà -> xem Show Nhạc Nước 17h00 -> tham gia Lễ Dâng Đăng tối Thứ 7!",
    mapQuery: "Đỉnh Núi Bà Đen, Tây Ninh",
    actionText: "Xem trên Google Maps",
    actionType: "map"
  }
];

const guideFaqs: GuideFaq[] = [
  {
    id: "faq-ve-tre-em",
    category: "cable",
    question: "Vé cáp treo dành cho trẻ em tính theo độ cao hay tuổi?",
    answer: "Vé cáp treo Sun World Ba Den Mountain được tính theo độ cao: Trẻ em dưới 1m00 được miễn phí hoàn toàn. Trẻ em từ 1m00 đến 1m40 áp dụng giá vé trẻ em. Trẻ em trên 1m40 tính giá vé người lớn."
  },
  {
    id: "faq-ve-online",
    category: "cable",
    question: "Mua vé cáp treo online có lợi ích gì và sử dụng thế nào?",
    answer: "Khi đặt vé online, bạn sẽ nhận được mã QR code trên điện thoại. Khi đến khu du lịch, bạn đi thẳng đến cổng soát vé cáp treo và quét mã QR để vào, không cần xếp hàng chờ đợi mua vé giấy tại quầy."
  },
  {
    id: "faq-gio-mo-cua",
    category: "cable",
    question: "Cáp treo Sun World Núi Bà Đen hoạt động đến mấy giờ?",
    answer: "Vào ngày thường (Thứ 2 - Thứ 6), cáp treo hoạt động từ 06h00 đến 20h00. Vào cuối tuần (Thứ 7 & Chủ Nhật) và các ngày Lễ/Tết, tuyến cáp hoạt động từ 05h30 đến 21h00."
  },
  {
    id: "faq-do-an-len-nui",
    category: "tips",
    question: "Có được phép mang đồ ăn, nước uống lên đỉnh núi không?",
    answer: "Du khách được mang theo nước uống cá nhân và đồ ăn nhẹ. Tuy nhiên hãy giữ gìn vệ sinh chung, bỏ rác đúng nơi quy định. Trên đỉnh núi có sẵn nhà hàng Buffet Vân Sơn và các kiosk ẩm thực phục vụ du khách."
  },
  {
    id: "faq-trang-phuc-dieu-kien",
    category: "tips",
    question: "Nên mặc trang phục gì khi tham quan chiêm bái Núi Bà Đen?",
    answer: "Khi vào khu vực Chùa Bà và chiêm bái các công trình Phật giáo, du khách nên mặc trang phục lịch sự, kín đáo (áo có tay, quần/váy qua đầu gối). Nên đi giày thể thao mềm và mang theo áo khoác nhẹ vì đỉnh núi lộng gió và mát lạnh."
  },
  {
    id: "faq-dang-den-hoa-dang",
    category: "attraction",
    question: "Lễ dâng đèn hoa đăng trên đỉnh núi diễn ra khi nào?",
    answer: "Lễ dâng đèn hoa đăng thiêng liêng diễn ra định kỳ vào buổi tối Thứ 7 hàng tuần và các ngày lễ lớn trong năm trên đỉnh Núi Bà Đen. Du khách có thể tự tay viết lời nguyện ước và thả hoa đăng tại quảng trường đỉnh núi."
  }
];

function GuidePage({
  onMap,
  onTicket,
  onZalo,
  onTour,
  onRental,
}: {
  onMap: (q: string) => void;
  onTicket: () => void;
  onZalo: () => void;
  onTour: () => void;
  onRental: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openArticleId, setOpenArticleId] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-ve-online");

  const filteredArticles = useMemo(() => {
    return guideArticles.filter((article) => {
      const matchCat = selectedCategory === "all" || article.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      const text = `${article.title} ${article.summary} ${article.badge} ${article.highlights.join(" ")}`.toLowerCase();
      return matchCat && text.includes(q);
    });
  }, [selectedCategory, searchQuery]);

  const filteredFaqs = useMemo(() => {
    return guideFaqs.filter((faq) => {
      const matchCat = selectedCategory === "all" || faq.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      const text = `${faq.question} ${faq.answer}`.toLowerCase();
      return matchCat && text.includes(q);
    });
  }, [selectedCategory, searchQuery]);

  const handleAction = (article: GuideArticle) => {
    if (article.actionType === "ticket") onTicket();
    else if (article.actionType === "rental") onRental();
    else if (article.actionType === "tour") onTour();
    else if (article.actionType === "zalo") onZalo();
    else if (article.mapQuery) onMap(article.mapQuery);
    else onMap("Núi Bà Đen, Tây Ninh");
  };

  return (
    <section className="page-section guide-page">
      <span className="page-kicker">CẨM NANG TRA CỨU DU KHÁCH</span>
      <h1>Cẩm nang du lịch Tây Ninh</h1>

      <div className="guide-hero-card">
        <img src="/cable-car.jpg" alt="Cẩm nang du lịch Sun World Ba Den Mountain" />
        <div className="guide-hero-overlay" />
        <div className="guide-hero-content">
          <span className="eyebrow"><Sparkles size={14} /> Sun World Ba Den Mountain</span>
          <h2>Trọn bộ bí kíp khám phá Nóc nhà Nam Bộ</h2>
          <p>Tra cứu giá vé cáp treo, thời điểm săn mây, địa điểm chiêm bái & mẹo du lịch Tây Ninh từ A-Z</p>
          <div className="guide-hero-buttons">
            <button className="primary-btn" onClick={onTicket}>
              <Ticket size={16} /> Mua vé cáp treo QR
            </button>
            <button className="secondary-btn" onClick={onZalo}>
              <MessageCircle size={16} /> Hỏi hỗ trợ Zalo
            </button>
          </div>
        </div>
      </div>

      <div className="guide-price-widget">
        <div className="price-widget-head">
          <CableCar size={20} />
          <div>
            <b>Bảng giá vé cáp treo Sun World 2026 (Tham khảo)</b>
            <small>Đặt vé online quét mã QR đi thẳng cổng</small>
          </div>
        </div>
        <div className="price-grid">
          <div className="price-card">
            <span className="price-badge">Tuyến Vân Sơn (Đỉnh)</span>
            <div className="price-row">
              <span>Người lớn:</span> <b>450.000đ</b>
            </div>
            <div className="price-row">
              <span>Trẻ em (1m-1m4):</span> <b>350.000đ</b>
            </div>
            <small>Rút ngắn 8 phút lên Đỉnh 986m</small>
          </div>
          <div className="price-card">
            <span className="price-badge alt">Tuyến Chùa Hang (Chùa Bà)</span>
            <div className="price-row">
              <span>Người lớn:</span> <b>250.000đ</b>
            </div>
            <div className="price-row">
              <span>Trẻ em (1m-1m4):</span> <b>150.000đ</b>
            </div>
            <small>5 phút đến Linh Sơn Tiên Thạch Tự</small>
          </div>
        </div>
        <p className="price-note">✨ Trẻ em dưới 1m00 được miễn phí hoàn toàn. Khuyên dùng gói Combo Cáp treo + Buffet Vân Sơn để tiết kiệm chi phí nhất.</p>
      </div>

      <div className="guide-search-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tra cứu từ khóa: cáp treo, vé combo, buffet, trang phục, săn mây..."
          className="guide-search-input"
        />
        {searchQuery && (
          <button className="clear-btn" onClick={() => setSearchQuery("")} aria-label="Xóa từ khóa">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-row">
        {guideCategories.map((cat) => (
          <button
            key={cat.id}
            className={selectedCategory === cat.id ? "active" : ""}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="guide-articles-list">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => {
            const isOpen = openArticleId === article.id;
            return (
              <article key={article.id} className={`guide-card ${isOpen ? "expanded" : ""}`}>
                <div className="guide-card-header" onClick={() => setOpenArticleId(isOpen ? null : article.id)}>
                  <img src={article.image} alt={article.title} />
                  <div className="guide-card-main">
                    <span className="guide-card-badge">{article.badge}</span>
                    <h3>{article.title}</h3>
                    <p className="guide-card-summary">{article.summary}</p>
                  </div>
                  <button className="toggle-btn" aria-label="Đóng/Mở chi tiết bài viết">
                    <ChevronDown size={20} className={isOpen ? "rotate-180" : ""} />
                  </button>
                </div>

                {isOpen && (
                  <div className="guide-card-body">
                    <h4>Điểm nổi bật:</h4>
                    <ul className="highlights-list">
                      {article.highlights.map((h, i) => (
                        <li key={i}>
                          <CheckCircle2 size={15} /> <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="guide-paragraphs">
                      {article.content.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>

                    {article.images && article.images.length > 0 && (
                      <div className="guide-gallery">
                        <h4>Hình ảnh thực tế công trình & di tích:</h4>
                        <div className="guide-gallery-grid">
                          {article.images.map((imgItem, i) => (
                            <div key={i} className="guide-gallery-item">
                              <img src={imgItem.url} alt={imgItem.caption} loading="lazy" />
                              <div className="guide-gallery-caption">{imgItem.caption}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {article.tips && <div className="guide-tip-box">{article.tips}</div>}

                    <div className="guide-card-footer">
                      <button className="action-btn" onClick={() => handleAction(article)}>
                        <Navigation size={15} /> {article.actionText || "Xem trên bản đồ"}
                      </button>
                      <button className="share-btn" onClick={onZalo}>
                        <MessageCircle size={15} /> Tư vấn qua Zalo
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <div className="empty-state">
            <span><NotebookTabs size={28} /></span>
            <h2>Không tìm thấy thông tin</h2>
            <p>Thử tìm kiếm với từ khóa khác như "cáp treo", "buffet", "vé" hoặc "săn mây".</p>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>Xem tất cả cẩm nang</button>
          </div>
        )}
      </div>

      <div className="guide-faq-section">
        <div className="section-title">
          <div>
            <span>GIẢI ĐÁP THẮC MẮC</span>
            <h2>Câu hỏi thường gặp (FAQ)</h2>
          </div>
        </div>

        <div className="faq-list">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className={`faq-item ${isOpen ? "open" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                >
                  <CircleHelp size={18} />
                  <span>{faq.question}</span>
                  <ChevronDown size={18} className={isOpen ? "rotate-180" : ""} />
                </button>
                {isOpen && <div className="faq-answer">{faq.answer}</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="guide-footer-support">
        <Sparkles size={24} />
        <div>
          <b>Bạn muốn lên lịch trình riêng cho gia đình?</b>
          <small>Liên hệ hotline/Zalo 0584 556 556 để được hỗ trợ từ A-Z</small>
        </div>
        <button onClick={onZalo}>Nhắn Zalo ngay</button>
      </div>
    </section>
  );
}
