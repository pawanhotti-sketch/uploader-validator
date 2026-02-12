"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleValidate() {
    if (!file) {
      alert("Please upload a CSV or Excel file first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(process.env.NEXT_PUBLIC_VALIDATE_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Validation failed. Check webhook URL or n8n.");
      console.error(err);
    }

    setLoading(false);
  }

  async function handleUpdate() {
    if (!result || result.status !== "success") {
      alert("Validation is not successful. Cannot update.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_UPDATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      });

      const data = await res.json();
      alert("Update Response: " + JSON.stringify(data));
    } catch (err) {
      alert("Update failed. Check n8n update workflow.");
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "50px",
        fontFamily: "Arial",
        background: "#f4f4f5",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "26px", marginBottom: "10px" }}>
          📂 Excel/CSV Validator
        </h1>

        <p style={{ color: "#555", marginBottom: "20px" }}>
          Upload your file, validate it, and if everything looks good, click
          Update to trigger the API call.
        </p>

        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            width: "100%",
          }}
        />

        <button
          onClick={handleValidate}
          disabled={loading}
          style={{
            marginTop: "20px",
            padding: "12px 18px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "#111827",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {loading ? "⏳ Validating..." : "Submit for Validation"}
        </button>

        {result && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ fontSize: "20px" }}>📊 Validation Result</h2>

            <div
              style={{
                marginTop: "10px",
                padding: "15px",
                borderRadius: "10px",
                background: "#f9fafb",
                border: "1px solid #eee",
              }}
            >
              <pre style={{ fontSize: "14px", overflowX: "auto" }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            {result.status === "success" && (
              <button
                onClick={handleUpdate}
                disabled={loading}
                style={{
                  marginTop: "20px",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  background: "#16a34a",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {loading ? "🚀 Updating..." : "Update"}
              </button>
            )}

            {result.status !== "success" && (
              <p style={{ marginTop: "15px", color: "red" }}>
                ❌ Validation failed. Fix errors and upload again.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
