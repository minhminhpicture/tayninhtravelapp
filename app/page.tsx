"use client";

import {
  Bell,
  Bike,
  BusFront,
  CalendarDays,
  CableCar,
  CarFront,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Compass,
  Copy,
  Download,
  Heart,
  Home,
  Languages,
  Map,
  MapPin,
  MessageCircle,
  Mountain,
  Navigation,
  NotebookTabs,
  Phone,
  Plus,
  ReceiptText,
  Route,
  Search,
  Send,
  Share2,
  Sparkles,
  Star,
  Ticket,
  Utensils,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Tab = "home" | "explore" | "food" | "rental" | "plan" | "saved";
type InstallPrompt = Event & { prompt: () => Promise<void> };
type VehicleType = "motorbike" | "vf3";
type RentalDraft = {
  id: string;
  vehicle: VehicleType;
  startDate: string;
  endDate: string;
  quantity: number;
};

const destinations = [
  { id: "nui-ba-den", name: "Núi Bà Đen", type: "Tâm linh · Thiên nhiên", image: "/destinations/nui-ba-den.jpg", time: "Cả ngày", rating: "4.9" },
  { id: "toa-thanh", name: "Tòa Thánh Tây Ninh", type: "Văn hóa · Kiến trúc", image: "/destinations/toa-thanh.webp", time: "2 giờ", rating: "4.8" },
  { id: "chua-go-ken", name: "Chùa Gò Kén", type: "Tâm linh · Check-in", image: "/destinations/chua-go-ken.jpg", time: "1.5 giờ", rating: "4.7" },
  { id: "lo-go", name: "Lò Gò – Xa Mát", type: "Sinh thái · Khám phá", image: "/destinations/lo-go-xa-mat.jpg", time: "Nửa ngày", rating: "4.8" },
  { id: "ho-dau-tieng", name: "Hồ Dầu Tiếng", type: "Cắm trại · Hoàng hôn", image: "/destinations/ho-dau-tieng.jpg", time: "3 giờ", rating: "4.8" },
  { id: "am-thuc", name: "Ẩm thực Tây Ninh", type: "Đặc sản · Trải nghiệm", image: "/destinations/am-thuc.jpg", time: "2 giờ", rating: "4.9" },
];

const services = [
  { id: "tour", title: "Tour Tây Ninh", note: "1 ngày · 2 ngày 1 đêm", image: "/tour.webp", icon: BusFront, color: "mint" },
  { id: "ticket", title: "Vé cáp treo", note: "Đặt online · Nhận vé nhanh", image: "/cable-car.jpg", icon: CableCar, color: "amber" },
  { id: "rental", title: "Thuê xe", note: "Kiểm tra lịch xe máy · VinFast VF3", image: "/vehicle.png", icon: CarFront, color: "blue" },
];

const quickActions = [
  { label: "Vé cáp treo", icon: Ticket, action: "service" },
  { label: "Tour", icon: Route, action: "service" },
  { label: "Thuê xe", icon: Bike, action: "service" },
  { label: "Bản đồ", icon: Map, action: "map" },
  { label: "Ẩm thực", icon: Utensils, action: "food" },
  { label: "Hỗ trợ", icon: CircleHelp, action: "support" },
];

const foodCategories = [
  { id: "all", label: "Tất cả" },
  { id: "savory", label: "Món mặn" },
  { id: "ricepaper", label: "Bánh tráng" },
  { id: "gift", label: "Đặc sản quà" },
  { id: "vegetarian", label: "Món chay" },
  { id: "sweet", label: "Món ngọt" },
];

const foods = [
  { name: "Bánh canh Trảng Bàng", category: "savory", note: "Sợi bánh canh mềm dai, nước dùng xương ngọt thanh, thường dùng kèm thịt heo và rau." },
  { name: "Bò tơ Tây Ninh", category: "savory", note: "Thịt mềm, ngọt vừa; phổ biến với các món nướng, lẩu, nhúng giấm." },
  { name: "Ốc núi Bà Đen", category: "savory", note: "Ốc sống trong hang đá, có vị thảo mộc; thường hấp, luộc hoặc xào." },
  { name: "Mắm chua thịt luộc", category: "savory", note: "Vị chua, cay, mặn, ngọt; ăn cùng thịt luộc, bánh tráng và rau sống." },
  { name: "Bánh xèo rau rừng", category: "savory", note: "Bánh xèo giòn cuốn cùng nhiều loại rau rừng đặc trưng Tây Ninh." },
  { name: "Bánh tráng phơi sương", category: "ricepaper", note: "Bánh dẻo dai, có thể dùng trực tiếp; đặc sản nổi tiếng của Trảng Bàng." },
  { name: "Bánh tráng cuốn", category: "ricepaper", note: "Nhiều vị mặn, ngọt, cay, chua; thường cuốn cùng tép hành, bơ hoặc muối." },
  { name: "Bánh tráng nướng", category: "ricepaper", note: "Món ăn vặt giòn thơm, dễ mua khi khám phá Tây Ninh." },
  { name: "Muối Tây Ninh", category: "gift", note: "Có cả loại chay và mặn; phù hợp dùng tại chỗ hoặc mua về làm quà." },
  { name: "Mãng cầu Núi Bà", category: "gift", note: "Trái cây nổi bật của vùng chân núi Bà Đen, thơm và vị ngọt thanh." },
  { name: "Nem bưởi", category: "vegetarian", note: "Món chay đặc trưng, có vị chua ngọt và kết cấu dai nhẹ." },
  { name: "Bánh canh chay", category: "vegetarian", note: "Lựa chọn thanh nhẹ, phù hợp hành trình tham quan vùng đất Thánh." },
  { name: "Kẹo thèo lèo", category: "sweet", note: "Món ngọt giòn thơm từ đậu phộng và mạch nha, tiện mua làm quà." },
  { name: "Mứt chùm ruột", category: "sweet", note: "Vị chua ngọt, màu đỏ bắt mắt, là món quà vặt quen thuộc." },
];

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("home");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string[]>(["nui-ba-den", "toa-thanh"]);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [installHint, setInstallHint] = useState(false);
  const [toast, setToast] = useState("");
  const [foodCategory, setFoodCategory] = useState("all");
  const [vehicle, setVehicle] = useState<VehicleType>("motorbike");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pickupPlace, setPickupPlace] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [rentalNote, setRentalNote] = useState("");
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [rentalDrafts, setRentalDrafts] = useState<RentalDraft[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tn-favorites");
    if (saved) setFavorites(JSON.parse(saved));
    const drafts = localStorage.getItem("tn-rental-drafts");
    if (drafts) setRentalDrafts(JSON.parse(drafts));
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");
    const onInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", onInstall);
    return () => window.removeEventListener("beforeinstallprompt", onInstall);
  }, []);

  useEffect(() => {
    localStorage.setItem("tn-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("tn-rental-drafts", JSON.stringify(rentalDrafts));
  }, [rentalDrafts]);

  const results = useMemo(() => destinations.filter((item) =>
    `${item.name} ${item.type}`.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  const filteredFoods = useMemo(
    () => foodCategory === "all" ? foods : foods.filter((item) => item.category === foodCategory),
    [foodCategory],
  );

  const dateRangeValid = Boolean(startDate && endDate && startDate <= endDate);
  const hasLocalConflict = dateRangeValid && rentalDrafts.some((draft) =>
    draft.vehicle === vehicle && startDate <= draft.endDate && endDate >= draft.startDate
  );

  const vehicleLabel = vehicle === "motorbike" ? "Xe máy" : "VinFast VF3";
  const quoteText = [
    "YÊU CẦU KIỂM TRA & BÁO GIÁ THUÊ XE TÂY NINH",
    `Loại xe: ${vehicleLabel}`,
    `Ngày nhận: ${startDate || "Chưa chọn"}`,
    `Ngày trả: ${endDate || "Chưa chọn"}`,
    `Số lượng: ${quantity}`,
    `Nơi nhận xe: ${pickupPlace || "Sẽ trao đổi"}`,
    `Khách hàng: ${customerName || "Chưa cung cấp"}`,
    `Số điện thoại: ${customerPhone || "Chưa cung cấp"}`,
    `Ghi chú: ${rentalNote || "Không có"}`,
    "Vui lòng kiểm tra xe còn trống và gửi báo giá giúp tôi.",
  ].join("\n");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  const install = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      setInstallPrompt(null);
      notify("Đã gửi yêu cầu cài ứng dụng");
    } else {
      setInstallHint(true);
    }
  };

  const openMap = (name = "Tây Ninh") => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`, "_blank");
  const openZalo = () => window.open("https://zalo.me/0584556556", "_blank");
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
            <span className="brand-mark"><Mountain size={21} /></span>
            <span><small>KHÁM PHÁ</small>TÂY NINH</span>
          </button>
          <div className="top-actions">
            <button aria-label="Đổi ngôn ngữ" onClick={() => notify("Ứng dụng đang hiển thị Tiếng Việt")}><Languages size={20} /></button>
            <button aria-label="Thông báo" onClick={() => notify("Bạn chưa có thông báo mới")}><Bell size={20} /><i /></button>
          </div>
        </header>

        <div className="screen-content">
          {tab === "home" && (
            <>
              <section className="hero-card">
                <img src="/hero.png" alt="Khám phá du lịch Tây Ninh" />
                <div className="hero-shade" />
                <div className="hero-copy">
                  <span className="eyebrow"><Sparkles size={14} /> Hành trình của riêng bạn</span>
                  <h1>Chạm Tây Ninh,<br />trọn từng khoảnh khắc.</h1>
                  <p>Tour địa phương · Vé cáp treo · Thuê xe tiện lợi</p>
                  <button onClick={() => setTab("explore")}>Khám phá ngay <ChevronRight size={17} /></button>
                </div>
              </section>

              <section className="section quick-section">
                <div className="section-title"><h2>Tiện ích nhanh</h2><button onClick={() => setTab("explore")}>Xem tất cả</button></div>
                <div className="quick-grid">
                  {quickActions.map(({ label, icon: Icon, action }) => (
                    <button key={label} onClick={() => {
                      if (action === "map") openMap();
                      else if (action === "support") openZalo();
                      else if (action === "food") setTab("food");
                      else if (label === "Thuê xe") setTab("rental");
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
                    <DestinationCard key={item.id} item={item} favorite={favorites.includes(item.id)} onFavorite={() => toggleFavorite(item.id)} onMap={() => openMap(`${item.name}, Tây Ninh`)} />
                  ))}
                </div>
              </section>

              <section className="section">
                <div className="section-title"><div><span>DỄ DÀNG ĐẶT TRƯỚC</span><h2>Dịch vụ du lịch</h2></div></div>
                <div className="service-list">
                  {services.map(({ id, title, note, image, icon: Icon, color }) => (
                    <button className="service-card" key={title} onClick={() => id === "rental" ? setTab("rental") : openZalo()}>
                      <img src={image} alt="" />
                      <span className={`service-icon ${color}`}><Icon size={21} /></span>
                      <span className="service-copy"><b>{title}</b><small>{note}</small></span>
                      <ChevronRight size={20} />
                    </button>
                  ))}
                </div>
              </section>

              <section className="install-card">
                <div><Download size={24} /></div>
                <span><b>Cài ứng dụng Khám Phá Tây Ninh</b><small>Mở nhanh, toàn màn hình, dùng tiện lợi như app.</small></span>
                <button onClick={install}>Cài ngay</button>
              </section>
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
                  <DestinationCard key={item.id} item={item} favorite={favorites.includes(item.id)} onFavorite={() => toggleFavorite(item.id)} onMap={() => openMap(`${item.name}, Tây Ninh`)} />
                ))}
              </div>
              <h2 className="subheading">Dịch vụ nổi bật</h2>
              <div className="service-list">
                {services.map(({ id, title, note, image, icon: Icon, color }) => (
                  <button className="service-card" key={title} onClick={() => id === "rental" ? setTab("rental") : openZalo()}>
                    <img src={image} alt="" /><span className={`service-icon ${color}`}><Icon size={21} /></span>
                    <span className="service-copy"><b>{title}</b><small>{note}</small></span><ChevronRight size={20} />
                  </button>
                ))}
              </div>
            </section>
          )}

          {tab === "food" && (
            <section className="page-section food-page">
              <span className="page-kicker">HƯƠNG VỊ ĐẤT THÁNH</span>
              <h1>Ẩm thực Tây Ninh</h1>
              <div className="food-hero">
                <img src="/destinations/am-thuc.jpg" alt="Đặc sản ẩm thực Tây Ninh" />
                <div>
                  <span><Utensils size={16} /> Cẩm nang món ngon</span>
                  <h2>Ăn gì khi đến Tây Ninh?</h2>
                  <p>Từ bánh canh Trảng Bàng, bò tơ đến bánh tráng phơi sương và các món quà địa phương.</p>
                </div>
              </div>
              <div className="food-filters" aria-label="Lọc món ăn">
                {foodCategories.map((category) => (
                  <button key={category.id} className={foodCategory === category.id ? "active" : ""} onClick={() => setFoodCategory(category.id)}>
                    {category.label}
                  </button>
                ))}
              </div>
              <div className="food-list">
                {filteredFoods.map((item, index) => (
                  <article className="food-card" key={item.name}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><h3>{item.name}</h3><p>{item.note}</p></div>
                    <button onClick={() => openMap(`${item.name}, Tây Ninh`)} aria-label={`Tìm ${item.name} trên bản đồ`}><MapPin size={18} /></button>
                  </article>
                ))}
              </div>
              <a className="source-note" href="https://sunworld.vn/vi/ba-den/an-choi/an-gi-o-tay-ninh" target="_blank" rel="noreferrer">
                Nội dung được tóm lược từ cẩm nang Sun World Bà Đen <ChevronRight size={16} />
              </a>
            </section>
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
                <label className="text-field"><span>Nơi nhận xe</span><input value={pickupPlace} onChange={(event) => setPickupPlace(event.target.value)} placeholder="Khách sạn, bến xe hoặc địa chỉ..." /></label>
              </div>

              <div className={`availability-card ${!dateRangeValid ? "waiting" : hasLocalConflict ? "busy" : "available"}`}>
                {!dateRangeValid ? <CalendarDays size={22} /> : hasLocalConflict ? <CircleHelp size={22} /> : <ClipboardCheck size={22} />}
                <span>
                  <b>{!dateRangeValid ? "Chọn ngày để kiểm tra" : hasLocalConflict ? "Có lịch tạm trùng thời gian" : "Chưa ghi nhận lịch trùng trên thiết bị"}</b>
                  <small>Tình trạng xe thực tế sẽ được nhân viên xác nhận qua Zalo.</small>
                </span>
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
                    <div><dt>Nhận xe</dt><dd>{pickupPlace || "Trao đổi sau"}</dd></div>
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
                    <DestinationCard key={item.id} item={item} favorite onFavorite={() => toggleFavorite(item.id)} onMap={() => openMap(`${item.name}, Tây Ninh`)} />
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
        </div>

        <nav className="bottom-nav" aria-label="Điều hướng chính">
          <NavButton active={tab === "home"} icon={Home} label="Trang chủ" onClick={() => setTab("home")} />
          <NavButton active={tab === "explore"} icon={Compass} label="Khám phá" onClick={() => setTab("explore")} />
          <button className="nav-main" onClick={() => setSearchOpen(true)} aria-label="Tìm kiếm"><Search size={24} /></button>
          <NavButton active={tab === "plan"} icon={Route} label="Lịch trình" onClick={() => setTab("plan")} />
          <NavButton active={tab === "saved"} icon={Heart} label="Đã lưu" onClick={() => setTab("saved")} />
        </nav>

        <div className="contact-fab">
          <a href="tel:0584556556" aria-label="Gọi hotline"><Phone size={19} /></a>
          <button onClick={openZalo} aria-label="Nhắn Zalo"><MessageCircle size={20} /></button>
        </div>

        {searchOpen && (
          <div className="modal-backdrop" onClick={() => setSearchOpen(false)}>
            <section className="search-modal" onClick={(event) => event.stopPropagation()}>
              <div className="modal-handle" />
              <div className="modal-head"><h2>Tìm kiếm</h2><button onClick={() => setSearchOpen(false)}><X size={21} /></button></div>
              <label><Search size={20} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Bạn muốn đi đâu?" /></label>
              <div className="search-results">
                {results.map((item) => (
                  <button key={item.id} onClick={() => { openMap(`${item.name}, Tây Ninh`); setSearchOpen(false); }}>
                    <img src={item.image} alt="" /><span><b>{item.name}</b><small>{item.type}</small></span><Navigation size={18} />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {installHint && (
          <div className="modal-backdrop" onClick={() => setInstallHint(false)}>
            <section className="install-modal" onClick={(event) => event.stopPropagation()}>
              <button className="modal-close" onClick={() => setInstallHint(false)}><X size={21} /></button>
              <span className="install-visual"><Share2 size={29} /></span>
              <h2>Thêm vào màn hình chính</h2>
              <p>Trên iPhone/iPad, nhấn nút <b>Chia sẻ</b>, sau đó chọn <b>Thêm vào MH chính</b>. Trên Android, mở menu trình duyệt và chọn <b>Cài đặt ứng dụng</b>.</p>
              <button className="primary-wide" onClick={() => setInstallHint(false)}>Đã hiểu</button>
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
        <button onClick={onMap}><MapPin size={14} /> Chỉ đường</button>
      </div>
    </article>
  );
}

function NavButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof Home; label: string; onClick: () => void }) {
  return <button className={active ? "active" : ""} onClick={onClick}><Icon size={21} strokeWidth={active ? 2.4 : 1.8} /><span>{label}</span></button>;
}
