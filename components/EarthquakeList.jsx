"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { formatMyanmarTimeForList, getTimeAgo } from "@/utils/timeUtils";

export default function EarthquakeList({
  earthquakes,
  onSelectEarthquake,
  selectedEarthquake,
  timePeriod,
}) {
  const [sortBy, setSortBy] = useState("time"); // time, magnitude
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc

  // Get magnitude color class
  const getMagnitudeColorClass = (magnitude) => {
    if (magnitude >= 7) return "text-[#e040fb]"; // Bright purple
    if (magnitude >= 6) return "text-[#ff4081]"; // Bright pink
    if (magnitude >= 5) return "text-[#ff5252]"; // Bright red
    if (magnitude >= 4) return "text-[#ff9800]"; // Bright orange
    if (magnitude >= 3) return "text-[#ffeb3b]"; // Bright yellow
    if (magnitude >= 2) return "text-[#8bc34a]"; // Bright green
    if (magnitude >= 1) return "text-[#4fc3f7]"; // Bright blue
    return "text-[#bdbdbd]"; // Light gray for < 1
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Sort earthquakes
  const sortedEarthquakes = [...earthquakes].sort((a, b) => {
    if (sortBy === "time") {
      return sortOrder === "asc"
        ? a.properties.time - b.properties.time
        : b.properties.time - a.properties.time;
    } else if (sortBy === "magnitude") {
      return sortOrder === "asc"
        ? a.properties.mag - b.properties.mag
        : b.properties.mag - a.properties.mag;
    }
    return 0;
  });

  // Get period text
  const getPeriodText = () => {
    switch (timePeriod) {
      case "today":
        return "Today";
      case "day":
        return "Last 24 Hours";
      case "week":
        return "Last 7 Days";
      case "month":
        return "Last 30 Days";
      case "custom":
        return "Custom Date";
      default:
        return "Earthquakes";
    }
  };

  return (
    <div className="bg-[#0f172a] rounded-lg overflow-hidden shadow-xl border border-[#1e293b] h-full">
      <div className="p-4 bg-[#1e293b] flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">{getPeriodText()}</h2>
        <div className="text-sm text-gray-400">
          {earthquakes.length} earthquakes found
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center p-3 border-b border-[#1e293b] bg-[#1a1f2b]">
          <button
            className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white"
            onClick={() => handleSort("time")}
          >
            Time
            {sortBy === "time" &&
              (sortOrder === "asc" ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              ))}
          </button>
          <div className="text-sm font-medium text-gray-300">Magnitude</div>
        </div>

        <div className="overflow-y-auto max-h-[500px]">
          {sortedEarthquakes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <p>No earthquakes found in Myanmar region</p>
            </div>
          ) : (
            sortedEarthquakes.map((earthquake) => {
              const { mag, place, time, url } = earthquake.properties;
              const isSelected =
                selectedEarthquake && selectedEarthquake.id === earthquake.id;
              const [lon, lat, depth] = earthquake.geometry.coordinates;

              return (
                <div
                  key={earthquake.id}
                  className={`earthquake-item ${
                    isSelected ? "earthquake-item-selected" : ""
                  }`}
                  onClick={() => onSelectEarthquake(earthquake)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div>
                        <span className="earthquake-time text-amber-400">
                          {formatMyanmarTimeForList(time)}
                        </span>
                        <span className="earthquake-time-ago text-blue-400">
                          ({getTimeAgo(time)})
                        </span>
                      </div>
                      <div className="earthquake-location text-sky-500">
                        {place || "Unknown location"}
                      </div>
                      <div className="earthquake-coordinates text-orange-400">
                        Depth: {depth.toFixed(1)} km | Lat: {lat.toFixed(4)}° |
                        Lon: {lon.toFixed(4)}°
                      </div>
                    </div>
                    <div
                      className={`magnitude-display ${getMagnitudeColorClass(
                        mag
                      )}`}
                    >
                      M {mag.toFixed(1)}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="details-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Details <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
