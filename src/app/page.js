"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [actionType, setActionType] = useState("create");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleValidate() {
    if (!file) return alert("Please upload a CSV/Excel file.");
    if (!projectName.trim()) return alert("Please enter Project Name.");

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectName", projectName);
      formData.append("actionType", actionType);

      const res = await fetch(process.env.NEXT_PUBLIC_VALIDATE_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Validation failed. Check your n8n webhook.");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          actionType,
          validationResult: result,
        }),
      });

      const data = await res.json();
      alert("Update Response: " + JSON.stringify(data));
    } catch (err) {
      console.error(err);
      alert("Update failed. Check your update webhook workflow.");
    }

    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>📊 Upload & Validate</h1>
          <p style={styles.subtitle}>
            Upload your Excel/CSV file, validate it instantly, then click Update
            to push data to the API.
          </p>
        </header>

        <div style={styles.card}>
          <label style={styles.label}>Project Name</label>
          <input
            style={styles.input}
            placeholder="Eg: TMS Users India - Jan 26"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <label style={styles.label}>Action Type</label>
          <select
            style={styles.input}
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            <option value="create">Create Records</option>
            <option value="update">Update Existing Records</option>
            <option value="delete">Delete Records</option>
          </select>

          <label style={styles.label}>Upload File</label>
          <input
            style={styles.fileInput}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button style={styles.primaryBtn} onClick={handleValidate} disabled={loading}>
            {loading ? "⏳ Validating..." : "Validate File"}
          </button>
        </div>

        {result && (
          <div style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <h2 style={styles.resultTitle}>Validation Result</h2>
              <span
                style={{
                  ...styles.badge,
                  background:
                    result.status === "success" ? "#16a34a" : "#dc2626",
                }}
              >
                {result.status === "success" ? "SUCCESS" : "FAILED"}
              </span>
            </div>

            <pre style={styles.resultBox}>
              {JSON.stringify(result, null, 2)}
            </pre>

            {result.status === "success" && (
              <button
                style={styles.updateBtn}
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "🚀 Updating..." : "Update"}
              </button>
            )}

            {result.status !== "success" && (
              <p style={styles.errorText}>
                ❌ Fix the errors and upload again.
              </p>
            )}
          </div>
        )}

        <footer style={styles.footer}>
          Built with React + Next.js + n8n. Humans still required.
        </footer>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
    padding: "50px 20px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "25px",
  },
  title: {
    fontSize: "34px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#374151",
    maxWidth: "650px",
    lineHeight: "1.6",
  },
  card: {
    background: "white",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  label: {
    display: "block",
    marginTop: "15px",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
  },
  fileInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
    background: "#f8fafc",
    fontSize: "14px",
  },
  primaryBtn: {
    marginTop: "22px",
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    background: "#111827",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
  },
  resultCard: {
    marginTop: "30px",
    background: "white",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  resultTitle: {
    fontSize: "20px",
    fontWeight: "800",
    margin: 0,
    color: "#111827",
  },
  badge: {
    padding: "6px 12px",
    borderRadius: "999px",
    color: "white",
    fontWeight: "800",
    fontSize: "12px",
    letterSpacing: "0.5px",
  },
  resultBox: {
    background: "#0b1220",
    color: "#d1d5db",
    padding: "15px",
    borderRadius: "14px",
    fontSize: "13px",
    overflowX: "auto",
    lineHeight: "1.6",
  },
  updateBtn: {
    marginTop: "18px",
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    background: "#16a34a",
    color: "white",
    fontWeight: "800",
    fontSize: "15px",
  },
  errorText: {
    marginTop: "15px",
    color: "#dc2626",
    fontWeight: "700",
  },
  footer: {
    marginTop: "25px",
    textAlign: "center",
    fontSize: "13px",
    color: "#6b7280",
  },
};
