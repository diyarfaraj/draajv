import type { Handler, HandlerEvent } from "@netlify/functions";

export const handler: Handler = async (event: HandlerEvent) => {
  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const { origin, destination } = event.queryStringParameters || {};
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!origin || !destination) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Origin and destination are required" }),
    };
  }

  if (!apiKey) {
    console.error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Google Maps API key is not configured" }),
    };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}&language=sv`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("Google Maps API error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Failed to fetch distance from Google Maps API", details: data }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching distance:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
