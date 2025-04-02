export async function GET(request) {
  try {
    // Get the date and period from query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const period = searchParams.get("period") || "day"; // today, day, week, month, custom

    let apiUrl;

    // IMPORTANT: Use the "all" feed which includes all magnitudes
    // The "all" feed includes earthquakes of all magnitudes, while other feeds might filter
    if (period === "today") {
      // For today, we'll use the query API with today's date
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Format dates for USGS API
      const startTime = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endTime = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString();

      // Explicitly set minmagnitude=0 to get all earthquakes
      apiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=0&limit=1000`;
    } else if (period === "day") {
      // Use the "all" feed which includes all magnitudes
      apiUrl =
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
    } else if (period === "week") {
      // Use the "all" feed which includes all magnitudes
      apiUrl =
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    } else if (period === "month") {
      // Use the "all" feed which includes all magnitudes
      apiUrl =
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
    } else {
      // If a specific date is provided and it's not today
      if (date && date !== new Date().toISOString().split("T")[0]) {
        // Convert date string to Date objects for start and end time
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        // Format dates for USGS API
        const startTime = startDate.toISOString();
        const endTime = endDate.toISOString();

        // Use the USGS query API instead of the feed
        // Explicitly set minmagnitude=0 to get all earthquakes
        apiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=0&limit=1000`;
      } else {
        // Default to all_day if no valid period or date is specified
        apiUrl =
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
      }
    }

    console.log("Fetching earthquake data from:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Myanmar-Earthquake-Tracker/1.0",
      },
      next: { revalidate: 0 }, // Don't cache the response
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch earthquake data from USGS: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`Total earthquakes from USGS: ${data.features?.length || 0}`);

    // Filter for Myanmar (Burma) and surrounding areas
    // Myanmar's approximate bounding box:
    // Latitude: 9.5° to 28.5° N
    // Longitude: 92° to 101.5° E
    // We'll extend this a bit to catch nearby earthquakes that might affect Myanmar
    const myanmarEarthquakes = data.features.filter((quake) => {
      const [longitude, latitude] = quake.geometry.coordinates;
      return (
        latitude >= 8.5 &&
        latitude <= 29.5 &&
        longitude >= 91 &&
        longitude <= 102.5
      );
    });

    // Log the number of earthquakes and their magnitudes
    console.log(
      `Total earthquakes in Myanmar region: ${myanmarEarthquakes.length}`
    );

    if (myanmarEarthquakes.length > 0) {
      const magnitudes = myanmarEarthquakes
        .map((quake) => quake.properties.mag)
        .sort((a, b) => a - b);
      console.log(
        "Magnitudes range:",
        Math.min(...magnitudes),
        "to",
        Math.max(...magnitudes)
      );
      console.log("All magnitudes:", magnitudes);
    }

    // Sort by time (newest first)
    myanmarEarthquakes.sort((a, b) => {
      return new Date(b.properties.time) - new Date(a.properties.time);
    });

    // Return filtered data with Myanmar's structure
    return new Response(
      JSON.stringify({
        type: "FeatureCollection",
        metadata: {
          ...data.metadata,
          title: `Myanmar Earthquakes - ${
            period === "today"
              ? "Today"
              : period === "day"
              ? "Past Day"
              : period === "week"
              ? "Past Week"
              : period === "month"
              ? "Past Month"
              : "Custom Date"
          }`,
          count: myanmarEarthquakes.length,
        },
        features: myanmarEarthquakes,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
