import dotenv from "dotenv";
import { getCache, setCache } from "../utils/cache.js";

dotenv.config();

const apiKey = process.env.WEATHER_API_KEY;

const baseUrl =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

if (!apiKey) {
  throw new Error("WEATHER_API_KEY is missing in environment variables");
}

async function getWeather(req, res) {
  try {
    const { location } = req.query;

    /* ---------------- VALIDATION ---------------- */

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location query parameter is required",
      });
    }

    /* ---------------- CACHE KEY ---------------- */

    const normalizedLocation = location.trim().toLowerCase();

    const cacheKey = `weather:${normalizedLocation}`;

    /* ---------------- CHECK REDIS CACHE ---------------- */

    const cacheData = await getCache(cacheKey);

    if (cacheData) {
      return res.status(200).json({
        success: true,
        source: "redis-cache",
        data: cacheData,
      });
    }

    /* ---------------- WEATHER API URL ---------------- */

    const url =
      `${baseUrl}/${location}` +
      `/last5days?key=${apiKey}&include=days`;

    /* ---------------- FETCH WEATHER DATA ---------------- */

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Failed to fetch weather data",
      });
    }

    const data = await response.json();

    /* ---------------- SAVE TO CACHE ---------------- */

    await setCache(cacheKey, data, 300);

    /* ---------------- SUCCESS RESPONSE ---------------- */

    return res.status(200).json({
      success: true,
      source: "weather-api",
      data,
    });

  } catch (error) {

    console.error("Weather Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export { getWeather };