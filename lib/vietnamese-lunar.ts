const VIETNAM_TIMEZONE = 7;

function integer(value: number) {
  return Math.floor(value);
}

function julianDayFromDate(day: number, month: number, year: number) {
  const a = integer((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  let jd = day + integer((153 * m + 2) / 5) + 365 * y + integer(y / 4) - integer(y / 100) + integer(y / 400) - 32045;
  if (jd < 2299161) jd = day + integer((153 * m + 2) / 5) + 365 * y + integer(y / 4) - 32083;
  return jd;
}

function dateFromJulianDay(jd: number): [number, number, number] {
  let b: number;
  let c: number;
  if (jd > 2299160) {
    const a = jd + 32044;
    b = integer((4 * a + 3) / 146097);
    c = a - integer(b * 146097 / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = integer((4 * c + 3) / 1461);
  const e = c - integer(1461 * d / 4);
  const m = integer((5 * e + 2) / 153);
  const day = e - integer((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * integer(m / 10);
  const year = b * 100 + d - 4800 + integer(m / 10);
  return [day, month, year];
}

function newMoon(k: number) {
  const t = k / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;
  const dr = Math.PI / 180;
  let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * t2 - 0.000000155 * t3;
  jd1 += 0.00033 * Math.sin((166.56 + 132.87 * t - 0.009173 * t2) * dr);
  const m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3;
  const mPrime = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3;
  const f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3;
  let correction = (0.1734 - 0.000393 * t) * Math.sin(m * dr) + 0.0021 * Math.sin(2 * m * dr);
  correction -= 0.4068 * Math.sin(mPrime * dr);
  correction += 0.0161 * Math.sin(2 * mPrime * dr);
  correction -= 0.0004 * Math.sin(3 * mPrime * dr);
  correction += 0.0104 * Math.sin(2 * f * dr) - 0.0051 * Math.sin((m + mPrime) * dr);
  correction -= 0.0074 * Math.sin((m - mPrime) * dr);
  correction += 0.0004 * Math.sin((2 * f + m) * dr);
  correction -= 0.0004 * Math.sin((2 * f - m) * dr);
  correction -= 0.0006 * Math.sin((2 * f + mPrime) * dr);
  correction += 0.001 * Math.sin((2 * f - mPrime) * dr) + 0.0005 * Math.sin((2 * mPrime + m) * dr);
  const deltaT = t < -11
    ? 0.001 + 0.000839 * t + 0.0002261 * t2 - 0.00000845 * t3 - 0.000000081 * t * t3
    : -0.000278 + 0.000265 * t + 0.000262 * t2;
  return jd1 + correction - deltaT;
}

function sunLongitude(jdn: number) {
  const t = (jdn - 2451545) / 36525;
  const t2 = t * t;
  const dr = Math.PI / 180;
  const m = 357.5291 + 35999.0503 * t - 0.0001559 * t2 - 0.00000048 * t * t2;
  const l0 = 280.46645 + 36000.76983 * t + 0.0003032 * t2;
  let dl = (1.9146 - 0.004817 * t - 0.000014 * t2) * Math.sin(dr * m);
  dl += (0.019993 - 0.000101 * t) * Math.sin(2 * dr * m) + 0.00029 * Math.sin(3 * dr * m);
  let longitude = (l0 + dl) * dr;
  longitude -= Math.PI * 2 * integer(longitude / (Math.PI * 2));
  return longitude;
}

function newMoonDay(k: number) {
  return integer(newMoon(k) + 0.5 + VIETNAM_TIMEZONE / 24);
}

function sunLongitudeSector(dayNumber: number) {
  return integer(sunLongitude(dayNumber - 0.5 - VIETNAM_TIMEZONE / 24) / Math.PI * 6);
}

function lunarMonth11(year: number) {
  const off = julianDayFromDate(31, 12, year) - 2415021;
  const k = integer(off / 29.530588853);
  let nm = newMoonDay(k);
  if (sunLongitudeSector(nm) >= 9) nm = newMoonDay(k - 1);
  return nm;
}

function leapMonthOffset(a11: number) {
  const k = integer((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = sunLongitudeSector(newMoonDay(k + i));
  do {
    last = arc;
    i += 1;
    arc = sunLongitudeSector(newMoonDay(k + i));
  } while (arc !== last && i < 14);
  return i - 1;
}

export function lunarToSolar(day: number, month: number, year: number, leap = false) {
  let a11: number;
  let b11: number;
  if (month < 11) {
    a11 = lunarMonth11(year - 1);
    b11 = lunarMonth11(year);
  } else {
    a11 = lunarMonth11(year);
    b11 = lunarMonth11(year + 1);
  }
  const k = integer(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = month - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    const leapOff = leapMonthOffset(a11);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (leap && month !== leapMonth) throw new Error("Tháng nhuận không hợp lệ");
    if (leap || off >= leapOff) off += 1;
  }
  const monthStart = newMoonDay(k + off);
  const [solarDay, solarMonth, solarYear] = dateFromJulianDay(monthStart + day - 1);
  return { day: solarDay, month: solarMonth, year: solarYear };
}

export function toISODate(date: { day: number; month: number; year: number }) {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

export function addDays(isoDate: string, days: number) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export function vietnamTodayISO() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
