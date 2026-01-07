import React from "react";

const fieldLabelMap = {
  account_id: "Account ID",
  isBankBeneCreateEnabled: "Create Beneficiary from Bank",
  isUpiBeneCreateEnabled: "Create UPI Beneficiary from Bank",
  isUpiEnabled: "Enable UPI",
  isConnectedBankingEnabled: "Enable Connected Banking",
  corp_code: "Corporate Code",
  "isFtEnabled.imps": "Enable IMPS",
  "isFtEnabled.neft": "Enable NEFT",
  "isFtEnabled.rtgs": "Enable RTGS",
  "isVpaValidationEnabled.direct": "Enable Pennyless VPA Validation",
  "isVpaValidationEnabled.indirect": "Enable Pennydrop VPA Validation:",
  "isBankVerificationEnabled.direct": "Enable Pennyless Bank verification:",
  "isBankVerificationEnabled.indirect": "Enable Pennydrop Bank verification:",
  name: "Bank Name",
  bank_id: "Bank ID",
  bank_name: "Bank Name",
  bank_code: "Bank Code",
  account_number: "Account Number",
  ifsc: "IFSC Code",
  status: "Status",
};

const getFieldLabel = (key) => {
  return fieldLabelMap[key] || key;
};

const formatValue = (val) => {
  if (val === true) return "Yes";
  if (val === false) return "No";
  if (val === null || val === undefined) return "N/A";
  return String(val);
};

const NodalHelper = ({ response }) => {

  const { new_changes: newChanges = {}, previous_changes: oldChanges = {} } =
  response || {};



  const flattenedChanges = [];

  const compareValues = (newVal, oldVal, prefix = "") => {
    if (
      typeof newVal === "object" &&
      newVal !== null &&
      !Array.isArray(newVal)
    ) {
      const keys = new Set([
        ...Object.keys(newVal || {}),
        ...Object.keys(oldVal || {}),
      ]);
      keys.forEach((key) => {
        compareValues(
          newVal[key],
          oldVal?.[key],
          prefix ? `${prefix}.${key}` : key
        );
      });
    } else {
      if (newVal !== oldVal) {
        flattenedChanges.push({
          key: prefix,
          label: getFieldLabel(prefix),
          oldVal: formatValue(oldVal),
          newVal: formatValue(newVal),
          changed: true,
        });
      }
    }
  };

  Object.keys(newChanges).forEach((key) => {
    compareValues(newChanges[key], oldChanges[key], key);
  });

  return (
    <div className="nodal-container">
      <h2 className="nodal-title">Changed Fields</h2>
      <table className="nodal-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Previous</th>
            <th></th>
            <th>New</th>
          </tr>
        </thead>
        <tbody>
          {flattenedChanges.map(({ key, label, oldVal, newVal }) => (
            <tr key={key}>
              <td className="field-name">{label}</td>
              <td className="old-value">{oldVal}</td>
              <td className="arrow">→</td>
              <td className="new-value changed">{newVal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NodalHelper;
