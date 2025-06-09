import React, { useState } from "react";
import AccountSettings from "../components/AccountSettings";
import { generatePatientPDF } from "../utils/pdfUtils";

const Settings = ({ theme, setTheme, user }) => {
  const [patientId, setPatientId] = useState("");

  return (
    <div>
      <div id="settingsView">
        <h1>Settings</h1>

        {/* Account Settings */}
        <div>
          <h2>Account Settings</h2>
          <div style={{ maxWidth: 400, paddingLeft: 0 }}>
            <AccountSettings user={user} hideTitle={true} />
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-section">
          <h2>Data Management</h2>

          {/* ✅ Input field for Patient ID */}
          <input
            type="text"
            placeholder="Enter Patient ID (e.g. PT1001)"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            style={{
              padding: "0.5rem",
              marginRight: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          {/* ✅ Export Button */}
          <button
            className="btn btn-primary"
            id="exportDataBtn"
            onClick={() => generatePatientPDF(patientId)} // ✅ Pass entered Patient ID
            disabled={!patientId} // Prevent empty request
          >
            Export Patient Data
          </button>

          <button className="btn btn-secondary" id="importDataBtn" style={{ marginLeft: "1rem" }}>
            Import Patient Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;