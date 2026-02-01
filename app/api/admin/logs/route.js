// This file has been moved to /api/logs/route.js
// For backward compatibility, redirect to the new location

export async function GET(request) {
  return new Response(
    JSON.stringify({ message: "Moved to /api/logs" }),
    { status: 301, headers: { Location: "/api/logs" } }
  );
}

export async function POST(request) {
  return new Response(
    JSON.stringify({ message: "Moved to /api/logs" }),
    { status: 301, headers: { Location: "/api/logs" } }
  );
}
