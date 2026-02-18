"use client";

import { useEffect, useState, useCallback } from "react";
import Papa from "papaparse";
import Image from "next/image";

// --- Global Styles & Animations ---
const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap');

    :root {
      --primary-rgb: 59, 130, 246;
      --success-rgb: 16, 185, 129;
    }

    body {
      margin: 0;
      padding: 0;
      background: #f5f5f7;
      color: #1d1d1f;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    * {
      box-sizing: border-box;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes pulse-glow {
      0% {
        box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4);
        transform: scale(1);
      }
      50% {
        box-shadow: 0 0 20px 10px rgba(var(--primary-rgb), 0);
        transform: scale(1.05);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0);
        transform: scale(1);
      }
    }

    @keyframes pulse-glow-green {
      0% {
        box-shadow: 0 0 0 0 rgba(var(--success-rgb), 0.4);
        transform: scale(1);
      }
      50% {
        box-shadow: 0 0 20px 10px rgba(var(--success-rgb), 0);
        transform: scale(1.03);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(var(--success-rgb), 0);
        transform: scale(1);
      }
    }

    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(15px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .selection-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
      border-color: rgba(59, 130, 246, 0.5);
    }

    .logo-container:hover .tooltip {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `}</style>
);

// --- Components ---

const Spinner = () => (
  <div style={styles.spinnerWrapper}>
    const Spinner = () => (
  <div style={styles.spinnerWrapper}></div>
);

const PulsingButton = ({
  onClick,
  label,
  active,
  style = {},
  secondary = false,
  isDownload = false,
}) => (
  <button
    disabled={!active}
    style={{
      ...styles.btnBase,
      ...(secondary ? styles.btnSecondary : styles.btnPrimary),
      ...(active ? styles.btnActive : styles.btnDisabled),
      ...(active && !secondary ? styles.btnPulse : {}),
      ...(isDownload ? styles.btnDownload : {}),
      ...style,
    }}
    onClick={onClick}
  >
    {isDownload && <span style={{ marginRight: 8, fontSize: 16 }}>⬇</span>}
    {label}
  </button>
);

const CustomSelect = ({ value, onChange, options }) => (
  <div style={styles.selectWrapper}>
    <select style={styles.selectInput} value={value} onChange={onChange}>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <div style={styles.selectIcon}>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>
  </div>
);

const GlassCard = ({ children, style = {} }) => (
  <div style={{ ...styles.glassCard, ...style }}>{children}</div>
);

const SelectionCard = ({ icon, title, desc, onClick }) => (
  <div className="selection-card" style={styles.selectionCard} onClick={onClick}>
    <div style={styles.iconCircle}>{icon}</div>
    <h3 style={styles.headingMd}>{title}</h3>
    <p style={styles.textSm}>{desc}</p>
  </div>
);

// --- Validation Table ---

const ValidationTable = ({ rows, actionName, stage, onConfirm }) => {
  let columns = [];

  if (actionName === "Update Status") {
    columns = ["TMS ID", "Brand Name", "Service Type", "Updating Status To"];
    columns.push("Remark");

    if (stage === "result") {
      columns.push("Final Status");
    }
  } else {
    columns = ["Ticket ID", "Status", "Updated By", "Date Processed", "Error Log"];
  }
  const invalidRows = rows.filter(
  (r) => r.remark && !r.remark.toLowerCase().includes("ready")
);

const validRows = rows.filter(
  (r) => r.remark && r.remark.toLowerCase().includes("ready")
);

const hasInvalid = invalidRows.length > 0;

  return (
    <GlassCard style={styles.tableCard}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.headingLg}>
            {stage === "result" ? "Execution Result" : "Validation Result"}
          </h2>
          <p style={styles.subHeading}>
            {stage === "result"
              ? "Final status update results with remarks."
              : "Review the data before proceeding."}
          </p>
        </div>
        <span style={styles.badge}>
          {stage === "result" ? "Completed" : "Ready to Sync"}
        </span>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              {columns.map((h) => (
                <th key={h} style={styles.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                style={{
                  animation: `fade-in-up 0.3s ease ${i * 0.05}s backwards`,
                }}
              >
                {actionName === "Update Status" ? (
                  <>
                    <td style={styles.td}>{row.tmsId}</td>
                    <td style={styles.td}>{row.brand}</td>
                    <td style={styles.td}>{row.serviceType}</td>
                    <td style={{ ...styles.td, fontWeight: 700, color: "#10b981" }}>
                      {row.newStatus}
                    </td>

                    <td
  style={{
    ...styles.td,
    fontWeight: 600,
    color: row.remark?.toLowerCase().includes("ready")
      ? "#10b981"
      : row.remark
      ? "#ef4444"
      : "#6e6e73",
  }}
>
  {row.remark || "--"}
</td>

{stage === "result" && (
  <td
    style={{
      ...styles.td,
      fontWeight: 600,
      color: row.finalStatus?.toLowerCase().includes("success")
        ? "#10b981"
        : row.finalStatus
        ? "#ef4444"
        : "#6e6e73",
    }}
  >
    {row.finalStatus || "--"}
  </td>
)}

                  </>
                ) : (
                  <>
                    <td style={styles.td}>{row.ticketId}</td>
                    <td style={styles.td}>{row.status}</td>
                    <td style={styles.td}>{row.updatedBy}</td>
                    <td style={styles.td}>Just now</td>
                    <td style={{ ...styles.td, color: "#9ca3af" }}>--</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stage !== "result" && (
  <div style={styles.footerRow}>
    <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
      {hasInvalid ? (
        <>
          <PulsingButton
            label="Update Status for Valid Rows"
            active={validRows.length > 0}
            onClick={onConfirm}
            style={{ width: "auto", paddingLeft: 28, paddingRight: 28 }}
          />

          <PulsingButton
            label="Reupload Correct File"
            active={true}
            secondary={true}
            onClick={() => window.location.reload()}
            style={{ width: "auto", paddingLeft: 28, paddingRight: 28 }}
          />
        </>
      ) : (
        <PulsingButton
          label="Update Status"
          active={validRows.length > 0}
          onClick={onConfirm}
          style={{ width: "auto", paddingLeft: 32, paddingRight: 32 }}
        />
      )}
    </div>
  </div>
)}

 </GlassCard>
  );
};

// --- Tool Selection ---

const ToolSelector = ({
  selectedTool,
  setSelectedTool,
  bulkAction,
  setBulkAction,
  setBulkFile,
  handleBulkUpload,
  bulkFile,
  oldSiteRef,
  setOldSiteRef,
  handleFetchDetails,
  setQuickFile,
  handleQuickUpload,
  quickFile,
}) => {
  const handleDownloadFormat = () => {
    const headers = "TMS ID,Brand Name,Service Type,Update Status To";
    const rows = "TMS-1001,Livspace,Civil Interior,Closed\nTMS-1002,HomeLane,Installation,Open";

    const csvContent = `${headers}\n${rows}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "Bulk Status Update Format.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!selectedTool) {
    return (
      <div style={styles.selectionGrid}>
        <SelectionCard
          icon="📂"
          title="Bulk Action"
          desc="Process multiple records simultaneously."
          onClick={() => setSelectedTool("bulk")}
        />
        <div style={styles.verticalDivider} />
        <SelectionCard
          icon="⚡"
          title="Quick Create"
          desc="Create single tickets or upload batches."
          onClick={() => setSelectedTool("quick")}
        />
      </div>
    );
  }

  if (selectedTool === "bulk") {
    return (
      <div style={styles.formContainer}>
        <div style={styles.formHeader}>
          <button style={styles.backBtn} onClick={() => setSelectedTool(null)}>
            ← Back
          </button>
          <h3 style={styles.headingLg}>Bulk Action</h3>
        </div>

        <label style={styles.label}>Select Action</label>
        <CustomSelect
          value={bulkAction}
          onChange={(e) => setBulkAction(e.target.value)}
          options={["Update Status", "Update Fields", "Update Invoice Details"]}
        />

        {bulkAction === "Update Status" && (
          <div style={{ marginTop: 24, marginBottom: 8, animation: "fade-in 0.4s ease" }}>
            <PulsingButton
              label="Download Bulk Update Format"
              active={true}
              isDownload={true}
              onClick={handleDownloadFormat}
            />
          </div>
        )}

        <label style={styles.label}>Data Source</label>
        <div style={styles.fileDrop}>
          <input
            type="file"
            accept=".csv"
            style={styles.fileInput}
            onChange={(e) => setBulkFile(e.target.files?.[0])}
          />
          <span style={styles.fileName}>{bulkFile ? bulkFile.name : "Choose file..."}</span>
        </div>

        <div style={styles.btnWrapper}>
          <PulsingButton label="Process File" active={!!bulkFile} onClick={handleBulkUpload} />
        </div>
      </div>
    );
  }

  if (selectedTool === "quick") {
    return (
      <div style={styles.formContainer}>
        <div style={styles.formHeader}>
          <button style={styles.backBtn} onClick={() => setSelectedTool(null)}>
            ← Back
          </button>
          <h3 style={styles.headingLg}>Quick Create</h3>
        </div>

        <label style={styles.label}>Old Site Reference</label>
        <div style={styles.row}>
          <input
            style={styles.textInput}
            placeholder="BDI-XXXXX-XXXXX"
            value={oldSiteRef}
            onChange={(e) => setOldSiteRef(e.target.value)}
          />
        </div>

        <div style={styles.btnWrapper}>
          <PulsingButton
            label="Fetch Details"
            active={oldSiteRef.length > 3}
            secondary={true}
            onClick={handleFetchDetails}
          />
        </div>

        <div style={styles.orDivider}>or</div>

        <label style={styles.label}>Bulk Create Upload</label>
        <div style={styles.row}>
          <div style={{ ...styles.fileDrop, flex: 1 }}>
            <input
              type="file"
              style={styles.fileInput}
              onChange={(e) => setQuickFile(e.target.files?.[0])}
            />
            <span style={styles.fileName}>{quickFile ? quickFile.name : "Choose CSV..."}</span>
          </div>

          <PulsingButton
            label="Upload"
            active={!!quickFile}
            onClick={handleQuickUpload}
            style={{ width: "auto", padding: "0 24px" }}
          />
        </div>
      </div>
    );
  }
};

// --- Main Page ---

const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.map((row) => ({
          tmsId: row["TMS ID"]?.trim() || "",
          brand: row["Brand Name"]?.trim() || "",
          serviceType: row["Service Type"]?.trim() || "",
          newStatus: row["Update Status To"]?.trim() || "",
        }));

        resolve(rows);
      },
      error: (err) => reject(err),
    });
  });
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLanding, setIsLanding] = useState(true);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("empty");

  const [validCount, setValidCount] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);

  const [selectedTool, setSelectedTool] = useState(null);
  const [bulkAction, setBulkAction] = useState("Update Status");
  const [bulkFile, setBulkFile] = useState(null);

  const [oldSiteRef, setOldSiteRef] = useState("");
  const [quickFile, setQuickFile] = useState(null);

  const [validationRows, setValidationRows] = useState([]);
  const [batchId, setBatchId] = useState(null);
  const [stage, setStage] = useState("preview"); // preview | result

  useEffect(() => setMounted(true), []);

  const N8N_VALIDATE_URL = "https://n8n.wiffy.ai/webhook/Uploaded-File";

const handleBulkUpload = async () => {
  if (!bulkFile) return;

  try {
    setLoading(true);

    const rows = await parseCSV(bulkFile);

    const res = await fetch(N8N_VALIDATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: bulkAction,
        rows,
      }),
    });

    const data = await res.json();
    setBatchId(data.batchId);

    setValidationRows(data.rows); // returned from n8n
    setValidCount(data.validCount); // validated rows
    setInvalidCount(data.invalidCount);
    setStage("preview");

    setIsLanding(false);
    setViewMode("validation");
  } catch (err) {
    console.error(err);
    alert("Error processing file.");
  } finally {
    setLoading(false);
  }
};

  const handleConfirmRun = async () => {
    if (!batchId) {
      alert("Batch ID missing. Please re-upload the file.");
      return;
    }

    try {
      setLoading(true);

const res = await fetch("https://n8n.wiffy.ai/webhook/confirm-file", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    batchId,
    rows: validationRows.filter(
      (r) => r.remark && r.remark.toLowerCase().includes("ready")
    ),
  }),
});

      const data = await res.json();

      setValidationRows(data.rows);
      setStage("result");
    } catch (err) {
      console.error(err);
      alert("Error confirming update.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchDetails = () => {};
  const handleQuickUpload = () => {};

  const goHome = () => {
    setIsLanding(true);
    setSelectedTool(null);
    setBulkFile(null);
    setQuickFile(null);
    setOldSiteRef("");
    setViewMode("empty");
    setValidationRows([]);
    setBatchId(null);
    setStage("preview");
  };

  if (!mounted) return null;

  return (
    <div style={styles.page}>
      <GlobalStyles />
      <div style={styles.background} />

      <nav style={styles.navbar}>
        <div className="logo-container" style={styles.logoContainer} onClick={goHome}>
          <div style={styles.logoWrapper}>
            <Image
              src="https://wiffy.ai/_next/image?url=https%3A%2F%2Fstatic.wify.co.in%2Fimages%2FWiffy%2FWiffy-logo-2025.png&w=384&q=75"
              alt="Wiffy"
              width={70}
              height={70}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="tooltip" style={styles.tooltip}>
            Click me to reset
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        {isLanding && (
          <div style={styles.landingContainer}>
            {!selectedTool && (
              <div style={styles.heroText}>
                <h1 style={styles.heroTitle}>Ticket Portal</h1>
                <p style={styles.heroSubtitle}>Manage operations with speed and precision.</p>
              </div>
            )}

            <GlassCard style={styles.landingCard}>
              {loading ? (
                <div style={styles.loadingWrapper}>
                  <Spinner />
                  <p style={styles.loadingText}>Syncing Data...</p>
                </div>
              ) : (
                <ToolSelector
                  selectedTool={selectedTool}
                  setSelectedTool={setSelectedTool}
                  bulkAction={bulkAction}
                  setBulkAction={setBulkAction}
                  bulkFile={bulkFile}
                  setBulkFile={setBulkFile}
                  handleBulkUpload={handleBulkUpload}
                  oldSiteRef={oldSiteRef}
                  setOldSiteRef={setOldSiteRef}
                  handleFetchDetails={handleFetchDetails}
                  quickFile={quickFile}
                  setQuickFile={setQuickFile}
                  handleQuickUpload={handleQuickUpload}
                />
              )}
            </GlassCard>
          </div>
        )}

        {!isLanding && (
          <div style={styles.dashboardContainer}>
            <div style={{ ...styles.contentArea, maxWidth: viewMode === "validation" ? "100%" : 1100 }}>
              {viewMode === "validation" && (
                <ValidationTable
                  rows={validationRows}
                  actionName={bulkAction}
                  stage={stage}
                  onConfirm={handleConfirmRun}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Styles ---

const styles = {
  page: { minHeight: "100vh", position: "relative", overflowX: "hidden" },
  background: {
    position: "fixed",
    inset: 0,
    zIndex: -1,
    background:
      "radial-gradient(circle at 10% 20%, rgba(216, 230, 255, 1) 0%, rgba(240, 245, 255, 1) 90%)",
  },
  main: {
    paddingTop: 100,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
    width: "100%",
    margin: "0 auto",
  },
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: 110,
    display: "flex",
    alignItems: "center",
    padding: "0 40px",
    background: "rgba(255,255,255,0)",
    zIndex: 100,
  },
  logoContainer: {
    position: "relative",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logoWrapper: {
    borderRadius: "50%",
    overflow: "hidden",
    animation: "pulse-glow 3s infinite ease-in-out",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
    padding: 2,
    width: 74,
    height: 74,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tooltip: {
    position: "absolute",
    top: "115%",
    left: "50%",
    transform: "translateX(-50%) translateY(10px)",
    background: "rgba(0,0,0,0.8)",
    color: "white",
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    pointerEvents: "none",
    opacity: 0,
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
  landingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    gap: 32,
  },
  heroText: { textAlign: "center", animation: "fade-in 0.5s ease" },
  heroTitle: {
    fontSize: 48,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    marginBottom: 12,
    background: "linear-gradient(135deg, #1d1d1f 0%, #4b5563 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: { fontSize: 20, color: "#86868b", fontWeight: 400 },
  landingCard: {
    width: "100%",
    maxWidth: 960,
    padding: 48,
    borderRadius: 32,
    display: "flex",
    flexDirection: "column",
    minHeight: 400,
    justifyContent: "center",
  },
  selectionGrid: {
    display: "flex",
    gap: 40,
    width: "100%",
    justifyContent: "center",
    animation: "fade-in-up 0.4s ease",
  },
  selectionCard: {
    flex: 1,
    padding: 32,
    borderRadius: 24,
    background: "rgba(255,255,255,0.4)",
    border: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  formContainer: {
    maxWidth: 500,
    width: "100%",
    margin: "0 auto",
    animation: "fade-in 0.3s ease",
  },
  formHeader: { display: "flex", alignItems: "center", marginBottom: 24, gap: 16 },
  backBtn: {
    background: "none",
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    color: "#0071e3",
    cursor: "pointer",
    padding: 0,
  },
  glassCard: {
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(50px)",
    WebkitBackdropFilter: "blur(50px)",
    borderRadius: 24,
    border: "1px solid rgba(255, 255, 255, 0.6)",
    boxShadow:
      "0 20px 40px -10px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.5) inset",
    overflow: "hidden",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    marginBottom: 16,
  },
  verticalDivider: {
    width: 1,
    background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.1), transparent)",
    margin: "0 10px",
  },
  dashboardContainer: { display: "flex", justifyContent: "center", width: "100%" },
  contentArea: { width: "100%", margin: "0 auto", animation: "fade-in-up 0.4s ease" },
  headingLg: { fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 },
  headingMd: { fontSize: 18, fontWeight: 600, marginBottom: 6, color: "#1d1d1f" },
  subHeading: { fontSize: 15, color: "#6e6e73", marginTop: 4 },
  textSm: { fontSize: 14, color: "#6e6e73", marginBottom: 0, lineHeight: 1.4 },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#1d1d1f",
    marginBottom: 8,
    display: "block",
    marginTop: 16,
  },
  textInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.1)",
    background: "rgba(255,255,255,0.8)",
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s",
    color: "#1d1d1f",
  },
  selectWrapper: { position: "relative", width: "100%" },
  selectInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.1)",
    background: "rgba(255,255,255,0.8)",
    fontSize: 14,
    outline: "none",
    appearance: "none",
    cursor: "pointer",
    color: "#1d1d1f",
  },
  selectIcon: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "#86868b",
  },
  fileDrop: {
    position: "relative",
    width: "100%",
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px dashed rgba(0,0,0,0.2)",
    background: "rgba(255,255,255,0.4)",
    display: "flex",
    alignItems: "center",
    transition: "border 0.2s",
  },
  fileInput: { position: "absolute", inset: 0, opacity: 0, cursor: "pointer" },
  fileName: {
    fontSize: 13,
    color: "#6e6e73",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  btnWrapper: { marginTop: 24, width: "100%" },
  btnBase: {
    width: "100%",
    padding: "14px 20px",
    borderRadius: 14,
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    background: "#0071e3",
    color: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 113, 227, 0.3)",
  },
  btnSecondary: {
    background: "rgba(0,0,0,0.05)",
    color: "#1d1d1f",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  btnDownload: {
    background: "#10b981",
    color: "#ffffff",
    animation: "pulse-glow-green 2s infinite cubic-bezier(0.4, 0, 0.6, 1)",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
  },
  btnActive: { opacity: 1, transform: "scale(1)" },
  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    background: "#e5e5e5",
    color: "#a1a1a6",
    boxShadow: "none",
    animation: "none",
  },
  btnPulse: { animation: "pulse-glow 2s infinite cubic-bezier(0.4, 0, 0.6, 1)" },
  orDivider: {
    width: "100%",
    textAlign: "center",
    margin: "24px 0",
    fontSize: 12,
    color: "#86868b",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  row: { display: "flex", gap: 12, alignItems: "center", width: "100%" },
  tableCard: { padding: 32, width: "100%" },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  tableContainer: { overflowX: "auto", width: "100%" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 800 },
  th: {
    textAlign: "left",
    padding: "16px 8px",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    fontSize: 12,
    fontWeight: 600,
    color: "#86868b",
    textTransform: "uppercase",
  },
  td: {
    padding: "16px 8px",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    fontSize: 14,
    color: "#1d1d1f",
  },
  footerRow: { marginTop: 32, display: "flex", justifyContent: "flex-end" },
  loadingWrapper: { display: "flex", flexDirection: "column", alignItems: "center", padding: 60 },
  spinnerWrapper: {
    width: 40,
    height: 40,
    border: "4px solid rgba(0,0,0,0.1)",
    borderTopColor: "#0071e3",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { marginTop: 16, fontSize: 15, fontWeight: 500, color: "#86868b" },
  badge: {
    padding: "6px 12px",
    background: "rgba(0, 113, 227, 0.1)",
    color: "#0071e3",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
};
