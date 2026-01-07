import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { DateRangePicker } from "react-date-range";
import Modal from "react-modal";
import moment from "moment";
import axios from "axios";

import { userConstants } from "../../constants/ActionTypes";
import ApiGateway from "../../DataServices/DataServices";
import {
  returnTimeZoneDate,
  textCapitalize,
  manipulateString,
  validate,
  getCookie,
} from "../../DataServices/Utils";
import useRouteExist from "../../DataServices/useRouteExist";
import Pagination from "../Pagination";
import Loader from "../Loader";

import "react-datepicker/dist/react-datepicker.css";
import { Pencil, Trash2 } from "lucide-react";

// Constants
const ACCOUNT_TYPES = [
  { value: "isConnectedBanking", label: "Connected Banking" },
  { value: "escrow", label: "Escrow" },
];

const ID_FILTERS = [{ value: "search_term", label: "Entity Name" }];

const BUSINESS_TYPE = [
  { value: "individual", label: "Individual" },
  { value: "business", label: "Business" },
];

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "deactive", label: "Deactive" },
];

// Helper Functions
const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
};

const EntityList = () => {
  const { payout_merchant, nodal_account, loading } = useSelector(
    (state) => state
  );
  const [entityNameData, setEntityNameData] = useState("");
  const [deletePopModel, setDeletePopModel] = useState(false);
  const [entityId, setEntityId] = useState(false);

  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const latestValue = useRef({});

  // Route permissions
  const merchantListRoute = useRouteExist(["admin-merchant-list"]);
  const merchantStatus = useRouteExist(["admin-merchant-status-update"]);
  const merchantaddRoute = useRouteExist(["admin-merchant-add"]);

  // State
  const [pageno, setPageNo] = useState(1);
  const [limit] = useState(10);
  const [recordsLength, setRecordLength] = useState([]);
  const [nodalOptions, setNodalOptions] = useState([]);
  const [selectDate, setSelectDate] = useState(getYesterdayDate());
  const [seacrhBox, setSeacrhBox] = useState(true);
  const [active, setActive] = useState(false);
  const [reseller, setReseller] = useState({ id: "", name: "" });
  const [selectionRange, setSelectionRange] = useState([
    {
      startDate: payout_merchant.startDate,
      endDate: payout_merchant.endDate,
      key: "selection",
    },
  ]);

  latestValue.current = payout_merchant;

  // Toast utility
  const applyToast = useCallback(
    (msg, type) => addToast(msg, { appearance: type }),
    [addToast]
  );

  // Redux update utility
  const updateState = useCallback(
    (actionType, value) => {
      dispatch({ type: actionType, payload: value });
      return Promise.resolve();
    },
    [dispatch]
  );

  const stateChanges = useCallback(
    (actionType, payload) => ({ type: actionType, payload }),
    []
  );
  console.log(payout_merchant);

  // API Calls
  const getEntityList = useCallback(
    (page) => {
      updateState(userConstants.LOADER, { loading: true });
      setPageNo(page);

      ApiGateway.get(
        `/payout/onboarding/properties/entity?page=${page}&limit=${limit}${
          payout_merchant.filter || ""
        }`,
        (response) => {
          if (response.success) {
            const data = response?.data;
            updateState(userConstants.LOADER, { loading: false });
            console.warn("Unexpected SSO response", data);
            updateState(userConstants.PAYOUT_MERCHANT, {
              entityList: data.entities || [],
            }).then(() => {
              updateState(userConstants.LOADER, { loading: false });
            });
            setRecordLength(data.entities.length);
            return;
          } else {
            updateState(userConstants.LOADER, { loading: false });
            applyToast(response.message, "error");
          }
        }
      );
    },
    [limit, payout_merchant.filter, updateState, applyToast]
  );

  // const getEntityList = useCallback(
  //   async (page) => {
  //     try {
  //       const res = await axios.get("/onboarding/properties/entity", {
  //         baseURL: "http://10.0.1.4:3000/api/v2",
  //         headers: {
  //           "x-consumer-username": "admin_mNtx1YJp0C",
  //         },
  //       });

  //       const data = res?.data;
  //       console.log(data.data.entities);
  //       updateState(userConstants.LOADER, { loading: false });
  //       console.warn("Unexpected SSO response", data);
  //       updateState(userConstants.PAYOUT_MERCHANT, {
  //         entityList: data.data.entities,
  //       }).then(() => {
  //         updateState(userConstants.LOADER, { loading: false });
  //       });
  //       setRecordLength(data.data.entities.length);
  //     } catch (error) {
  //       console.error("SSO error", error);
  //     }
  //   },
  //   [limit, payout_merchant.filter, updateState, applyToast]
  // );

  const nodalAccount = useCallback(() => {
    let queryParams = "";
    if (nodal_account?.reseller?.id || reseller.id) {
      queryParams += `&reseller.id=${
        nodal_account?.reseller?.id || reseller.id
      }`;
    } else {
      queryParams += `&is_reseller=false`;
    }

    ApiGateway.get(
      `/payout/admin/nodal/list?isConnectedBankingEnabled=false&status=active${queryParams}`,
      (response) => {
        if (response.success) {
          updateState(userConstants.PAYOUT_MERCHANT, {
            nodalAccountList: response.data.accounts,
          });
        } else {
          applyToast(response.message, "error");
        }
      }
    );
  }, [nodal_account?.reseller?.id, reseller.id, updateState, applyToast]);

  // Event Handlers
  const handleTextChange = (e) => {
    updateState(userConstants.PAYOUT_MERCHANT, {
      [e.target.name]: e.target.value.toUpperCase(),
    });
  };

  const handleNumberChange = (e) => {
    updateState(userConstants.PAYOUT_MERCHANT, {
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchChange = (e) => {
    updateState(userConstants.PAYOUT_MERCHANT, {
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (list) => {
    const data = {
      status: list.status === "active" ? "inactive" : "active",
      merchantId: list.merchantId,
    };

    updateState(userConstants.LOADER, { loading: true });
    ApiGateway.patch(
      "/payout/admin/merchant/merchant-status",
      data,
      (response) => {
        updateState(userConstants.LOADER, { loading: false });
        if (response.success) {
          getEntityList(pageno);
          applyToast(response.message, "success");
        } else {
          applyToast(response.message, "error");
        }
      }
    );
  };

  const handleAddMerchant = async () => {
    ApiGateway.get(`/payout/sso/code`, function (response) {
      if (response.success) {
        const data = response;
        console.log(data, data?.redirectTo, "dsd");

        if (data?.code) {
          window.open(
            `${data.redirectTo}/auth/callback?code=${data.code}&from=entity`,
            "_blank",
            "noopener,noreferrer"
          );
          return;
        }

        // if (data?.code) {
        //   window.open(
        //     `http://localhost:5173/auth/callback?code=${data.code}&from=entity`,
        //     "_blank",
        //     "noopener,noreferrer"
        //   );
        //   return;
        // }
      } else {
        applyToast(response.message, "error");
      }
    });
  };
  const selectFilter = (filter, e) => {
    setSeacrhBox(false);
    setActive(true);
    let str = manipulateString(filter);
    updateState(userConstants.PAYOUT_MERCHANT, {
      [filter]: e.value,
      [str]: e,
      searchTerm: filter === "search_type" ? "" : payout_merchant.searchTerm,
    });
  };

  const submitFilter = () => {
    let queryParam = "";
    queryParam +=
      !payout_merchant.status || payout_merchant.status === "all"
        ? ""
        : `&status=${payout_merchant.status}`;
    queryParam +=
      payout_merchant.fromDate === ""
        ? ""
        : `&from_date=${payout_merchant.fromDate}`;
    queryParam +=
      payout_merchant.toDate === "" ? "" : `&to_date=${payout_merchant.toDate}`;
    queryParam += payout_merchant.searchTerm
      ? `&name=${payout_merchant.searchTerm}`
      : "";

    updateState(userConstants.PAYOUT_MERCHANT, { filter: queryParam });
    setPageNo(1);
  };

  const resetFilter = () => {
    if (selectionRange) {
      setSelectionRange([
        { startDate: null, endDate: new Date(""), key: "selection" },
      ]);
    }
    setPageNo(1);

    const resetState = {
      filter: "",
      searchTerm: "",
      search_type: "",
      selection: undefined,
      Selection: undefined,
      reseller_id: undefined,
      reseller_name: undefined,
      status: undefined,
      Status: undefined,
      businessName: undefined,
      email: undefined,
      number: undefined,
      merchantId: undefined,
      startDate: new Date(),
      endDate: new Date(),
      from: "",
      to: "",
      fromDate: "",
      toDate: "",
      accountActivationStatus: "",
      accountActivationStatusLabel: "",
      BusinessType: "",
    };

    updateState(userConstants.PAYOUT_MERCHANT, resetState);
    setActive(false);
    setSeacrhBox(true);
  };

  const dateChange = (dates) => {
    setSelectionRange([dates.selection]);
    updateState(userConstants.PAYOUT_MERCHANT, {
      startDate: dates.selection.startDate,
      endDate: dates.selection.endDate,
    });
  };

  const submitDateFilter = () => {
    const merchant = latestValue.current;
    const startDate =
      merchant.endDate > merchant.startDate
        ? merchant.startDate
        : merchant.startDate;
    const endDate =
      merchant.endDate > merchant.startDate
        ? merchant.endDate
        : merchant.startDate;

    updateState(userConstants.PAYOUT_MERCHANT, {
      from: moment(startDate).format("DD/MM/YYYY"),
      to: moment(endDate).format("DD/MM/YYYY"),
      fromDate: moment(startDate).utc().add(1, "days").startOf("day").format(),
      toDate: moment(endDate).utc().add(1, "days").endOf("day").format(),
      open_picker: false,
    });
  };

  const closeGenReportModal = () => {
    dispatch(
      stateChanges(userConstants.PAYOUT_MERCHANT, {
        openGenReportModal: false,
        con_report_id: "",
      })
    );
  };

  // Effects
  useEffect(() => {
    resetFilter();
  }, []);

  useEffect(() => {
    if (payout_merchant.openApproveModal) {
      nodalAccount();
    }
  }, [
    payout_merchant.openApproveModal,
    payout_merchant.isConnectedBanking === "escrow",
    nodalAccount,
  ]);

  useEffect(() => {
    setNodalOptions(
      payout_merchant.nodalAccountList?.map((list) => ({
        value: list.account_id,
        label: list.name,
      })) || []
    );
  }, [payout_merchant.nodalAccountList]);

  useEffect(() => {
    getEntityList(pageno);
  }, [payout_merchant.page, payout_merchant.filter]);

  const handleDeleteMerchant = (id) => {
    ApiGateway.delete(
      `/payout/onboarding/properties/entity/${id}`,
      {},
      function (response) {
        if (response.success) {
          applyToast(response.message, "success");
          getEntityList(pageno);
          handleDeleteCancel();
        } else {
          applyToast(response.message, "error");
        }
      }
    );
  };

  const handleDeleteCancel = () => setDeletePopModel(false);
  const handleOpen = (entityDatas) => {
    setDeletePopModel(true);
    setEntityNameData(entityDatas.entity.name);
    setEntityId(entityDatas.entity.id);
  };

  // Render Helpers
  const renderTableRow = (list, i) => (
    <tr className="payout_merchant" key={`list${i}`}>
      <td>{(pageno - 1) * limit + (i + 1)}</td>
      <td>{list?.entityType ? textCapitalize(list.entityType) : "-"}</td>
      <td>{list?.entity?.name ? textCapitalize(list?.entity?.name) : "-"}</td>
      <td>{list?.createdAt ? returnTimeZoneDate(list.createdAt) : "-"}</td>
      {merchantStatus && (
        <td>
          <button
            type="button"
            className={`status-btn ${
              list.status === "active" ? "label_success" : "label_danger"
            }`}
            onClick={() => handleChange(list)}
          >
            {textCapitalize(list?.status)}
          </button>
        </td>
      )}
      {merchantStatus && (
        <td>
          <button
            className="icon-btn edit-icon"
            onClick={() => handleEditEntity(list?.entity?.id)}
          >
            <Pencil />
          </button>

          <span
            className="icon-btn delete-icon"
            title="Delete"
            onClick={() => handleOpen(list)}
          >
            <Trash2 />
          </span>
        </td>
      )}
    </tr>
  );

  const handleEditEntity = (id) => {
    ApiGateway.get(`/payout/sso/code`, function (response) {
      if (response.success) {
        const data = response;

        if (data?.code) {
          window.open(
            `${data.redirectTo}/auth/callback?code=${data.code}&entityId=${id}&from=entity`,
            "_blank",
            "noopener,noreferrer"
          );
          return;
        }

        // if (data?.code) {
        //   window.open(
        //     `http://localhost:5173/auth/callback?code=${data.code}&entityId=${id}&from=entity`,
        //     "_blank",
        //     "noopener,noreferrer"
        //   );
        //   return;
        // }
      } else {
        applyToast(response.message, "error");
      }
    });
  };

  return (
    <>
      <div className="content_wrapper dash_wrapper">
        {loading.loading && <Loader />}

        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">
            Entity
            <div className="bread_crumb">
              <ul className="breadcrumb">
                <li>
                  <Link to="/dashboard" className="inactive_breadcrumb">
                    Home
                  </Link>
                </li>
                <li className="active_breadcrumb">Entity</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="white_tab_wrap">
          <div className="white_tab_box">
            {/* Search Section */}
            <div className="col-xs-12 m-b-20 p-0">
              <div className="col-md-6 p-l-0">
                <div className="trans-text m-b-5 color-grey font-semibold">
                  Select by Entity Name
                </div>
                <div className="payout_popup_search">
                  <div className="input-group">
                    <input
                      className="payout_popup_search_input"
                      type="text"
                      name={payout_merchant.search_type || "searchTerm"}
                      value={
                        payout_merchant[payout_merchant.search_type] ||
                        payout_merchant.searchTerm
                      }
                      onChange={handleSearchChange}
                      disabled={seacrhBox}
                      style={{
                        backgroundColor: active ? "#fff" : "#f1f1f1",
                      }}
                    />
                    <div className="payout_popup_search_select">
                      <Select
                        className="selectpicker"
                        options={ID_FILTERS}
                        value={payout_merchant.SearchType}
                        onChange={(e) => selectFilter("search_type", e)}
                      />
                    </div>
                    <span className="input-group-addon" onClick={submitFilter}>
                      <i className="fa fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>

              {merchantaddRoute && (
                <div className="col-xs-12 col-md-3 m-t-25 add-merchant">
                  <button
                    className="submitBtn m-l-15 border-plain"
                    onClick={handleAddMerchant}
                  >
                    Add Entity
                  </button>
                </div>
              )}
            </div>

            {/* Filter Section */}
            <div className="col-xs-12 m-b-15 p-0">
              <div className="col-xs-12 col-md-2 p-l-0 m-b-5">
                <label className="trans-text m-b-5 color-grey font-semibold">
                  Select By Status
                </label>
                <Select
                  className="selectpicker"
                  options={STATUS_FILTERS}
                  placeholder="Status"
                  onChange={(e) => selectFilter("status", e)}
                  value={payout_merchant.Status}
                />
              </div>

              <div className="col-xs-12 col-md-2 p-l-0 m-b-5">
                <label className="trans-text m-b-5 color-grey font-semibold">
                  Select By Business type
                </label>
                <Select
                  className="selectpicker"
                  options={BUSINESS_TYPE}
                  placeholder="Select Business Type"
                  onChange={(e) => selectFilter("BusinessType", e)}
                  value={payout_merchant.BusinessType}
                />
              </div>

              <div className="col-xs-12 col-md-2 p-0 m-b-5">
                <div className="trans-text m-b-5 color-grey font-semibold">
                  Select By Dates
                </div>
                <input
                  className="fileter_form_input"
                  id="from_date"
                  name="date"
                  placeholder="Select date"
                  type="text"
                  onClick={() =>
                    updateState(userConstants.PAYOUT_MERCHANT, {
                      open_picker: !payout_merchant.open_picker,
                    })
                  }
                  value={
                    payout_merchant.from !== ""
                      ? `${payout_merchant.from} ~ ${payout_merchant.to}`
                      : ""
                  }
                />
                <div
                  className={
                    payout_merchant.open_picker
                      ? "react_date_range_picker"
                      : "react_date_range_picker hide"
                  }
                >
                  <DateRangePicker
                    months={2}
                    ranges={selectionRange}
                    onChange={dateChange}
                    direction="horizontal"
                    maxDate={new Date()}
                    showMonthAndYearPickers={false}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    showPreview={false}
                    showDateDisplay={false}
                  />
                  <span className="submitDateBtn" onClick={submitDateFilter}>
                    Submit
                  </span>
                </div>
              </div>
            </div>

            {/* Submit/Reset Buttons */}
            <div className="col-xs-12 p-0 m-t-25 m-b-15 textCenter">
              <div className="col-xs-12 m-t-25">
                <a className="submitBtn border-plain" onClick={submitFilter}>
                  Submit
                </a>
                <a
                  className="btn btn-default m-l-15 border-plain"
                  onClick={resetFilter}
                >
                  Reset
                </a>
              </div>
            </div>

            {/* Table */}
            <div className="col-xs-12 p-0">
              <div className="table-responsive">
                <table className="table table_customization">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Business Type</th>
                      <th>Entity Name</th>
                      <th>Created At</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchantListRoute ? (
                      <>
                        {payout_merchant.entityList.map((list, i) =>
                          renderTableRow(list, i)
                        )}
                      </>
                    ) : (
                      <tr>
                        <td className="text-center" colSpan="15">
                          Access Denied
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="table-bottom-content">
                <Pagination
                  handle={getEntityList}
                  list={recordsLength}
                  currentpage={pageno}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {deletePopModel && (
        <Modal
          className="report_modal"
          isOpen={deletePopModel}
          ariaHideApp={false}
        >
          <div
            className="modal modalbg fade in"
            style={{ display: "block", overflowX: "hidden", overflowY: "auto" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                {/* HEADER */}
                <div className="modal-header">
                  <button
                    type="button"
                    className="close font-28"
                    onClick={() => handleDeleteCancel()}
                  >
                    &times;
                  </button>

                  <h4 className="modal-title modal-title-sapce">
                    Delete this Entity?
                  </h4>
                </div>

                <div className="modal-body clearfix ">
                  <div className="clearfix">
                    <div className="col-xs-12">
                      <div className="row">
                        <p className="text-muted">
                          {`Are you sure you want to delete ${entityNameData}?`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer text-center">
                  <button
                    type="button"
                    className="btn cancelBtn"
                    onClick={handleDeleteCancel}
                  >
                    No
                  </button>

                  <button
                    type="button"
                    className="btn submitBtn"
                    onClick={() => handleDeleteMerchant(entityId)}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default React.memo(EntityList);
