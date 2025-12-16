// app/api/arduino/route.js
import { NextResponse } from 'next/server';

let latestData = {
  mq135: 0,
  mq138: 0,
  uptime: 0,
  lastUpdate: 0
};

export async function POST(req) {
  const body = await req.json();

  latestData = {
    ...body,
    lastUpdate: Date.now()
  };

  return NextResponse.json({ status: 'ok' });
}

export async function GET() {
  return NextResponse.json(latestData);
}
