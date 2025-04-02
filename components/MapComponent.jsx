"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatMyanmarTime } from "@/utils/timeUtils";

// Fix Leaflet marker icon issues
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
};

// Component to handle map view changes
function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);

  return null;
}

export default function MapComponent({
  earthquakes,
  onSelectEarthquake,
  selectedEarthquake,
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  // Default center on Myanmar
  const defaultCenter = [19.7633, 96.0785]; // Naypyidaw coordinates
  const defaultZoom = 6;

  // Calculate center and zoom if a quake is selected
  const mapCenter = selectedEarthquake
    ? [
        selectedEarthquake.geometry.coordinates[1],
        selectedEarthquake.geometry.coordinates[0],
      ]
    : defaultCenter;

  const mapZoom = selectedEarthquake ? 8 : defaultZoom;

  // Create custom marker icons based on magnitude
  const createMarkerIcon = (magnitude, earthquakeId) => {
    // Ensure minimum size for very small magnitudes
    const size = Math.max(8, Math.min(35, magnitude * 5 + 5));

    let colorClass = "magnitude-0";
    if (magnitude >= 8) colorClass = "magnitude-9";
    else if (magnitude >= 7) colorClass = "magnitude-8";
    else if (magnitude >= 6) colorClass = "magnitude-7";
    else if (magnitude >= 5) colorClass = "magnitude-6";
    else if (magnitude >= 4) colorClass = "magnitude-5";
    else if (magnitude >= 3) colorClass = "magnitude-4";
    else if (magnitude >= 2) colorClass = "magnitude-3";
    else if (magnitude >= 1) colorClass = "magnitude-2";
    else if (magnitude >= 0) colorClass = "magnitude-1";

    const isSelected =
      selectedEarthquake && selectedEarthquake.id === earthquakeId;

    return L.divIcon({
      className: `earthquake-marker ${colorClass} ${isSelected ? "pulse" : ""}`,
      html: `<div style="width: ${size}px; height: ${size}px;"><span class="marker-magnitude">${magnitude.toFixed(
        1
      )}</span></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  return (
    <div className="bg-[#0f172a] rounded-lg overflow-hidden shadow-xl border border-[#1e293b]">
      <div className="p-4 bg-[#1e293b]">
        <h2 className="text-xl font-bold text-amber-400">Live Earthquake Map</h2>
      </div>
      <div className="map-container">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
          scrollWheelZoom={true}
          className="z-0"
          attributionControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="dark-map-tiles"
          />

          <MapController center={mapCenter} zoom={mapZoom} />

          {earthquakes.map((earthquake) => {
            const { coordinates } = earthquake.geometry;
            const { mag, place, time, url, title } = earthquake.properties;

            return (
              <Marker
                key={earthquake.id}
                position={[coordinates[1], coordinates[0]]}
                icon={createMarkerIcon(mag, earthquake.id)}
                eventHandlers={{
                  click: () => onSelectEarthquake(earthquake),
                }}
              >
                <Popup>
                  <div className="text-black">
                    <h3 className="font-bold">{title}</h3>
                    <p>
                      Magnitude:{" "}
                      <span
                        className={`font-bold ${
                          mag >= 7
                            ? "text-purple-600"
                            : mag >= 6
                            ? "text-pink-600"
                            : mag >= 5
                            ? "text-red-600"
                            : mag >= 4
                            ? "text-orange-600"
                            : mag >= 3
                            ? "text-yellow-600"
                            : mag >= 2
                            ? "text-green-600"
                            : mag >= 1
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {mag.toFixed(1)}
                      </span>
                    </p>
                    <p>Location: {place}</p>
                    <p>Time: {formatMyanmarTime(time)}</p>
                    <p>Depth: {coordinates[2].toFixed(1)} km</p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View on USGS
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      <div className="p-4 bg-[#1e293b] flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full magnitude-0"></div>
          <span className="text-xs">M &lt; 1</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full magnitude-1"></div>
          <span className="text-xs">M 1-2</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full magnitude-2"></div>
          <span className="text-xs">M 2-3</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full magnitude-3"></div>
          <span className="text-xs">M 3-4</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full magnitude-4"></div>
          <span className="text-xs">M 4-5</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full magnitude-5"></div>
          <span className="text-xs">M 5-6</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full magnitude-6"></div>
          <span className="text-xs">M 6-7</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full magnitude-7"></div>
          <span className="text-xs">M 7-8</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full magnitude-8"></div>
          <span className="text-xs">M &gt; 8</span>
        </div>
      </div>
    </div>
  );
}
