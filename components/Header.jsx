"use client";

import { RefreshCw, Calendar } from "lucide-react";
import { formatMyanmarTime } from "@/utils/timeUtils";
import { useState, useEffect } from "react";

export default function Header({
  lastUpdated,
  onRefresh,
  selectedDate,
  onDateChange,
  timePeriod,
}) {
  const isToday = selectedDate === new Date().toISOString().split("T")[0];
  const isCustomPeriod = timePeriod === "custom";
  const [scrolled, setScrolled] = useState(false);

  // Add scroll event listener to change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-transparent backdrop-blur-md py-2" : "bg-[#0d1424] py-2"
      }`}
    >
      <div className="container mx-auto py-3 px-4">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#f56565]">
              Myanmar Earthquake Tracker
            </h1>

            <button
              onClick={onRefresh}
              className="flex items-center gap-1 bg-[#1e293b]/80 hover:bg-[#2d3748]/80 text-white px-2 py-1 rounded-md transition-colors text-sm border border-[#2d3748]"
              title="Refresh data"
            >
              <RefreshCw size={14} className="text-[#f56565]" />
              <span className="text-xs">Refresh</span>
            </button>
          </div>

          <div className="flex justify-between items-center text-xs">
            <p className="text-primary">
              Live earthquake data from USGS for Myanmar
            </p>

            <div className="text-primary">
              {lastUpdated
                ? `Updated: ${formatMyanmarTime(lastUpdated)}`
                : "Loading..."}
            </div>
          </div>

          {isCustomPeriod && (
            <div className="flex items-center justify-end mt-1">
              <div className="flex items-center bg-[#1e293b]/80 rounded-md border border-[#2d3748] overflow-hidden">
                <label htmlFor="date-select" className="sr-only">
                  Select Date
                </label>
                <div className="flex items-center px-2 text-gray-400">
                  <Calendar size={14} />
                </div>
                <input
                  type="date"
                  id="date-select"
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="bg-[#1e293b]/80 text-white px-2 py-1 text-xs rounded-md focus:outline-none w-[120px]"
                  style={{
                    colorScheme: "dark",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
