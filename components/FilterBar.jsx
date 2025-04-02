"use client";

export default function FilterBar({ timePeriod, onPeriodChange }) {
  return (
    <div className="bg-[#0f172a] rounded-lg overflow-hidden shadow-xl border border-[#1e293b] mb-6">
      <div className="p-4 flex flex-wrap justify-end gap-3">
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
