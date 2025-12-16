// app/api/data/route.ts
import { latestData } from "../arduino/route";

export async function GET() {
  const now = Date.now();

  const connected =
    latestData.lastUpdate &&
    now - latestData.lastUpdate < 10_000; // 10 sec timeout

  return Response.json({
    readings: {
      "MQ-135": latestData.mq135,
      "MQ-138": latestData.mq138,
    },
    status:
      latestData.uptime < 30 ? "WARMING" : "READY",
    connected,
    lastUpdate: latestData.lastUpdate,
  });
}
