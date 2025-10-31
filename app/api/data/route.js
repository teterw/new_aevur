let latestMessage = "No data yet";

export async function POST(req) {
  const body = await req.json();
  console.log("Received:", body);
  latestMessage = body.message || "No message";
  return new Response(JSON.stringify({ status: "ok" }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  return new Response(JSON.stringify({ message: latestMessage }), {
    headers: { "Content-Type": "application/json" },
  });
}
