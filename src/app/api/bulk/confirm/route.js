export async function GET() {
  return Response.json({ message: "Confirm API working (GET)" });
}

export async function POST(req) {
  const body = await req.json();
  const { batchId } = body;

  return Response.json({
    batchId,
    rows: [
      {
        tmsId: "TMS-1001",
        brand: "Livspace",
        serviceType: "Civil Interior",
        newStatus: "Closed",
        remark: "Successfully updated"
      }
    ]
  });
}
