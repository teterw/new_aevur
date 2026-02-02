// app/api/baseline/route.js
import { NextResponse } from 'next/server';

let baseline = {
  mq135: null,
  mq138: null,
  threshold: 0.15, // 15% above baseline triggers alert
  lastReset: null,
};

export async function GET() {
  return NextResponse.json(baseline);
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.action === 'set') {
      // Set new baseline
      baseline = {
        mq135: Number(body.mq135) || null,
        mq138: Number(body.mq138) || null,
        threshold: Number(body.threshold) || 0.15,
        lastReset: Date.now(),
      };
      return NextResponse.json({ status: 'baseline set', baseline });
    }

    if (body.action === 'reset') {
      // Reset baseline
      baseline = {
        mq135: null,
        mq138: null,
        threshold: 0.15,
        lastReset: null,
      };
      return NextResponse.json({ status: 'baseline reset', baseline });
    }

    if (body.action === 'check') {
      // Check if values exceed baseline
      const mq135 = Number(body.mq135) || 0;
      const mq138 = Number(body.mq138) || 0;

      const alerts = [];
      const alertStatus = { 'MQ-135': false, 'MQ-138': false };

      if (baseline.mq135 !== null) {
        const threshold = baseline.mq135 * (1 + baseline.threshold);
        if (mq135 > threshold) {
          alertStatus['MQ-135'] = true;
          alerts.push(`High MQ-135 detected: ${mq135.toFixed(3)} (baseline: ${baseline.mq135.toFixed(3)})`);
        }
      }

      if (baseline.mq138 !== null) {
        const threshold = baseline.mq138 * (1 + baseline.threshold);
        if (mq138 > threshold) {
          alertStatus['MQ-138'] = true;
          alerts.push(`High MQ-138 detected: ${mq138.toFixed(3)} (baseline: ${baseline.mq138.toFixed(3)})`);
        }
      }

      return NextResponse.json({
        alerts,
        alertStatus,
        baselineSet: baseline.mq135 !== null || baseline.mq138 !== null,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export { baseline };
