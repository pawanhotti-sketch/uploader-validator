export async function POST(req) {
  const body = await req.json();

  const response = await fetch(`${process.env.N8N_BASE_URL}/webhook/bulk/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret": process.env.N8N_SECRET,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
