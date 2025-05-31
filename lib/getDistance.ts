export async function getDistanceInKm(origin: string, destination: string): Promise<number | null> {
  const url = `/api/distance?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (
    data.status === "OK" &&
    data.rows &&
    data.rows[0] &&
    data.rows[0].elements &&
    data.rows[0].elements[0].status === "OK"
  ) {
    // distance.value is in meters
    return data.rows[0].elements[0].distance.value / 1000;
  }
  return null;
} 