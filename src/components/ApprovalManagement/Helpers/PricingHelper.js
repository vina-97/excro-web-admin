import React, { useState } from "react";
import { formatName } from "../../../DataServices/Utils";

// Same labelMap and flatMethods as before
const labelMap = {
  great1: "Price Range 1001 - 10000",
  great10: "Price Range 10001 - 25000",
  great25: "Price Range Above 25000",
};
const flatMethods = ["NEFT", "IMPS", "RTGS", "UPI"];

const DiffViewer = ({ response }) => {


  const { new_changes: newChanges, previous_changes: oldChanges } = response;

  const newComm = newChanges?.commission || {};
  const oldComm = oldChanges?.commission || {};

  const buildCommissionGroup = (key, label, methods) => {
    const newGroup = typeof newComm[key] === "object" && newComm[key] !== null ? newComm[key] : {};
    const oldGroup = typeof oldComm[key] === "object" && oldComm[key] !== null ? oldComm[key] : {};

    const allMethods = Array.from(
      new Set([...Object.keys(newGroup), ...Object.keys(oldGroup)])
    );

    const entries = {};
    for (const method of methods || allMethods) {
      const newVals = newGroup[method] || {};
      const oldVals = oldGroup[method] || {};

      entries[method] = {
        value: {
          old: oldVals.value ?? "N/A",
          new: newVals.value ?? "N/A",
        },
        percentage: {
          old: oldVals.percentage ?? "N/A",
          new: newVals.percentage ?? "N/A",
        },
        pricing_type:
          newVals.pricing_type || oldVals.pricing_type
            ? {
                old: oldVals.pricing_type ?? "N/A",
                new: newVals.pricing_type ?? "N/A",
              }
            : undefined,
      };
    }

    return { label, data: entries };
  };

  // Commission groups
  const groups = [];

  for (const key of Object.keys(labelMap)) {
    groups.push(buildCommissionGroup(key, labelMap[key]));
  }

  // Flat rate group
  const flat = {};
  for (const method of flatMethods) {
    flat[method] = {
      value: {
        old: oldComm[method]?.value ?? "N/A",
        new: newComm[method]?.value ?? "N/A",
      },
      percentage: {
        old: oldComm[method]?.percentage ?? "N/A",
        new: newComm[method]?.percentage ?? "N/A",
      },
    };
  }
  groups.unshift({ label: "Price Range 1 - 1000", data: flat });

  // Verifications
  const verifications = ["account", "vpa"];
  const verificationData = {};
  verifications.forEach((key) => {
    verificationData[key] = {
      old: oldComm?.verifications?.[key] ?? "N/A",
      new: newComm?.verifications?.[key] ?? "N/A",
    };
  });

  // Settings
  const settingKeys = [
    "daily_trans_count",
    "daily_trans_volume",
    "per_trans_volume",
    "max_beneficiary",
    
  ];
  const settingData = {};
  settingKeys.forEach((key) => {
    settingData[key] = {
      old: oldChanges?.settings?.[key] ?? "N/A",
      new: newChanges?.settings?.[key] ?? "N/A",
    };
  });




  const oldWhitelist = oldChanges?.settings?.beneficiary_whitelist || {};
  const newWhitelist = newChanges?.settings?.beneficiary_whitelist || {};
  
  // get all keys from old + new (credit, debit, etc.)
  const types = new Set([
    ...Object.keys(oldWhitelist),
    ...Object.keys(newWhitelist),
  ]);
  
  // Helper to Title Case
  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  
  types.forEach((type) => {
    const oldType = oldWhitelist?.[type] || {};
    const newType = newWhitelist?.[type] || {};
  
    // union of fields (is_enabled, limit, etc.)
    const fields = new Set([
      ...Object.keys(oldType || {}),
      ...Object.keys(newType || {}),
    ]);
  
    fields.forEach((field) => {
      const formatValue = (val) => {
        if (val === undefined || val === null) return "N/A";
        if (typeof val === "boolean") return val ? "Enabled" : "Disabled";
        return val;
      };
  
      // Build friendly label
      let label = `Beneficiary Whitelist ${capitalize(type)}`;
      if (field !== "is_enabled") {
        label += ` ${capitalize(field)}`;
      }
  
      const keyName = `beneficiary_whitelist_${type}_${field}`;
  
      settingData[keyName] = {
        label,
        old: formatValue(oldType?.[field]),
        new: formatValue(newType?.[field]),
      };
    });
  });
  

  
  return (
    <>


      <div className="diff-viewer">
        <div className="two-columns">
          {groups.map((group, idx) => (
            <GroupCollapse key={idx} label={group?.label} data={group.data} />
          ))}
        </div>
        <SimpleDiffCollapse label="Verifications" data={verificationData} />
       <div className="m-t-20"> <SimpleDiffCollapse label="Settings" data={settingData} /></div>
      </div>
    </>
  );
};

const GroupCollapse = ({ label, data }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="price-section">
      <div
        className="price-section-header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {label}
        <span className={`toggle-icon ${open ? "open" : ""}`}>▶</span>
      </div>
      {open && (
        <div className="collapse-content">
          {Object.entries(data).map(([method, changes]) => (
            <div key={method} className="method-box">
              <div className="method-name">{method}</div>
              <div>
                {changes?.value && (
                  <DiffRow
                    label="value"
                    oldVal={changes?.value?.old}
                    newVal={changes?.value?.new}
                  />
                )}
                {changes?.percentage && (
                  <DiffRow
                    label="percentage"
                    oldVal={changes?.percentage?.old}
                    newVal={changes?.percentage?.new}
                  />
                )}
                {changes?.pricing_type && (
                  <DiffRow
                    label="pricing_type"
                    oldVal={changes?.pricing_type?.old}
                    newVal={changes?.pricing_type?.new}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SimpleDiffCollapse = ({ label, data }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="price-section">
      <div
        className="price-section-header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {label}
        <span className={`toggle-icon ${open ? "open" : ""}`}>▶</span>
      </div>
      {open && (
        <div className="collapse-content">
          {Object.entries(data).map(([key, { old, new: newVal }]) => (
            <DiffRow key={key} label={key} oldVal={old} newVal={newVal} />
          ))}
        </div>
      )}
    </div>
  );
};

const DiffRow = ({ label, oldVal, newVal }) => {
  const changed = oldVal !== newVal;
  
  return (
    <div className="diff-row">

      <div className="diff-label">{formatName(label)}:</div>
      <div className="old-val"> {oldVal}</div>
      <div className="arrow">&rarr;</div>
      <div className={`new-val ${changed ? "changed" : "unchanged"}`}>
        {newVal}
      </div>
    </div>
  );
};

export default DiffViewer;
