export async function getDistanceInKm(origin: string, destination: string): Promise<number | null> {
  try {
    // Call via serverless function to avoid CORS issues
    const url = `/.netlify/functions/distance?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error("Distance API error:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    console.log("DistanceMatrix API response:", data);

    if (
      data.status === "OK" &&
      data.rows &&
      data.rows[0] &&
      data.rows[0].elements &&
      data.rows[0].elements[0].status === "OK"
    ) {
      // distance.value is in meters
      const km = data.rows[0].elements[0].distance.value / 1000;
      console.log("Parsed distance (km):", km);
      return km;
    }

    console.error("Invalid distance response:", data);
    return null;
  } catch (error) {
    console.error("Error fetching distance:", error);
    return null;
  }
} 