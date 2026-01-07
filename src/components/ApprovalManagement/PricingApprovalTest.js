import React from "react";

const responseChanges={
    "data": {
        "doc_id": "Rgjdf4Fv0",
        "merchant": {
          "id": "IfthChweQs",
          "name": "Test Cafe"
        },
        "is_user_specific": true,
        "new_changes": {
          "status": "active",
          "commission": {
            "great1": {
              "NEFT": {
                "value": 13,
                "percentage": "10"
              },
              "IMPS": {
                "value": 23,
                "percentage": "10"
              },
              "UPI": {
                "value": 40,
                "percentage": "10"
              },
              "RTGS": {
                "value": 50,
                "percentage": "10"
              }
            },
            "great10": {
              "NEFT": {
                "value": 15,
                "percentage": "10"
              },
              "IMPS": {
                "value": 5,
                "percentage": "0"
              },
              "UPI": {
                "value": 0,
                "percentage": "0"
              },
              "RTGS": {
                "value": 0,
                "percentage": "0"
              }
            },
            "great25": {
              "NEFT": {
                "value": 8,
                "percentage": "0"
              },
              "IMPS": {
                "value": 8,
                "percentage": "0"
              },
              "RTGS": {
                "value": 113,
                "percentage": "0"
              },
              "UPI": {
                "value": 0,
                "percentage": "0"
              }
            },
            "collections": {
              "VAN": {
                "pricing_type": "fixed",
                "value": 22
              },
              "VPA": {
                "pricing_type": "percentage",
                "value": 0
              }
            },
            "creations": {
              "VAN": {
                "pricing_type": "fixed",
                "value": 5
              },
              "VPA": {
                "pricing_type": "percentage",
                "value": 1
              }
            },
            "verifications": {
              "account": "11",
              "vpa": "1"
            },
            "NEFT": {
              "value": 12,
              "percentage": "0"
            },
            "IMPS": {
              "value": 22,
              "percentage": "0"
            },
            "RTGS": {
              "value": 13,
              "percentage": "0"
            },
            "UPI": {
              "value": 2,
              "percentage": "0"
            }
          },
          "settings": {
            "daily_trans_count": 2,
            "daily_trans_volume": 3,
            "per_trans_volume": 3,
            "max_beneficiary": 200
          }
        },
        "previous_changes": {
          "status": "active",
          "commission": {
            "great1": {
              "NEFT": {
                "value": 3,
                "percentage": "0"
              },
              "IMPS": {
                "value": 3,
                "percentage": "0"
              },
              "UPI": {
                "value": 0,
                "percentage": "0"
              },
              "RTGS": {
                "value": 0,
                "percentage": "0"
              }
            },
            "great10": {
              "NEFT": {
                "value": 5,
                "percentage": "0"
              },
              "IMPS": {
                "value": 5,
                "percentage": "0"
              },
              "UPI": {
                "value": 0,
                "percentage": "0"
              },
              "RTGS": {
                "value": 0,
                "percentage": "0"
              }
            },
            "great25": {
              "NEFT": {
                "value": 8,
                "percentage": "0"
              },
              "IMPS": {
                "value": 8,
                "percentage": "0"
              },
              "RTGS": {
                "value": 13,
                "percentage": "0"
              },
              "UPI": {
                "value": 0,
                "percentage": "0"
              }
            },
            "collections": {
              "VAN": {
                "pricing_type": "fixed",
                "value": 2
              },
              "VPA": {
                "pricing_type": "percentage",
                "value": 0
              }
            },
            "creations": {
              "VAN": {
                "pricing_type": "fixed",
                "value": 5
              },
              "VPA": {
                "pricing_type": "percentage",
                "value": 1
              }
            },
            "verifications": {
              "account": "1",
              "vpa": "1"
            },
            "NEFT": {
              "value": 2,
              "percentage": "0"
            },
            "IMPS": {
              "value": 2,
              "percentage": "0"
            },
            "RTGS": {
              "value": 13,
              "percentage": "0"
            },
            "UPI": {
              "value": 2,
              "percentage": "0"
            }
          },
          "settings": {
            "daily_trans_count": 12,
            "daily_trans_volume": 3,
            "per_trans_volume": 3,
            "max_beneficiary": 100
          }
        },
        "status": "submitted",
        "reason": "",
        "is_completed": false,
        "audit": {},
        "process": "merchant_pricing",
        "action": "create"
      }
  }

  const labelMappings = {
    great1: "Price Range 1001 - 10000",
    great10: "Price Range 10001 - 25000",
    great25: "Price Range Above 25000",
    value: "Fixed Commission",
    percentage: "Percentage Commission",
  };
  
  // Recursively get differences
  const getDifferences = (newObj, oldObj) => {
    const diff = {};
  
    for (const key in newObj) {
      const newValue = newObj[key];
      const oldValue = oldObj?.[key];
  
      if (
        typeof newValue === "object" &&
        newValue !== null &&
        !Array.isArray(newValue)
      ) {
        const nestedDiff = getDifferences(newValue, oldValue || {});
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = nestedDiff;
        }
      } else if (newValue !== oldValue) {
        diff[key] = {
          old: oldValue,
          new: newValue,
        };
      }
    }
  
    return diff;
  };
  
  // Helper to map labels
  const mapLabel = (key, path) => {
    // If under "commission" and final keys are "value" or "percentage", rename them
    if (
      path.includes("commission") &&
      (key === "value" || key === "percentage")
    ) {
      return labelMappings[key] || key;
    }
  
    return labelMappings[key] || key;
  };
  
  // Render the UI
  const ChangesViewer = () => {
    const newChanges = responseChanges.data.new_changes;
    const previousChanges = responseChanges.data.previous_changes;
    const changes = getDifferences(newChanges, previousChanges);
  
    const renderChanges = (obj, path = []) => {
      return Object.entries(obj).map(([key, value]) => {
        const displayKey = mapLabel(key, path);
        const currentPath = [...path, key];
  
        if (
          typeof value === "object" &&
          value !== null &&
          "old" in value &&
          "new" in value
        ) {
          return (
            <div key={currentPath.join(".")} style={{ padding: "6px 0", borderBottom: "1px dashed #ddd" }}>
              <strong>{currentPath.slice(-2, -1)[0]} → {displayKey}:</strong>
              <div style={{ paddingLeft: "10px" }}>
                <span style={{ color: "red" }}>Old: {value.old?.toString()}</span> |{" "}
                <span style={{ color: "green" }}>New: {value.new?.toString()}</span>
              </div>
            </div>
          );
        } else if (typeof value === "object") {
          return (
            <div key={currentPath.join(".")} style={{ margin: "10px 0" }}>
              <h4 style={{ fontWeight: "bold" }}>{displayKey}</h4>
              <div style={{ paddingLeft: "15px", borderLeft: "2px solid #ccc" }}>
                {renderChanges(value, currentPath)}
              </div>
            </div>
          );
        }
  
        return null;
      });
    };
  
    return (
      <div
        style={{
          maxWidth: "850px",
          margin: "20px auto",
          padding: "20px",
          background: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "15px" }}>
          Changed Fields
        </h2>
        {Object.keys(changes).length ? (
          renderChanges(changes)
        ) : (
          <div style={{ color: "#888" }}>No changes detected.</div>
        )}
      </div>
    );
  };
  
  export default ChangesViewer;