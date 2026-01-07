import React, { useCallback, useEffect, useState } from "react";

import {
  Link,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Select from "react-select";
import Loader from "../Loader";
import { useToasts } from "react-toast-notifications";
import { camelCaseText, removeUnderScore } from "../../DataServices/Utils";
import ApiGateway from "../../DataServices/DataServices";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UseDebounce from "../../Hooks/UseDebounce";
import { useLocation } from "react-router-dom";
const GenerateReport = (props) => {
  const location = useLocation();

  const { id } = useParams();
  const { showToggle } = props;
  const [state, setState] = useState({ loading: false });
  const [selectedReport, setSelectedReport] = useState({});
  const history = useHistory();

  const initialState = {};
  const [stateFilter, setStateFilter] = useState(initialState);
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  const [selectMerchant, setSelectMerchant] = useState(selectedReport);
  useEffect(() => {
    if (id) {
      getReportDetail();
    }
  }, [id]);

  const [selectedDataReport, setSelectedDataReport] = useState({
    reportType: "",
    reportId: "",
  });
  const [selectedStatusReport, setSelectedStatusReport] = useState({
    status: selectedReport?.status,
  });
  const [reportPop, setReportPop] = useState(false);
  const [existPayload, setExistPayload] = useState();

  const getReportDetail = () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    ApiGateway.get(`/payout/admin/report/details/${id}`, function (response) {
      if (response.success) {
        setSelectedReport(response?.data?.reports);

        setSelectedDataReport((prevState) => ({
          ...prevState,
          reportType: response?.data?.reports?.report_type,
          reportId: response?.data?.reports?.report_id,
        }));
        setSelectedStatusReport((prevState) => ({
          ...prevState,
          status: response?.data?.reports?.status,
        }));
        setState((prevState) => ({ ...prevState, loading: false }));
      } else {
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    });
  };

  const validateReportFilters = (backendErrors = []) => {
    const queryFields = selectedReport.query || [];
  
    let isAnyValueSelected = false;
  
    const dynamicValidations = queryFields.map((field) => {
      const fieldValue = field?.value;
  
      const isEmpty =
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === "" ||
        (typeof fieldValue === "object" && !fieldValue?.value);
  
      const isFromDate = field.field_id === "createdAt.$gte";
      const isToDate = field.field_id === "createdAt.$lte";
  
      //  Always validate mandatory fields (including dates)
      const shouldValidate = field.is_mandatory;
  
      if (!isEmpty) {
        isAnyValueSelected = true;
      }
  
      return {
        isInvalid: shouldValidate && isEmpty,
        message: `${removeUnderScore(
          field.label ||
            (isFromDate ? "From Date" : isToDate ? "To Date" : field?.field_id)
        )} is required.`,
      };
    });
  
    // Step 1: Show first dynamic validation error
    for (const { isInvalid, message } of dynamicValidations) {
      if (isInvalid) {
        applyToast(message, "info");
        return false;
      }
    }
  
    // Step 2: No filters selected at all
    if (!isAnyValueSelected) {
      applyToast("Please select the filter value.", "error");
      return false;
    }
  
    // Step 3: Handle backend errors (like status)
    if (Array.isArray(backendErrors) && backendErrors.length > 0) {
      backendErrors.forEach((err) => {
        let fieldName = err.field || "Unknown field";
  
        // Map special fields
        if (fieldName.includes("createdAt.$gte")) fieldName = "From Date";
        else if (fieldName.includes("createdAt.$lte")) fieldName = "To Date";
        else if (fieldName.includes("status")) fieldName = "Status";
  
        applyToast(`${removeUnderScore(fieldName)} - ${err.message}`, "error");
      });
  
      return false;
    }
  
    return true;
  };
  
  

  const formatDate = (date) => {
    if (!date) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd}`;
  };

  const onDateRangeChange = (date, primaryIndex) => {
    setSelectedReport((prevState) => {
      const prevQuery = prevState.query || [];
      const updatedQuery = [...prevQuery];

      // Update current field value
      updatedQuery[primaryIndex] = {
        ...updatedQuery[primaryIndex],
        value: date ? formatDate(date) : "",
      };

      // Find From Date & To Date from the query array
      const fromDateItem = updatedQuery.find(
        (q) => q.display_name === "From Date"
      );
      const toDateItem = updatedQuery.find((q) => q.display_name === "To Date");

      if (fromDateItem?.value && toDateItem?.value) {
        const fromDate = new Date(fromDateItem.value);
        const toDate = new Date(toDateItem.value);

        if (fromDate > toDate) {
          applyToast("To Date cannot be earlier than From Date", "error");

          updatedQuery[primaryIndex] = {
            ...updatedQuery[primaryIndex],
            value: "",
          };
        }
      }

      return {
        ...prevState,
        query: updatedQuery,
      };
    });
  };
  const handleChangeStatusSelect = useCallback(
    (value, arrayList, primaryIndex) => {
      const selectedObj = arrayList?.find((item) => item?.value === value);

      setSelectedReport((prevState) => {
        const updatedState = [...prevState.query];

        if (!updatedState[primaryIndex].value) {
          updatedState[primaryIndex].value = {};
        }

        updatedState[primaryIndex].value = {
          label: selectedObj?.label || "",
          value: selectedObj?.value || "",
        };

        return {
          ...prevState,
          query: updatedState,
        };
      });
    },
    []
  );
  const [modalPage, setModalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };
  const debouncedSearchTerm = UseDebounce(
    selectedReport.query?.find((q) => q.field_id === "merchant.id")?.value
      ?.value || "",
    500
  );
  const handleGetApi = useCallback(
    (getUrl, fieldKey,queryParamKey, primaryIndex, page = 1, searchTerm = "") => {
      const query = new URLSearchParams();
      query.set("page", page);
      query.set("limit", "20");
      if (searchTerm) {
        query.set("search_term", searchTerm);
      }
      const separator = getUrl.includes("?") ? "&" : "?";
      const finalUrl = `/${getUrl}${separator}${query.toString()}`;

      ApiGateway.get(finalUrl, (response) => {
        if (response?.success) {
          const newList =
            response?.data?.list.map((merchantData) => ({
              label:
                merchantData?.fieldKey ||
                getNestedValue(merchantData, fieldKey) ||
                null,
              value:
              // merchantData?.merchantId ||
                getNestedValue(merchantData, queryParamKey) ||
                null,
            })) || [];

          // setHasMore(newList.length > 0);
          if (!newList.length) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          setSelectedReport((prevState) => {
            const updatedQuery = [...prevState.query];
            const updatedField = { ...updatedQuery[primaryIndex] };

            const existingArray = updatedField?.arrayList || [];
            const existingIds = new Set(existingArray.map((i) => i.value));

            const deduplicatedNewList = newList.filter(
              (i) => !existingIds.has(i.value)
            );

            updatedField.arrayList = [...existingArray, ...deduplicatedNewList];
            updatedQuery[primaryIndex] = updatedField;

            return {
              ...prevState,
              query: updatedQuery,
            };
          });
        }
      });
    },
    [debouncedSearchTerm]
  );

  const queryDetails = () => {
    const query =
      selectedReport.query?.reduce((acc, field) => {
        if (
          field?.field_id &&
          (field?.value?.value !== undefined || field?.value !== undefined)
        ) {
          acc[field.field_id] = field.value?.value ?? field.value;
        }
        return acc;
      }, {}) || {};
    return query;
  };
  const handleReport = (key) => {
    if (key === "open") {
      const isValid = validateReportFilters();
      if (!isValid) return;
      // setReportPop(true);
      handleDownloadReport();
    } else {
      setReportPop(false);
    }
  };

  const handleDownloadReport = () => {
    const query = queryDetails();

    // Uncomment if you want to include date filters
    // if (stateFilter?.to) query["createdAt.$lte"] = stateFilter.to;
    // if (stateFilter?.from) query["createdAt.$gte"] = stateFilter.from;

    const finalPayload = {
      query,
      purpose: selectedDataReport.reportType,
    };

    setStateFilter(finalPayload);

    const updatePayload = {
      query: {
        ...query,
        isQueryPass: false,
      },
      purpose: selectedDataReport.reportType,
    };

    ApiGateway.post(
      "/payout/admin/downloadmanager/report/download",
      finalPayload,
      (response) => {
        if (response?.success) {
          applyToast(response.message || "Report ready for download");

          setTimeout(() => {
            history.push("/report-list");
          }, 1000);
          const status = response?.data?.status;
          if (status === "completed") {
            setExistPayload(updatePayload);
            history.push("/report-list");
          } else {
            setReportPop(true);
          }

          //  setReportPop(true);
        } else {
          applyToast(response.message);
        }
      }
    );
  };

  const handleBack = () => {
    history.push("/report-list");
  };
  return (
    <>
      <div className="content_wrapper dash_wrapper">
        {state.loading && <Loader />}
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">
            Generate Report
            <div className="bread_crumb">
              <ul className="breadcrumb">
                <li>
                  <Link to="/dashboard" className="inactive_breadcrumb">
                    Home
                  </Link>
                </li>
                <li className="active_breadcrumb">Generate Report</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="white_tab_wrap">
          <div className="white_tab_box">
            <div className="tab-content">
              <div className="tab-content">
                <div className="pull-right">
                  <button className="submitBtn" onClick={handleBack}>
                    Back
                  </button>
                </div>
                <div className="report-form-container card">
                  <div className="text-capitalize report-title-card">
                    {selectedDataReport.reportType &&
                      removeUnderScore(
                        camelCaseText(selectedDataReport.reportType)
                      )}
                  </div>

                  <div className="row">
                    {selectedReport?.query?.map((item, primaryIndex) => (
                      <div
                        key={primaryIndex}
                        className="col-xs-12 col-md-6 report-form-group"
                      >
                        <label
                          className={`report-label ${
                            item.is_mandatory ? "required-input" : ""
                          }`}
                        >
                          {item.display_name}
                        </label>

                        {(() => {
                          const inputName = item.name || "sub-category";
                          const inputPlaceholder = `Enter ${removeUnderScore(
                            item.display_name
                          )}`;

                          switch (item.input_type) {
                            case "date":
                              const fromDate = selectedReport?.query?.find(
                                (q) => q.display_name === "From Date"
                              )?.value;

                              const toDate = selectedReport?.query?.find(
                                (q) => q.display_name === "To Date"
                              )?.value;
                              return (
                                <DatePicker
                                  selected={
                                    item?.value ? new Date(item.value) : null
                                  }
                                  dateFormat="yyyy/MM/dd"
                                  className="form-control report-input"
                                  placeholderText={inputPlaceholder}
                                  onChange={(dates) =>
                                    onDateRangeChange(dates, primaryIndex)
                                  }
                                  minDate={
                                    item.display_name === "To Date" && fromDate
                                      ? new Date(fromDate)
                                      : null
                                  }
                                  maxDate={
                                    item.display_name === "From Date" && toDate
                                      ? new Date(toDate)
                                      : new Date()
                                  }
                                />
                              );

                            case "select_field":
                              return (
                                <Select
                                  placeholder={inputPlaceholder}
                                  name={inputName}
                                  classNamePrefix="react-select"
                                  className="report-select"
                                  options={
                                    item?.arrayList?.map((merchant) => {
                                      return {
                                        value: merchant.value,
                                        label:
                                          merchant.label?.[0]?.toUpperCase() +
                                          merchant.label?.slice(1),
                                      };
                                    }) || []
                                  }
                                  value={
                                    item?.value?.value &&
                                    typeof item?.value?.label === "string"
                                      ? {
                                          value: item.value.value,
                                          label:
                                            item.value.label
                                              .charAt(0)
                                              .toUpperCase() +
                                            item.value.label.slice(1),
                                        }
                                      : null
                                  }
                                  // First load when user opens dropdown
                                  onFocus={() => {
                                    setModalPage(1);
                                    setHasMore(true); // reset every time dropdown opens
                                    handleGetApi(
                                      item.select_api?.url,
                                      item.select_api?.label,
                                      item.select_api?.query_param,
                                      primaryIndex,
                                      1
                                    );
                                  }}
                                  onMenuScrollToBottom={() => {
                                    if (hasMore) {
                                      setModalPage((prev) => {
                                        const nextPage = prev + 1;
                                        handleGetApi(
                                          item.select_api?.url,
                                          item.select_api?.label,
                                          item.select_api?.query_param,
                                          primaryIndex,
                                          nextPage
                                        );
                                        return nextPage;
                                      });
                                    }
                                  }}
                                  onChange={(selectedOption) => {
                                    handleChangeStatusSelect(
                                      selectedOption?.value,
                                      item?.arrayList,
                                      primaryIndex
                                    );
                                  }}
                                  styles={{
                                    menu: (provided) => ({
                                      ...provided,
                                      maxHeight: 300,
                                      overflowY: "auto",
                                    }),
                                  }}
                                  onInputChange={(inputValue) => {
                                    setModalPage(1);
                                    setHasMore(true);
                                    handleGetApi(
                                      item.select_api?.url,
                                      item.select_api?.label,
                                      item.select_api?.query_param,
                                      primaryIndex,
                                      1,
                                      inputValue
                                    );
                                  }}
                                  menuPortalTarget={document.body}
                                  isClearable={true}
                                />

                                // <Select
                                //   placeholder={inputPlaceholder}
                                //   name={inputName}
                                //   classNamePrefix="react-select"
                                //   className="report-select"
                                //   onPopupScroll={handleScroll}
                                //   options={
                                //     item?.arrayList?.map((merchant) => {
                                //       return {
                                //         value: merchant.value,
                                //         label:
                                //           merchant.label?.[0]?.toUpperCase() + merchant.label?.slice(1),
                                //       };
                                //     }) || []
                                //   }

                                //   value={
                                //     item?.value?.value && typeof item?.value?.label === 'string'
                                //       ? {
                                //           value: item.value.value,
                                //           label:
                                //             item.value.label.charAt(0).toUpperCase() + item.value.label.slice(1),
                                //         }
                                //       : null
                                //   }
                                //   onFocus={() =>
                                //     handleGetApi(
                                //       item.select_api?.url,
                                //       item.select_api?.label,
                                //       primaryIndex
                                //     )
                                //   }
                                //   onChange={(selectedOption) => {
                                //     handleChangeStatusSelect(
                                //       selectedOption?.value,
                                //       item?.arrayList,
                                //       primaryIndex
                                //     );
                                //   }}
                                //   isClearable={true}
                                // />
                              );

                            case "text":
                              return (
                                <input
                                  type="text"
                                  className="form-control report-input"
                                  placeholder={inputPlaceholder}
                                  value={item?.value || ""}
                                />
                              );

                            default:
                              return null;
                          }
                        })()}
                      </div>
                    ))}

                    <div className="col-xs-12 text-right">
                      <button
                        type="button"
                        className="btn report-submit-btn"
                        onClick={() => handleReport("open")}
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateReport;
