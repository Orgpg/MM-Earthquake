import Link from "next/link";
import { ExternalLink, Heart, Info } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-4 bg-gradient-to-b from-[#0d1424] to-[#0a101c] border-t border-[#1e293b]/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-[#f56565]" />
              <h3 className="text-sm font-semibold text-gray-300">About</h3>
            </div>
            <p className="text-xs text-white leading-relaxed">
              ဤအက်ပ်သည် မြန်မာနိုင်ငံနှင့် ပတ်ဝန်းကျင်ဒေသများအတွက်
              အချိန်နှင့်တပြေးညီ ငလျင်အချက်အလက်များကို ဖော်ပြပေးပါသည်။
              အချိန်အားလုံးကို မြန်မာစံတော်ချိန် (UTC+6:30) ဖြင့်
              ဖော်ပြထားပါသည်။
            </p>
            <p className="text-xs text-white">
              Data provided by{" "}
              <a
                href="https://earthquake.usgs.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f56565] hover:text-[#fc8181] inline-flex items-center gap-1"
              >
                USGS Earthquake Hazards Program
                <ExternalLink size={12} />
              </a>
            </p>
          </div>

          <div className="space-y-3 md:text-right">
            <div className="flex items-center gap-2 md:justify-end">
              <Heart size={16} className="text-[#f56565]" />
              <h3 className="text-sm font-semibold text-gray-300">Developer</h3>
            </div>
            <p className="text-xs text-white">
              Developed with care by{" "}
              <Link
                href="https://www.waiphyoaung.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f56565] hover:text-[#fc8181] font-medium inline-flex items-center gap-1"
              >
                Wai Phyo Aung
                <ExternalLink size={12} />
              </Link>
            </p>
            <p className="text-xs text-white flex items-center gap-1 md:justify-end">
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="mx-1">•</span>
              <span>All rights reserved</span>
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1e293b]/30 flex justify-center">
          <div className="text-[10px] text-amber-400 text-center">
            Stay safe and informed about seismic activity in Myanmar
          </div>
        </div>
      </div>
    </footer>
  );
}
