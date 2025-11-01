import GKPageClient from "@/components/GKPageClient";
import type { Metadata } from "next";

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "सामान्य ज्ञान (GK) Topics - Current Affairs, History, Polity, Science | Pathshala Notes Hub",
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
    "Pathshala Notes Hub"
  ],
  openGraph: {
    title: "सामान्य ज्ञान (GK) Topics - Pathshala Notes Hub",
    description:
      "GK Notes: भारतीय इतिहास, भूगोल, राजनीति, विज्ञान और करंट अफेयर्स। प्रतियोगी परीक्षाओं के लिए आवश्यक GK Notes और अध्ययन सामग्री।",
    type: "website",
    locale: "hi_IN",
  },
};

export default function GKPage() {
  return <GKPageClient />;
}
