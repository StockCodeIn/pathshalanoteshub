import GKPageClient from "@/components/GKPageClient";
import type { Metadata } from "next";

// ✅ SEO Metadata (अब कोई error नहीं आएगा)
export const metadata: Metadata = {
  title: "सामान्य ज्ञान (GK) Topics - Current Affairs, History, Polity, Science | Pathshala",
  description:
    "सामान्य ज्ञान (GK) टॉपिक्स जैसे करंट अफेयर्स, भारतीय इतिहास, भूगोल, संविधान, विज्ञान और अन्य विषय। प्रतियोगी परीक्षाओं (UPSC, SSC, RPSC, Bank, Railway) के लिए महत्वपूर्ण GK सामग्री।",
  keywords: [
    "GK in Hindi",
    "General Knowledge PDF",
    "करंट अफेयर्स",
    "भारतीय इतिहास GK",
    "भूगोल GK",
    "राजव्यवस्था GK",
    "विज्ञान GK",
    "GK for Competitive Exams",
  ],
};

export default function GKPage() {
  return <GKPageClient />;
}
