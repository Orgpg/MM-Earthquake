"use client";

import { RefreshCw, Calendar } from "lucide-react";
import { formatMyanmarTime } from "@/utils/timeUtils";

export default function Header({
  lastUpdated,
  onRefresh,
  selectedDate,
  onDateChange,
  timePeriod,
}) {
  const isToday = selectedDate === new Date().toISOString().split("T")[0];
  const isCustomPeriod = timePeriod === "custom";

  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-500 mb-2 md:mb-0">
          Myanmar Earthquake Tracker
        </h1>
        <div className="flex flex-wrap gap-2">
          {/* Date picker - only show prominently when custom period is selected */}
          {isCustomPeriod && (
            <div className="flex items-center bg-[#2d3748] rounded-md border border-[#f56565]">
              <label htmlFor="date-select" className="sr-only">
                Select Date
              </label>
              <div className="flex items-center px-3 text-gray-400">
                <Calendar size={18} />
              </div>
              <input
                type="date"
                id="date-select"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="bg-[#2d3748] text-white px-2 py-2 rounded-md focus:outline-none"
                style={{
                  colorScheme: "dark",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                }}
              />
            </div>
          )}

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 bg-[#e53e3e] hover:bg-[#c53030] text-white px-4 py-2 rounded-md transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-blue-400">
          Live earthquake data from USGS for Myanmar and surrounding areas
        </p>
        <p className="text-sm text-amber-500">
          {lastUpdated
            ? `Last updated: ${formatMyanmarTime(lastUpdated)}`
            : "Loading..."}
        </p>
      </div>
    </header>
  );
}
