"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ExternalLink, MapPin } from "lucide-react";
import {
  formatMyanmarTimeForList,
  getTimeAgo,
  isToday,
} from "@/utils/timeUtils";

export default function EarthquakeList({
  earthquakes,
  onSelectEarthquake,
  selectedEarthquake,
  timePeriod,
  magnitudeStats,
}) {
  const [sortBy, setSortBy] = useState("time"); // time, magnitude
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [magnitudeFilter, setMagnitudeFilter] = useState(0); // Show all earthquakes (magnitude >= 0)

  // Auto-scroll to selected earthquake
  useEffect(() => {
    if (selectedEarthquake) {
      const selectedElement = document.getElementById(
        `earthquake-${selectedEarthquake.id}`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedEarthquake]);

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

  // Update the handleEarthquakeSelect function to ensure immediate response

  // Handle earthquake selection with immediate focus
  const handleEarthquakeSelect = (earthquake) => {
    // Call the parent's onSelectEarthquake function immediately
    onSelectEarthquake(earthquake);

    // Add a small delay to ensure the UI updates before scrolling
    setTimeout(() => {
      // If the map is not in view, this will help scroll to it
      const mapElement = document.querySelector(".map-container");
      if (mapElement) {
        const mapRect = mapElement.getBoundingClientRect();
        if (mapRect.top < 0 || mapRect.bottom > window.innerHeight) {
          mapElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 10);
  };

  // Filter earthquakes by magnitude
  const filteredEarthquakes = earthquakes.filter(
    (quake) => quake.properties.mag >= magnitudeFilter
  );

  // Sort earthquakes
  const sortedEarthquakes = [...filteredEarthquakes].sort((a, b) => {
    if (sortBy === "time") {
      // If we're sorting by time, keep today's earthquakes at the top
      const aIsToday = isToday(a.properties.time);
      const bIsToday = isToday(b.properties.time);

      if (aIsToday && !bIsToday) return sortOrder === "asc" ? 1 : -1;
      if (!aIsToday && bIsToday) return sortOrder === "asc" ? -1 : 1;

      // If both are from today or both are not from today, sort by time
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
      case "custom":
        return "Custom Date";
      case "week":
        return "Last 7 Days";
      default:
        return "Earthquakes";
    }
  };

  // Group earthquakes by day
  const groupedEarthquakes = sortedEarthquakes.reduce((groups, earthquake) => {
    const date = new Date(earthquake.properties.time).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(earthquake);
    return groups;
  }, {});

  // Convert grouped earthquakes to array and sort by date (newest first)
  const groupedEarthquakesArray = Object.entries(groupedEarthquakes)
    .map(([date, quakes]) => ({ date, quakes }))
    .sort((a, b) => {
      // Sort to ensure today is always at the top
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      const today = new Date();
      const isAToday =
        aDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
      const isBToday =
        bDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);

      if (isAToday && !isBToday) return -1;
      if (!isAToday && isBToday) return 1;

      // Otherwise sort by date (newest first)
      return new Date(b.date) - new Date(a.date);
    });

  return (
    <div className="bg-[#0f172a] rounded-lg overflow-hidden shadow-xl border border-[#1e293b] h-full">
      <div className="p-4 bg-[#1e293b] flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">
          {getPeriodText()}
          {isToday(new Date()) &&
            timePeriod === "week" &&
            " (Today's earthquakes shown first)"}
          <p className="text-xs text-amber-400">ပျင်းအား 4.0 နှင့်အထက်</p>
        </h2>
        <div className="text-sm text-primary">
          {sortedEarthquakes.length} earthquakes found
          {magnitudeStats?.count > 0 &&
            ` (M${magnitudeStats.min.toFixed(1)}-M${magnitudeStats.max.toFixed(
              1
            )})`}
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
          <button
            className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white"
            onClick={() => handleSort("magnitude")}
          >
            Magnitude
            {sortBy === "magnitude" &&
              (sortOrder === "asc" ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              ))}
          </button>
        </div>

        <div className="overflow-y-auto max-h-[600px]">
          {sortedEarthquakes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <p>No earthquakes found in Myanmar region</p>
            </div>
          ) : (
            groupedEarthquakesArray.map(({ date, quakes }) => (
              <div key={date} className="border-b border-[#1e293b]">
                <div className="p-2 bg-[#1a1f2b] sticky top-0 z-10">
                  <h3 className="text-sm font-medium text-gray-300">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {isToday(new Date(date)) && (
                      <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                        Today
                      </span>
                    )}
                  </h3>
                </div>
                {quakes.map((earthquake) => {
                  const { mag, place, time, url } = earthquake.properties;
                  const isSelected =
                    selectedEarthquake &&
                    selectedEarthquake.id === earthquake.id;
                  const [lon, lat, depth] = earthquake.geometry.coordinates;

                  return (
                    <div
                      id={`earthquake-${earthquake.id}`}
                      key={earthquake.id}
                      className={`earthquake-item ${
                        isSelected ? "earthquake-item-selected" : ""
                      } transition-all duration-300`}
                      onClick={() => handleEarthquakeSelect(earthquake)}
                      tabIndex={0}
                      role="button"
                      aria-pressed={isSelected}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleEarthquakeSelect(earthquake);
                        }
                      }}
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
                          <div className="earthquake-location text-sky-500 flex items-center gap-1">
                            {isSelected && (
                              <MapPin
                                size={16}
                                className="text-[#f56565] animate-pulse"
                              />
                            )}
                            {place || "Unknown location"}
                          </div>
                          <div className="earthquake-coordinates">
                            Depth: {depth.toFixed(1)} km | Lat: {lat.toFixed(4)}
                            ° | Lon: {lon.toFixed(4)}°
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
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
