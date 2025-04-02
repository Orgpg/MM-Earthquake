"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  UserX,
  UserMinus,
  Users,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export default function CasualtyStats() {
  const [casualtyData, setCasualtyData] = useState({
    deaths: null,
    injured: null,
    missing: null,
    lastUpdated: null,
    source: null,
    loading: true,
    error: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchCasualtyData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/casualties");

      if (!response.ok) {
        throw new Error("Failed to fetch casualty data");
      }

      const data = await response.json();
      setCasualtyData({
        deaths: data.deaths,
        injured: data.injured,
        missing: data.missing,
        lastUpdated: data.lastUpdated,
        source: data.source,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching casualty data:", error);
      setCasualtyData((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCasualtyData();

    // ၃၀ မိနစ်တိုင်း ဒေတာကို အလိုအလျောက် ပြန်လည်ဖတ်ယူပါမယ်
    const intervalId = setInterval(fetchCasualtyData, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (casualtyData.loading) {
    return (
      <div className="bg-[#0f172a] rounded-lg p-4 border border-[#1e293b] animate-pulse">
        <h2 className="text-lg font-bold text-white mb-2">
          Casualty Information
        </h2>
        <div className="h-24 bg-[#1a1f2b] rounded"></div>
      </div>
    );
  }

  if (casualtyData.error) {
    return (
      <div className="bg-[#0f172a] rounded-lg p-4 border border-[#1e293b]">
        <h2 className="text-lg font-bold text-white mb-2 flex justify-between items-center">
          <span>Casualty Information</span>
          <button
            onClick={fetchCasualtyData}
            className="text-sm bg-[#1e293b] hover:bg-[#2d3748] p-1 rounded"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          </button>
        </h2>
        <div className="flex items-center text-red-500 gap-2">
          <AlertTriangle size={18} />
          <p>Unable to load casualty data: {casualtyData.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a] rounded-lg overflow-hidden shadow-xl border border-[#1e293b]">
      <div className="p-4 bg-[#1e293b] flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Casualty Information</h2>
        <button
          onClick={fetchCasualtyData}
          className="text-sm bg-[#2d3748] hover:bg-[#4a5568] p-2 rounded flex items-center gap-1"
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1f2b] p-4 rounded-lg border border-[#2d3748]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-900/30 rounded-full">
              <UserX className="text-red-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Deaths</p>
              <p className="text-2xl font-bold text-red-500">
                {casualtyData.deaths?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1f2b] p-4 rounded-lg border border-[#2d3748]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-900/30 rounded-full">
              <UserMinus className="text-orange-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Injured</p>
              <p className="text-2xl font-bold text-orange-500">
                {casualtyData.injured?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1f2b] p-4 rounded-lg border border-[#2d3748]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900/30 rounded-full">
              <Users className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Missing</p>
              <p className="text-2xl font-bold text-blue-500">
                {casualtyData.missing?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 text-xs">
        <p className="text-amber-400 flex items-center gap-1">
          Source:{" "}
          <a
            href="https://burmese.dvb.no/live"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1"
          >
            {casualtyData.source || "DVB (Democratic Voice of Burma)"}
            <ExternalLink size={12} />
          </a>
        </p>
        <p className="text-primary mt-1">
          Last updated:{" "}
          {casualtyData.lastUpdated || new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
