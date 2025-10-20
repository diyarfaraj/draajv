export async function getDistanceInKm(origin: string, destination: string): Promise<number | null> {
  try {
    let url: string;

    // Check if running on Netlify (deployed) or locally
    const isNetlify = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

    if (isNetlify) {
      // Use Netlify function to avoid CORS
      url = `/.netlify/functions/distance?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
    } else {
      // For local development, use Next.js API route
      url = `/api/distance?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
    }

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