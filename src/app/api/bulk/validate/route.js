export async function POST(req) {
  const body = await req.json();

  const n8nRes = await fetch(`${process.env.N8N_BASE_URL}/webhook/bulk/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET,
    },
    body: JSON.stringify(body),
  });

  const data = await n8nRes.json();

  return Response.json(data, { status: n8nRes.status });
}
