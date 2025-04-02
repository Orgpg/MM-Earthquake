export async function GET(request) {
  try {
    // Get the date and period from query parameters
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const period = searchParams.get("period") || "day" // today, day, week, month, custom

    let apiUrl

    // Determine the appropriate API URL based on period
    if (period === "today") {
      // For today, we'll use the query API with today's date
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      // Format dates for USGS API
      const startTime = new Date(today.setHours(0, 0, 0, 0)).toISOString()
      const endTime = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString()

      apiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}`
    } else if (period === "day") {
      apiUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    } else if (period === "week") {
      apiUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
    } else if (period === "month") {
      apiUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
    } else {
      // If a specific date is provided and it's not today
      if (date && date !== new Date().toISOString().split("T")[0]) {
        // Convert date string to Date objects for start and end time
        const startDate = new Date(date)
        const endDate = new Date(date)
        endDate.setDate(endDate.getDate() + 1)

        // Format dates for USGS API
        const startTime = startDate.toISOString()
        const endTime = endDate.toISOString()

        // Use the USGS query API instead of the feed
        apiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}`
      } else {
        // Default to all_day if no valid period or date is specified
        apiUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      }
    }

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error("Failed to fetch earthquake data from USGS")
    }

    const data = await response.json()

    // Filter for Myanmar (Burma) and surrounding areas
    // Myanmar's approximate bounding box:
    // Latitude: 9.5° to 28.5° N
    // Longitude: 92° to 101.5° E
    // We'll extend this a bit to catch nearby earthquakes that might affect Myanmar
    const myanmarEarthquakes = data.features.filter((quake) => {
      const [longitude, latitude] = quake.geometry.coordinates
      return latitude >= 8.5 && latitude <= 29.5 && longitude >= 91 && longitude <= 102.5
    })

    // Sort by time (newest first)
    myanmarEarthquakes.sort((a, b) => {
      return new Date(b.properties.time) - new Date(a.properties.time)
    })

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
        },
      },
    )
  } catch (error) {
    console.error("Error fetching earthquake data:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

