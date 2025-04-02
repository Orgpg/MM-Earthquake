"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import EarthquakeList from "@/components/EarthquakeList";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";

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
  const [timePeriod, setTimePeriod] = useState("day"); // 'today', 'day', 'week', 'month', 'custom'

  // Update fetchEarthquakeData to include date and period
  const fetchEarthquakeData = async () => {
    try {
      setLoading(true);

      // Only include date parameter if we're using a custom period
      const dateParam = timePeriod === "custom" ? `&date=${selectedDate}` : "";
      const response = await fetch(
        `/api/earthquakes?period=${timePeriod}${dateParam}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch earthquake data");
      }

      const data = await response.json();
      setEarthquakes(data.features);
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

  const handleEarthquakeSelect = (earthquake) => {
    setSelectedEarthquake(earthquake);
  };

  return (
    <main className="container mx-auto px-4 py-8">
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
          <div className="mb-6">
            <MapComponent
              earthquakes={earthquakes}
              onSelectEarthquake={handleEarthquakeSelect}
              selectedEarthquake={selectedEarthquake}
            />
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
          />
        </>
      )}

      <Footer />
    </main>
  );
}
