// app/api/arduino/route.js
import { NextResponse } from 'next/server';

let latestData = {
  mq135: 0,
  mq138: 0,
  uptime: 0,
  lastUpdate: null,
};

export async function POST(req) {
  try {
    const body = await req.json();

    latestData = {
      mq135: Number(body.mq135),
      mq138: Number(body.mq138),
      uptime: Number(body.uptime),
      lastUpdate: Date.now(),
    };

    return NextResponse.json({ status: 'ok' });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(latestData);
}

// export for direct import if needed
export { latestData };
