import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-4 border-t border-[#1e293b] bg-[#0d1424] mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <p className="text-gray-400 text-sm">
              Data provided by{" "}
              <a
                href="https://earthquake.usgs.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f56565] hover:text-[#fc8181]"
              >
                USGS Earthquake Hazards Program
              </a>
            </p>
            <p className="text-gray-500 text-xs mt-1">
              All times shown in Myanmar Standard Time (UTC+6:30)
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              Developed by{" "}
              <Link
                href="https://www.waiphyoaung.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f56565] hover:text-[#fc8181] font-medium"
              >
                Wai Phyo Aung
              </Link>
            </p>
            <p className="text-gray-500 text-xs mt-1">
              &copy; {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
