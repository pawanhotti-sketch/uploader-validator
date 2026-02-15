export async function GET() {
  return Response.json({ message: "Validate API working (GET)" });
}

export async function POST(req) {
  return Response.json({
    batchId: "TEST_BATCH_123",
    rows: [
      {
        tmsId: "TMS-1001",
        brand: "Livspace",
        serviceType: "Civil Interior",
        newStatus: "Closed"
      }
    ]
  });
}
