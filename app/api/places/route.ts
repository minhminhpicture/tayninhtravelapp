import { NextRequest, NextResponse } from "next/server";

const fallbackPlaces = [
  "Sun World Ba Den Mountain, Thạnh Tân, Tây Ninh",
  "Tòa Thánh Tây Ninh, Phạm Hộ Pháp, Long Hoa, Tây Ninh",
  "Bến xe Tây Ninh, Trưng Nữ Vương, Tây Ninh",
  "Melia Vinpearl Tay Ninh, 90 Lê Duẩn, Tây Ninh",
  "Vincom Plaza Tây Ninh, 444 đường 30 Tháng 4, Tây Ninh",
  "Khách sạn Sunrise Tây Ninh, Hoàng Lê Kha, Tây Ninh",
  "Chùa Gò Kén, Long Thành Trung, Hòa Thành, Tây Ninh",
  "Hồ Dầu Tiếng, Tây Ninh",
];

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("input")?.trim() || "";
  const normalized = input.toLocaleLowerCase("vi");
  const localSuggestions = fallbackPlaces
    .filter((place) => !normalized || place.toLocaleLowerCase("vi").includes(normalized))
    .slice(0, 6)
    .map((label, index) => ({ id: `local-${index}-${label}`, label, source: "local" as const }));

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || input.length < 2) {
    return NextResponse.json({ suggestions: localSuggestions }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({
        input: `${input}, Tây Ninh, Việt Nam`,
        includedRegionCodes: ["vn"],
        languageCode: "vi",
        regionCode: "VN",
      }),
    });

    if (!response.ok) throw new Error("Google Places request failed");
    const data = await response.json() as {
      suggestions?: Array<{
        placePrediction?: {
          placeId?: string;
          text?: { text?: string };
        };
      }>;
    };
    const googleSuggestions = (data.suggestions || [])
      .map((item) => item.placePrediction)
      .filter((item): item is NonNullable<typeof item> => Boolean(item?.placeId && item?.text?.text))
      .slice(0, 6)
      .map((item) => ({
        id: item.placeId as string,
        label: item.text?.text as string,
        source: "google" as const,
      }));

    return NextResponse.json(
      { suggestions: googleSuggestions.length ? googleSuggestions : localSuggestions },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { suggestions: localSuggestions },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
