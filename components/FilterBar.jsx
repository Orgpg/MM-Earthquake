"use client";

export default function FilterBar({ timePeriod, onPeriodChange }) {
  return (
    <div className="bg-[#0f172a] rounded-lg overflow-hidden shadow-xl border border-[#1e293b] mb-6">
      <div className="p-4 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => onPeriodChange("today")}
          className={`filter-button ${
            timePeriod === "today"
              ? "filter-button-active"
              : "filter-button-inactive"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => onPeriodChange("day")}
          className={`filter-button ${
            timePeriod === "day"
              ? "filter-button-active"
              : "filter-button-inactive"
          }`}
        >
          Last 24 Hours
        </button>
        <button
          onClick={() => onPeriodChange("week")}
          className={`filter-button ${
            timePeriod === "week"
              ? "filter-button-active"
              : "filter-button-inactive"
          }`}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => onPeriodChange("month")}
          className={`filter-button ${
            timePeriod === "month"
              ? "filter-button-active"
              : "filter-button-inactive"
          }`}
        >
          Last 30 Days
        </button>
        <button
          onClick={() => onPeriodChange("custom")}
          className={`filter-button ${
            timePeriod === "custom"
              ? "filter-button-active"
              : "filter-button-inactive"
          }`}
        >
          Custom Date
        </button>
      </div>
    </div>
  );
}
