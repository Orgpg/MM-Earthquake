"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import EarthquakeList from "@/components/EarthquakeList";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import CasualtyStats from "@/components/CasualtyStats";
import { isToday } from "@/utils/timeUtils";

// Import map component dynamically to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <Loading message="Loading map..." />,
});

export default function Home() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [timePeriod, setTimePeriod] = useState("week"); // Default to 'week' instead of 'day'
  const mapRef = useRef(null);

  // Update fetchEarthquakeData to include date and period
  const fetchEarthquakeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Only include date parameter if we're using a custom period
      const dateParam = timePeriod === "custom" ? `&date=${selectedDate}` : "";
      const apiUrl = `/api/earthquakes?period=${timePeriod}${dateParam}`;

      console.log("Fetching earthquake data from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch earthquake data: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log(
        `Received ${data.features?.length || 0} earthquakes from API`
      );

      if (data.features?.length > 0) {
        const magnitudes = data.features
          .map((quake) => quake.properties.mag)
          .sort((a, b) => a - b);
        console.log(
          "Magnitude range:",
          Math.min(...magnitudes),
          "to",
          Math.max(...magnitudes)
        );
        console.log("All magnitudes:", magnitudes);
      }

      // Sort earthquakes to show today's earthquakes at the top
      const sortedEarthquakes = [...(data.features || [])].sort((a, b) => {
        const aIsToday = isToday(a.properties.time);
        const bIsToday = isToday(b.properties.time);

        if (aIsToday && !bIsToday) return -1;
        if (!aIsToday && bIsToday) return 1;

        // If both are from today or both are not from today, sort by time (newest first)
        return new Date(b.properties.time) - new Date(a.properties.time);
      });

      setEarthquakes(sortedEarthquakes);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error("Error fetching earthquake data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Update useEffect to depend on selectedDate and timePeriod
  useEffect(() => {
    fetchEarthquakeData();

    // Only set up interval if we're viewing live data
    if (timePeriod !== "custom") {
      const intervalId = setInterval(fetchEarthquakeData, 5 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [selectedDate, timePeriod]);

  // Add handleDateChange function
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setTimePeriod("custom");
    setSelectedEarthquake(null);
  };

  // Add handlePeriodChange function
  const handlePeriodChange = (period) => {
    setTimePeriod(period);
    setSelectedEarthquake(null);
  };

  const handleRefresh = () => {
    fetchEarthquakeData();
  };

  // Update the handleEarthquakeSelect function to ensure immediate response

  // Improved handleEarthquakeSelect function for immediate map focus
  const handleEarthquakeSelect = (earthquake) => {
    // Set the selected earthquake immediately
    setSelectedEarthquake(earthquake);

    // Force immediate update by using setTimeout with 0 delay
    setTimeout(() => {
      // Scroll to map if it's not in view
      if (mapRef.current) {
        const mapElement = mapRef.current;
        const mapRect = mapElement.getBoundingClientRect();

        // If map is not visible in viewport, scroll to it
        if (mapRect.top < 0 || mapRect.bottom > window.innerHeight) {
          mapElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 0);
  };

  // Calculate magnitude stats
  const magnitudeStats =
    earthquakes.length > 0
      ? {
          min: Math.min(...earthquakes.map((quake) => quake.properties.mag)),
          max: Math.max(...earthquakes.map((quake) => quake.properties.mag)),
          count: earthquakes.length,
        }
      : { min: 0, max: 0, count: 0 };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Header
          lastUpdated={lastUpdated}
          onRefresh={handleRefresh}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          timePeriod={timePeriod}
        />

        {loading && <Loading message="Fetching earthquake data..." />}

        {error && (
          <div className="bg-red-900 text-white p-4 rounded-md mb-6">
            Error: {error}. Please try again later.
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-6" ref={mapRef}>
              <MapComponent
                earthquakes={earthquakes}
                onSelectEarthquake={handleEarthquakeSelect}
                selectedEarthquake={selectedEarthquake}
              />
            </div>

            <div className="mb-6">
              <CasualtyStats />
            </div>

            <FilterBar
              timePeriod={timePeriod}
              onPeriodChange={handlePeriodChange}
            />

            <EarthquakeList
              earthquakes={earthquakes}
              onSelectEarthquake={handleEarthquakeSelect}
              selectedEarthquake={selectedEarthquake}
              timePeriod={timePeriod}
              magnitudeStats={magnitudeStats}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
