"use client";

import { useState } from "react";

export default function Home() {
  const [vertical, setVertical] = useState("MKW Installation");
  const [action, setAction] = useState("Update Status");

  const [file, setFile] = useState(null);
  const [oldSiteRef, setOldSiteRef] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  // Customer Details
  const [mobile, setMobile] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");

  // Address Details
  const [flatNo, setFlatNo] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Specific Details
  const [clientId, setClientId] = useState("");
  const [businessUnit, setBusinessUnit] = useState("MKW");
  const [workType, setWorkType] = useState("");
  const [siteType, setSiteType] = useState("");

  const showFileUpload = action === "Update Status" || action === "Update Fields";
  const showOldSiteRefFlow = action === "Snag Site" || action === "Other";

  function resetForm() {
    setFile(null);
    setOldSiteRef("");
    setResult(null);
    setShowDetails(false);

    setMobile("");
    setCustomerName("");
    setEmail("");

    setFlatNo("");
    setBuildingName("");
    setLine1("");
    setLine2("");
    setPincode("");
    setCity("");
    setState("");

    setClientId("");
    setBusinessUnit("MKW");
    setWorkType("");
    setSiteType("");
  }

  async function handleValidate() {
    setResult(null);

    if (!file) return alert("Please upload a CSV/Excel file.");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("vertical", vertical);
      formData.append("action", action);
      formData.append("file", file);

      const res = await fetch(process.env.NEXT_PUBLIC_VALIDATE_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Validation failed. Check your n8n workflow.");
    }

    setLoading(false);
  }

  async function handleFetchDetails() {
    if (!oldSiteRef.trim()) return alert("Please enter Old Site Ref.");

    setLoading(true);
    setResult(null);

    try {
      // Later: Replace this with n8n webhook call
      // const res = await fetch(process.env.NEXT_PUBLIC_FETCH_DETAILS_URL, {...})

      // Dummy response
      const dummyResponse = {
        status: "success",
        customer: {
          mobile: "9999999999",
          name: "Rahul-Jiwane",
          email: "rahul@email.com",
        },
        address: {
          flatNo: "",
          buildingName: "3001/Vairat, Piramal Vaikunth",
          line1: "Kolshet Industrial Area",
          line2: "",
          pincode: "400607",
          city: "Thane",
          state: "MAHARASHTRA",
        },
        specificDetails: {
          clientId: "16630",
          businessUnit: "MKW",
          workType: "Snag for Wify",
          siteType: "Retail",
        },
      };

      setMobile(dummyResponse.customer.mobile);
      setCustomerName(dummyResponse.customer.name);
      setEmail(dummyResponse.customer.email);

      setFlatNo(dummyResponse.address.flatNo);
      setBuildingName(dummyResponse.address.buildingName);
      setLine1(dummyResponse.address.line1);
      setLine2(dummyResponse.address.line2);
      setPincode(dummyResponse.address.pincode);
      setCity(dummyResponse.address.city);
      setState(dummyResponse.address.state);

      setClientId(dummyResponse.specificDetails.clientId);
      setBusinessUnit(dummyResponse.specificDetails.businessUnit);
      setWorkType(dummyResponse.specificDetails.workType);
      setSiteType(dummyResponse.specificDetails.siteType);

      setShowDetails(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch details.");
    }

    setLoading(false);
  }

  async function handleCreateTicket() {
    if (!customerName.trim()) return alert("Customer name is required.");
    if (!pincode.trim()) return alert("Pincode is required.");

    setLoading(true);

    try {
      // Later: Call n8n webhook to create ticket
      // const res = await fetch(process.env.NEXT_PUBLIC_CREATE_TICKET_URL, {...})

      const payload = {
        vertical,
        action,
        oldSiteRef,
        customer: {
          mobile,
          name: customerName,
          email,
        },
        address: {
          flatNo,
          buildingName,
          line1,
          line2,
          pincode,
          city,
          state,
        },
        specificDetails: {
          clientId,
          businessUnit,
          workType,
          siteType,
        },
      };

      alert("Ticket payload ready:\n\n" + JSON.stringify(payload, null, 2));
    } catch (err) {
      console.error(err);
      alert("Create ticket failed.");
    }

    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>📌 Ticket Automation Portal</h1>
          <p style={styles.subtitle}>
            Select a vertical, choose an action, upload file or fetch site details,
            and create ticket seamlessly.
          </p>
        </header>

        <div style={styles.card}>
          <label style={styles.label}>Vertical</label>
          <select
            style={styles.input}
            value={vertical}
            onChange={(e) => setVertical(e.target.value)}
          >
            <option value="MKW Installation">MKW Installation</option>
            <option value="MKW Services">MKW Services</option>
            <option value="Other">Other</option>
          </select>

          <label style={styles.label}>Action</label>
          <select
            style={styles.input}
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              resetForm();
            }}
          >
            <option value="Update Status">Update Status</option>
            <option value="Update Fields">Update Fields</option>
            <option value="Snag Site">Snag Site</option>
            <option value="Other">Other</option>
          </select>

          {showFileUpload && (
            <>
              <label style={styles.label}>Upload File</label>
              <input
                style={styles.fileInput}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button
                style={styles.primaryBtn}
                onClick={handleValidate}
                disabled={loading}
              >
                {loading ? "⏳ Validating..." : "Validate File"}
              </button>
            </>
          )}

          {showOldSiteRefFlow && (
            <>
              <label style={styles.label}>Old Site Ref</label>
              <input
                style={styles.input}
                placeholder="Enter Old Site Reference"
                value={oldSiteRef}
                onChange={(e) => setOldSiteRef(e.target.value)}
              />

              <button
                style={styles.secondaryBtn}
                onClick={handleFetchDetails}
                disabled={loading}
              >
                {loading ? "⏳ Fetching..." : "Fetch Details"}
              </button>
            </>
          )}
        </div>

        {showDetails && (
          <>
            {/* Customer Details */}
            <div style={styles.sectionCard}>
              <h2 style={styles.sectionTitle}>Customer Details</h2>

              <div style={styles.grid2}>
                <div>
                  <label style={styles.label}>Mobile (+91)</label>
                  <input
                    style={styles.input}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

                <div>
                  <label style={styles.label}>Name</label>
                  <input
                    style={styles.input}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={styles.label}>Email</label>
                  <input
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div style={styles.sectionCard}>
              <h2 style={styles.sectionTitle}>Address</h2>

              <div style={styles.grid2}>
                <div>
                  <label style={styles.label}>Flat No</label>
                  <input
                    style={styles.input}
                    value={flatNo}
                    onChange={(e) => setFlatNo(e.target.value)}
                  />
                </div>

                <div>
                  <label style={styles.label}>Building / Apartment Name</label>
                  <input
                    style={styles.input}
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={styles.label}>Line 1</label>
                  <input
                    style={styles.input}
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                  />
                </div>

                <div>
                  <label style={styles.label}>Line 2</label>
                  <input
                    style={styles.input}
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                  />
                </div>

                <div>
                  <label style={styles.label}>Pincode</label>
                  <input
                    style={styles.input}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>

                <div>
                  <label style={styles.label}>City</label>
                  <input
                    style={styles.input}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div>
                  <label style={styles.label}>State</label>
                  <input
                    style={styles.input}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Specific Details */}
            <div style={styles.sectionCard}>
              <h2 style={styles.sectionTitle}>Specific Details</h2>

              <div style={styles.grid2}>
                <div>
                  <label style={styles.label}>Client ID</label>
                  <input
                    style={styles.input}
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                </div>

                <div>
                  <label style={styles.label}>Business Unit</label>
                  <input
                    style={styles.input}
                    value={businessUnit}
                    onChange={(e) => setBusinessUnit(e.target.value)}
                  />
                </div>

                <div>
                  <label style={styles.label}>Work Type</label>
                  <input
                    style={styles.input}
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                  />
                </div>

                <div>
                  <label style={styles.label}>Site Type</label>
                  <input
                    style={styles.input}
                    value={siteType}
                    onChange={(e) => setSiteType(e.target.value)}
                  />
                </div>
              </div>

              <button
                style={styles.createBtn}
                onClick={handleCreateTicket}
                disabled={loading}
              >
                {loading ? "⏳ Creating..." : "Create Ticket"}
              </button>
            </div>
          </>
        )}

        {result && (
          <div style={styles.resultCard}>
            <h2 style={styles.sectionTitle}>Validation Result</h2>
            <pre style={styles.resultBox}>
              {JSON.stringify(result, null, 2)}
            </pre>
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
    maxWidth: "1000px",
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
    maxWidth: "750px",
    lineHeight: "1.6",
  },
  card: {
    background: "white",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  sectionCard: {
    marginTop: "25px",
    background: "white",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "15px",
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
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
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
  secondaryBtn: {
    marginTop: "18px",
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
  },
  createBtn: {
    marginTop: "22px",
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
  resultCard: {
    marginTop: "25px",
    background: "white",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.05)",
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
  footer: {
    marginTop: "25px",
    textAlign: "center",
    fontSize: "13px",
    color: "#6b7280",
  },
};
