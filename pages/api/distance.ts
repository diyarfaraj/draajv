import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { origin, destination } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!origin || !destination || !apiKey) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
    origin as string
  )}&destinations=${encodeURIComponent(destination as string)}&key=${apiKey}&language=sv`;

  const apiRes = await fetch(url);
  const data = await apiRes.json();
  res.status(200).json(data);
} 