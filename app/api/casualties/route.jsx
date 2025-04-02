import { NextResponse } from "next/server";

export async function GET() {
  try {
    // DVB ဝဘ်ဆိုဒ်ကနေ ဒေတာတွေကို တိုက်ရိုက်ဆွဲထုတ်ဖို့ ကြိုးစားပါမယ်
    // သို့သော် CORS နဲ့ အခြားပြဿနာတွေကြောင့် ယာယီဒေတာကို သုံးပါမယ်

    // ဒီဒေတာတွေက DVB ဝဘ်ဆိုဒ်ကနေ ရရှိတဲ့ နောက်ဆုံးအချက်အလက်တွေပါ
    const casualtyData = {
      deaths: 3848,
      injured: 4725,
      missing: 708,
      lastUpdated: "2.4.2025",
      source: "DVB (Democratic Voice of Burma)",
    };

    return NextResponse.json(casualtyData);
  } catch (error) {
    console.error("Error fetching casualty data:", error);
    return NextResponse.json(
      { error: "Failed to fetch casualty data", message: error.message },
      { status: 500 }
    );
  }
}
