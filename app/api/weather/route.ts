import { WeatherDataFromApi } from "@/lib/types";

export async function GET() {
    const weatherRes = await fetch(`${process.env.WEATHER_API_URL}/weather`, {
        headers: {
            "X-API-Key": process.env.WEATHER_API_KEY || "",
        },
        next: {
            revalidate: 60, // Revalidate every 60 seconds
        },
    });

    if (!weatherRes.ok) {
        return Response.json({ error: "Failed to fetch weather" }, {
            status: 500,
        });
    }

    const weatherJson = await weatherRes.json() as { data: WeatherDataFromApi };
    return Response.json(weatherJson.data);
}
