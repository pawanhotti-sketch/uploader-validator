"use client";

import { useState } from "react";

export default function Home() {
  const [vertical, setVertical] = useState("MKW Installation");
  const [action, setAction] = useState("Snag Site");

  const [oldSiteRef, setOldSiteRef] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  // Customer Information
  const [mobile, setMobile] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");

  // Address
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
  const [workType, setWorkType] = useState("Snag for Wify");
  const [siteType, setSiteType] = useState("Retail");

  const showOldSiteRefFlow = action === "Snag Site" || action === "Other";

  function resetAll() {
    setOldSiteRef("");
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
    setWorkType("Snag for Wify");
    setSiteType("Retail");
  }

  async function handleFetchDetails() {
    if (!oldSiteRef.trim()) return alert("Please enter Old Site Ref.");

    setLoading(true);

    try {
      // Later: Replace with n8n webhook fetch call
      // const res = await fetch(process.env.NEXT_PUBLIC_FETCH_DETAILS_URL, { method: "POST", ... })

      // Dummy data (UI testing)
      const dummy = {
        customer: {
          mobile: "9876543210",
          name: "Kiran-Koli",
          email: "",
        },
        address: {
          flatNo: "301",
          buildingName: "Bheema Aai Niwas",
          line1: "Pushpak",
          line2: "",
          pincode: "410206",
          city: "Raigarh(MH)",
          state: "MAHARASHTRA",
        },
        specific: {
          clientId: "15362",
          businessUnit: "MKW",
          workType: "Snag for Wify",
          siteType: "Retail",
        },
      };

      setMobile(dummy.customer.mobile);
      setCustomerName(dummy.customer.name);
      setEmail(dummy.customer.email);

      setFlatNo(dummy.address.flatNo);
      setBuildingName(dummy.address.buildingName);
      setLine1(dummy.address.line1);
      setLine2(dummy.address.line2);
      setPincode(dummy.address.pincode);
      setCity(dummy.address.city);
      setState(dummy.address.state);

      setClientId(dummy.specific.clientId);
      setBusinessUnit(dummy.specific.businessUnit);
      setWorkType(dummy.specific.workType);
      setSiteType(dummy.specific.siteType);

      setShowDetails(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch details.");
    }

    setLoading(false);
  }

  async function handleCreateTicket() {
    if (!customerName.trim()) return alert("Customer Name is required.");
    if (!pincode.trim()) return alert("Pincode is required.");
    if (!clientId.trim()) return alert("Client ID is required.");

    setLoading(true);

    try {
      const payload = {
        vertical,
        action,
        oldSiteRef,
        customer: { mobile, name: customerName, email },
        address: { flatNo, buildingName, line1, line2, pincode, city, state },
        specificDetails: { clientId, businessUnit, workType, siteType },
      };

      alert("Payload Ready:\n\n" + JSON.stringify(payload, null, 2));
    } catch (err) {
      console.error(err);
      alert("Ticket creation failed.");
    }

    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* TOP CARD */}
        <div style={styles.topCard}>
          <h1 style={styles.pageTitle}>Ticket Portal</h1>
          <p style={styles.pageSubTitle}>
            Fetch old site details and create a new ticket with minimal effort.
          </p>

          <div style={styles.row3}>
            <div>
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
            </div>

            <div>
              <label style={styles.label}>Action</label>
              <select
                style={styles.input}
                value={action}
                onChange={(e) => {
                  setAction(e.target.value);
                  resetAll();
                }}
              >
                <option value="Update Status">Update Status</option>
                <option value="Update Fields">Update Fields</option>
                <option value="Snag Site">Snag Site</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {showOldSiteRefFlow && (
              <div>
                <label style={styles.label}>
                  <span style={styles.req}>*</span> Old Site Ref
                </label>
                <input
                  style={styles.input}
                  placeholder="BDI-XXXXX-XXXXX"
                  value={oldSiteRef}
                  onChange={(e) => setOldSiteRef(e.target.value)}
                />
              </div>
            )}
          </div>

          {showOldSiteRefFlow && (
            <div style={{ marginTop: "14px" }}>
              <button
                style={styles.primaryBtn}
                onClick={handleFetchDetails}
                disabled={loading}
              >
                {loading ? "Fetching..." : "Fetch Details"}
              </button>
            </div>
          )}
        </div>

        {/* CUSTOMER DETAILS */}
        {showDetails && (
          <>
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionHeaderText}>Customer Details</span>
              </div>

              <div style={styles.sectionBody}>
                <div style={styles.twoCol}>
                  {/* Customer Info */}
                  <div style={styles.box}>
                    <div style={styles.boxTitle}>Customer information</div>

                    <button style={styles.smallBtn}>📞 Call Now</button>

                    <label style={styles.smallLabel}>Mobile(+91)</label>
                    <input
                      style={styles.smallInput}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />

                    <label style={styles.smallLabel}>
                      <span style={styles.req}>*</span> Name
                    </label>
                    <input
                      style={styles.smallInput}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />

                    <label style={styles.smallLabel}>Email</label>
                    <input
                      style={styles.smallInput}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Address */}
                  <div style={styles.box}>
                    <div style={styles.boxTitle}>Address</div>

                    <div style={styles.inlineActions}>
                      <span style={styles.link}>⟳ Refresh Location Groups</span>
                      <span style={styles.badge}>BOM</span>
                    </div>

                    <label style={styles.smallLabel}>
                      Search your building/street name
                    </label>

                    <div style={styles.searchRow}>
                      <input
                        style={styles.searchInput}
                        placeholder="Enter a location"
                      />
                      <button style={styles.searchBtn}>🔍</button>
                    </div>

                    <div style={styles.inlineActions2}>
                      <span style={styles.link}>Reset Address</span>
                      <span style={styles.link}>📍 View on map</span>
                    </div>

                    <div style={styles.grid2}>
                      <div>
                        <label style={styles.smallLabel}>Flat no</label>
                        <input
                          style={styles.smallInput}
                          value={flatNo}
                          onChange={(e) => setFlatNo(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={styles.smallLabel}>
                          Building/Apartment name
                        </label>
                        <input
                          style={styles.smallInput}
                          value={buildingName}
                          onChange={(e) => setBuildingName(e.target.value)}
                        />
                      </div>
                    </div>

                    <label style={styles.smallLabel}>Line 1</label>
                    <input
                      style={styles.smallInput}
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                    />

                    <label style={styles.smallLabel}>Line 2</label>
                    <input
                      style={styles.smallInput}
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                    />

                    <div style={styles.grid3}>
                      <div>
                        <label style={styles.smallLabel}>
                          <span style={styles.req}>*</span> Pincode
                        </label>
                        <input
                          style={styles.smallInput}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={styles.smallLabel}>City</label>
                        <input
                          style={styles.smallInput}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={styles.smallLabel}>State</label>
                        <input
                          style={styles.smallInput}
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SPECIFIC DETAILS */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionHeaderText}>Specific Details</span>
              </div>

              <div style={styles.sectionBody}>
                <div style={styles.grid4}>
                  <div>
                    <label style={styles.smallLabel}>
                      <span style={styles.req}>*</span> Client ID
                    </label>
                    <input
                      style={styles.smallInput}
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={styles.smallLabel}>Sqft By Customer</label>
                    <input style={styles.smallInput} placeholder="-" />
                  </div>

                  <div>
                    <label style={styles.smallLabel}>Material Delivered</label>
                    <select style={styles.smallInput}>
                      <option>Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>

                  <div>
                    <label style={styles.smallLabel}>Client ID</label>
                    <input style={styles.smallInput} value={clientId} readOnly />
                  </div>
                </div>

                <div style={styles.grid4}>
                  <div>
                    <label style={styles.smallLabel}>
                      <span style={styles.req}>*</span> Business Unit
                    </label>
                    <select
                      style={styles.smallInput}
                      value={businessUnit}
                      onChange={(e) => setBusinessUnit(e.target.value)}
                    >
                      <option value="MKW">MKW</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={styles.smallLabel}>
                      <span style={styles.req}>*</span> Work Type
                    </label>
                    <select
                      style={styles.smallInput}
                      value={workType}
                      onChange={(e) => setWorkType(e.target.value)}
                    >
                      <option value="Snag for Wify">Snag for Wify</option>
                      <option value="Installation">Installation</option>
                      <option value="Service">Service</option>
                    </select>
                  </div>

                  <div>
                    <label style={styles.smallLabel}>
                      <span style={styles.req}>*</span> Site Type
                    </label>
                    <select
                      style={styles.smallInput}
                      value={siteType}
                      onChange={(e) => setSiteType(e.target.value)}
                    >
                      <option value="Retail">Retail</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Residential">Residential</option>
                    </select>
                  </div>

                  <div>
                    <label style={styles.smallLabel}>
                      <span style={styles.req}>*</span> Old Site Ref
                    </label>
                    <input style={styles.smallInput} value={oldSiteRef} readOnly />
                  </div>
                </div>

                <div style={{ marginTop: "18px" }}>
                  <button
                    style={styles.createBtn}
                    onClick={handleCreateTicket}
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Ticket"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div style={styles.footer}>
          Internal portal. Built fast. Tested later. Classic.
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f9",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  topCard: {
    background: "white",
    border: "1px solid #dfe3e8",
    borderRadius: "6px",
    padding: "18px",
    marginBottom: "18px",
  },

  pageTitle: {
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
    color: "#111827",
  },

  pageSubTitle: {
    fontSize: "12px",
    marginTop: "6px",
    marginBottom: "18px",
    color: "#4b5563",
  },

  row3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
  },

  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#111827",
  },

  input: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "4px",
    border: "1px solid #cfd6dd",
    fontSize: "12px",
    background: "white",
  },

  primaryBtn: {
    padding: "9px 14px",
    background: "#0b5ed7",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "600",
    cursor: "pointer",
  },

  section: {
    background: "white",
    border: "1px solid #dfe3e8",
    borderRadius: "6px",
    marginBottom: "18px",
  },

  sectionHeader: {
    padding: "10px 14px",
    borderBottom: "1px solid #dfe3e8",
    background: "#f9fafb",
    fontWeight: "700",
    fontSize: "13px",
  },

  sectionHeaderText: {
    color: "#111827",
  },

  sectionBody: {
    padding: "14px",
  },

  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },

  box: {
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "14px",
    background: "white",
  },

  boxTitle: {
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "6px",
  },

  smallLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    marginTop: "10px",
    marginBottom: "6px",
    color: "#111827",
  },

  smallInput: {
    width: "100%",
    padding: "7px 10px",
    borderRadius: "4px",
    border: "1px solid #cfd6dd",
    fontSize: "12px",
    background: "white",
  },

  smallBtn: {
    padding: "6px 10px",
    background: "#0b5ed7",
    border: "none",
    borderRadius: "4px",
    color: "white",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "10px",
  },

  inlineActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },

  inlineActions2: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    marginBottom: "10px",
  },

  link: {
    fontSize: "11px",
    color: "#0b5ed7",
    cursor: "pointer",
    fontWeight: "600",
  },

  badge: {
    fontSize: "10px",
    background: "#d1fae5",
    color: "#065f46",
    padding: "2px 8px",
    borderRadius: "10px",
    fontWeight: "700",
  },

  searchRow: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    padding: "7px 10px",
    borderRadius: "4px",
    border: "1px solid #cfd6dd",
    fontSize: "12px",
  },

  searchBtn: {
    padding: "7px 10px",
    borderRadius: "4px",
    border: "1px solid #cfd6dd",
    background: "#f9fafb",
    cursor: "pointer",
    fontSize: "12px",
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "10px",
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    marginTop: "10px",
  },

  grid4: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "12px",
    marginBottom: "12px",
  },

  req: {
    color: "red",
    marginRight: "3px",
  },

  createBtn: {
    width: "100%",
    padding: "10px 14px",
    background: "#198754",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "700",
    cursor: "pointer",
  },

  footer: {
    textAlign: "center",
    fontSize: "11px",
    color: "#6b7280",
    marginTop: "15px",
  },
};
