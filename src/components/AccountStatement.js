import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import { imagePath } from "../assets/ImagePath";
import ApexChart from "./Chart";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from ".././constants/ActionTypes";
import { ToastProvider, useToasts } from "react-toast-notifications";
import ApiGateway from "../DataServices/DataServices";
import {
  currencyFormatter,
  returnTimeZoneDate,
  textCapitalize,
  manipulateString,
  formatName,
  stripTime,
  getCookie,
} from "../DataServices/Utils";
// import TransactionDetail from "./TransactionDetail";
import TransactionDetail from "../components/TransactionDetailNew";
import Select from "react-select";
import { DateRange, DateRangePicker } from "react-date-range";
import moment from "moment";
import FilterList from "./FilterList";
import Pagination from "./Pagination";
import { AsyncPaginate } from "react-select-async-paginate";
import PropTypes from "prop-types";
import axios from "axios";
import cookie from "react-cookies";
import GBLVAR from "./../Global Variables/GlobalVariables";
import Loader from "./Loader";
import useRouteExist from "../DataServices/useRouteExist";
import {
  Link,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Modal from "react-modal";
import { set } from "lodash";
import { use } from "react";

const AccountStatement = (props) => {
  const { id,trans_id,trans_ref} = useParams();

  
  const acc_num = id;
  const { account_statement, payout_merchant } = useSelector((state) => state);

  const history = useHistory();

  const { loading } = useSelector((state) => state);
  const dispatch = useDispatch();
  const subAdminRoutes = getCookie("SubAdminRoutes");

  const latestValue = useRef({});
  const selectRef = useRef(null);
  latestValue.current = account_statement;
  const [active, setActive] = useState(false);
  const transactionListRoute = useRouteExist(["admin-transaction-list"]);
  const transactionStatusRoute = useRouteExist([
    "admin-transaction-view-status",
  ]);

  const transactionDetailRoute = useRouteExist(["admin-transaction-detail"]);
  const merchantListRoute = useRouteExist(["admin-transaction-merchant-list"]);
  const [pageno, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [recordsLength, setrecordLength] = useState([]);
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  const scheduledstatus = [
    { value: "", label: "All" },
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };
  const [selectionRange, setSelectionRange] = useState([
    {
      startDate: account_statement.startDate,
      endDate: account_statement.endDate,
      key: "selection",
    },
  ]);

  const [state, setState] = useState({
    auditLog: [],
  });

  const updateReducer = (a) => {
    return function (b) {
      if (b) {
        return updateReducer({ ...a, ...b });
      }
      dispatch(updateState(userConstants.TRANSACTION, a));
    };
  };
  const getAllData = async (searchQuery, loadedOptions, { page }) => {
    return new Promise((resolve, reject) => {
      let queryParam = "";
      queryParam += !searchQuery ? "" : `&search_term=${searchQuery}`;
      ApiGateway.get(
        `/payout/admin/account/list?page=${page}&limit=10${queryParam}`,
        function (response) {
          if (response) {
            resolve({
              options: response.data.accounts,
              hasMore: response.data.accounts.length >= 10,
              additional: {
                page: searchQuery ? 2 : page + 1,
              },
            });
          } else {
            reject(response);
          }
        }
      );
    });
  };

  const getAllMerchant = async (searchQuery, loadedOptions, { page }) => {
    return new Promise((resolve, reject) => {
      let queryParam = "";
      queryParam += !searchQuery ? "" : `&search_term=${searchQuery}`;
      ApiGateway.get(
        `/payout/admin/merchant/list?page=${page}&limit=10${queryParam}`,
        function (response) {
          if (response) {
            updateReducer({ isOpenMenu: !account_statement.isOpenMenu })();
            resolve({
              options: response.data.merchants,
              hasMore: response.data.merchants.length >= 10,
              additional: {
                page: searchQuery ? 2 : page + 1,
              },
            });
          } else {
            reject(response);
          }
        }
      );
    });
  };
  useEffect(() => {
    resetFilter();
  }, []);
  useEffect(() => {
    getTransactionList(pageno);
  }, [account_statement.filter, account_statement.filterList]);

  const Id_Filter = [
    { value: "trans_id", label: "Transaction ID" },
    { value: "search_term", label: "Beneficiary Name" },
    { value: "utr", label: "UTR" },
  ];
  const Trans_type = [
    { value: "", label: "All" },
    { value: "CREDIT", label: "Credits" },
    { value: "DEBIT", label: "Debits" },
    { value: "COM_CREDIT", label: "Commission" },
    { value: "INTNL_CREDIT", label: "Internal Transfer" },
  ];

  const Pay_mode = [
    { value: "", label: "All" },
    { value: "imps", label: "IMPS" },
    { value: "rtgs", label: "RTGS" },
    { value: "neft", label: "NEFT" },
    { value: "upi", label: "UPI" },
  ];

  const Contact_type = [
    { value: "customer", label: "Customer" },
    { value: "merchant", label: "Merchant" },
    { value: "employee", label: "Employee" },
    { value: "vendor", label: "Vendor" },
    { value: "supplier", label: "Supplier" },
  ];

  const Duration_Filter = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "3month", label: "Last 3 Months" },
    /*  { value: "6month", label: "Last 6 Months" },
        { value: "year", label: "Last year" }, */
  ];
  const status_filter = [
    { value: "", label: "All" },
    { value: "processing", label: "Processing" },
    { value: "queued", label: "Queued" },
    { value: "accepted", label: "Accepted" },
    { value: "success", label: "Success" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const Source_filter = [
    { value: "payout", label: "Payout" },
    { value: "acc_veri", label: "Account Verification" },
    { value: "refund", label: "Refund" },
    { value: "ecollect", label: "Ecollect" },
    { value: "upi_verification", label: "UPI Verification" },
    { value: "acc_creation", label: "Account Creation" },
  ];
  const showFilterList = () => {
    if (
      account_statement.searchTerm !== "" ||
      (account_statement[account_statement.search_type] !== undefined &&
        account_statement[account_statement.search_type] !== "")
    ) {
      let params = "";
      params +=
        account_statement[account_statement.search_type] === undefined ||
        account_statement[account_statement.search_type] === ""
          ? ""
          : `&${account_statement.search_type}=` +
            account_statement[account_statement.search_type];
      dispatch(
        updateState(userConstants.TRANSACTION, {
          filter: params,
        })
      );
      setPageNo(1);
    }
  };
  let todayFromDate = moment().startOf("date").toString();
  let todayEndDate = moment().endOf("date").toString();
  const todayData = (e) => {
    dispatch(
      updateState(userConstants.TRANSACTION, {
        fromDate: todayFromDate,
        toDate: todayEndDate,
      })
    );
  };

  const submitSerchFilter = () => {
    let queryParam = "";

    queryParam += !id ? "" : `&van.account.number=${acc_num}`;
    queryParam += !account_statement.reseller_id
      ? ""
      : `&reseller.id=${account_statement.reseller_id}`;
    queryParam += !account_statement.merchant_id
      ? ""
      : `&merchant_id=${account_statement.merchant_id}`;
      queryParam += !trans_id
      ? ""
      : `&trans_ref=${trans_id}`;
      queryParam += !trans_ref
      ? ""
      : `&trans_ref=${trans_ref}`;
    queryParam +=
      !account_statement.trans_type || account_statement.trans_type === "all"
        ? ""
        : `&trans_type=${account_statement.trans_type}`;
    queryParam += !account_statement.status
      ? ""
      : `&status=${account_statement.status}`;
    queryParam += !account_statement.content_type_filter
      ? ""
      : `&contact_type=${account_statement.content_type_filter}`;
    queryParam += !account_statement.pay_mode
      ? ""
      : `&pay_mode=${account_statement.pay_mode.toUpperCase()}`;
    queryParam += !account_statement.contact_type
      ? ""
      : `&contact_type=${account_statement.contact_type}`;
    queryParam +=
      account_statement.fromDate === ""
        ? ""
        : "&from_date=" + account_statement.fromDate;
    queryParam +=
      account_statement.toDate === ""
        ? ""
        : "&to_date=" + account_statement.toDate;
    queryParam += !account_statement.selection
      ? ""
      : `&selection=${account_statement.selection}`;
    queryParam +=
      account_statement.searchTerm &&
      account_statement.search_type == "trans_id"
        ? "&trans_id=" + account_statement.searchTerm
        : "";
    queryParam += !account_statement.productType_value
      ? ""
      : `&product_type=${account_statement.productType_value}`;
    queryParam += !account_statement.isScheduled
      ? ""
      : `&is_scheduled=${account_statement.isScheduled}`;
    queryParam += !account_statement.productType_value
      ? ""
      : `&product_type=${account_statement.productType_value}`;
    queryParam += !account_statement.nodal_id
      ? ""
      : `&nodal=${account_statement.nodal_id}`;

    queryParam +=
      account_statement[account_statement.search_type] === undefined ||
      account_statement[account_statement.search_type] === ""
        ? ""
        : `&${account_statement.search_type}=` +
          account_statement[account_statement.search_type];

    dispatch(
      updateState(userConstants.TRANSACTION, {
        filter: queryParam,
      })
    );
    setPageNo(1);
  };

  const getTransactionList = (page) => {
    setPageNo(page);
    let query=""
    query += !trans_id
    ? ""
    : `&trans_ref=${trans_id}`;

    query += !trans_ref
    ? ""
    : `&trans_id=${trans_ref}`;
    dispatch(updateState(userConstants.LOADER, { loading: true }));
    ApiGateway.get(
      `/payout/admin/transaction/list?page=${page}&limit=${limit}${
        account_statement.filter ? account_statement.filter : ""
      }${query}`,
      function (response) {
        if (response.success) {
          dispatch(
            updateState(userConstants.TRANSACTION, {
              TransactionList: response.data.transactions,
            })
          ).then(() => {
            dispatch(updateState(userConstants.LOADER, { loading: false }));
          });
          setrecordLength(response.data.transactions.length);
        } else {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          applyToast(response.message, "error");
        }
      }
    );
  };
  const closeModal = useCallback(() => {
    setState((prev) => ({ ...prev, auditLog: [] }));
    dispatch(
      updateState(userConstants.TRANSACTION, {
        isTransDetail: false,
        TransactionDetail: {},
      })
    );
  }, []);

  const auditLogDetail = (id) => {
    ApiGateway.get(`/payout/admin/transaction/audit/${id}`, (response) => {
      if (response.success) {
        setState((prev) => ({
          ...prev,
          auditLog: response.data?.transaction_audit,
        }));
      } else {
        // applyToast(response.message, "info");
      }
    });
  };

  const memoizedValue = useMemo(() => {
    return {
      isTransDetail: account_statement.isTransDetail,
      TransactionDetail: account_statement.TransactionDetail,
      auditLog: state?.auditLog,
    };
  }, [
    account_statement.TransactionDetail,
    account_statement.isTransDetail,
    state?.auditLog,
  ]);

  const viewDetail = (trans_id) => {
    dispatch(updateState(userConstants.LOADER, { loading: true }));

    ApiGateway.get(
      `/payout/admin/transaction/detail?trans_id=${trans_id}`,
      function (response) {
        if (response.success) {
          auditLogDetail(trans_id);
          dispatch(
            updateState(userConstants.TRANSACTION, {
              TransactionDetail: response.data.transaction,
              isTransDetail: true,
            })
          );
          dispatch(updateState(userConstants.LOADER, { loading: false }));
        } else {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
        }
      }
    );
  };

  const [seacrhBox, setSeacrhBox] = useState(true);

  const selectSource = (e) => {
    dispatch(
      updateState(userConstants.TRANSACTION, {
        productType_value: e.value,
        productType: e,
      })
    );
  };
  const selectScheduleFilter = (e) => {
    dispatch(
      updateState(userConstants.TRANSACTION, {
        isScheduled: e.value,
        isScheduled_label: e,
      })
    );
  };
  const selectFilter = (filter, e) => {
    setActive(true);
    setSeacrhBox(false);
    let str = manipulateString(filter);
    dispatch(
      updateState(userConstants.TRANSACTION, {
        [filter]: e.value,
        [str]: e,
        searchTerm:
          "filter" === "search_type" ? "" : account_statement.searchTerm,
      })
    );
  };

  const dateChange = (dates) => {
    setSelectionRange([dates.selection]);
    dispatch(
      updateState(userConstants.TRANSACTION, {
        startDate: dates.selection.startDate,
        endDate: dates.selection.endDate,
      })
    );
  };

  const handleSearchChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    dispatch(updateState(userConstants.TRANSACTION, { [name]: value }));
  };

  const resetFilter = () => {
    if (selectionRange) {
      setSelectionRange([
        {
          startDate: null,
          endDate: new Date(""),
          key: "selection",
        },
      ]);
    }

    setPageNo(1);
    let account_statement_copy = account_statement;
    if (account_statement_copy.trans_type) {
      delete account_statement_copy.trans_type;
      delete account_statement_copy.TransType;
    }
    if (account_statement_copy.status) {
      delete account_statement_copy.status;
      delete account_statement_copy.Status;
    }
    if (account_statement_copy.pay_mode) {
      delete account_statement_copy.pay_mode;
      delete account_statement_copy.PayMode;
    }
    if (account_statement.merchant_id) {
      delete account_statement.merchant_id;
      delete account_statement_copy.MerchantId;
    }
    if (account_statement.productType) {
      delete account_statement.productType;
      delete account_statement.productType_value;
    }
    if (account_statement.isScheduled) {
      delete account_statement.isScheduled;
      delete account_statement.isScheduled_label;
    }
    if (account_statement_copy.van_account_no) {
      delete account_statement_copy.van_account_no;
      delete account_statement.VanAccountNo;
    }

    if (account_statement_copy.contact_type) {
      delete account_statement_copy.contact_type;
      delete account_statement_copy.ContactType;
    }
    if (account_statement_copy.from) {
      account_statement_copy.startDate = new Date();
      account_statement_copy.endDate = new Date();
      account_statement_copy.from = "";
      account_statement_copy.to = "";
      account_statement_copy.fromDate = "";
      account_statement_copy.toDate = "";
      delete account_statement_copy.Dates;
    }
    if (account_statement_copy.selection) {
      delete account_statement_copy.selection;
      delete account_statement_copy.Selection;
    }
    if (account_statement_copy.searchTerm) {
      delete account_statement_copy.searchTerm;
      account_statement_copy.searchTerm = "";
    }
    if (account_statement_copy.search_type) {
      delete account_statement_copy[account_statement_copy.search_type];
      delete account_statement_copy.SearchType;
      account_statement_copy.search_type = "";
      getTransactionList(pageno);
    }

    if (account_statement_copy.reseller_id) {
      delete account_statement_copy.reseller_id;
      delete account_statement_copy.reseller_name;
    }
    if (account_statement_copy.nodal_id) {
      delete account_statement_copy.nodal_name;
      delete account_statement_copy.nodal_id;
    }
    dispatch(
      updateState(userConstants.TRANSACTION, {
        ...account_statement_copy,
      })
    );
    dispatch(
      updateState(userConstants.TRANSACTION, {
        filter: "",
      })
    );
    setActive(false);
    setSeacrhBox(true);
  };

  const submitDateFilter = () => {
    const account_statement = latestValue.current;
    if (account_statement.endDate > account_statement.startDate) {
      dispatch(
        updateState(userConstants.TRANSACTION, {
          from: moment(account_statement.startDate).format("DD/MM/YYYY"),
          to: moment(account_statement.endDate).format("DD/MM/YYYY"),
          fromDate: moment(account_statement.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(account_statement.endDate)
            .utc()
            .add(1, "days")
            .endOf("day")
            .format(),
          open_picker: false,
        })
      );
    } else {
      dispatch(
        updateState(userConstants.TRANSACTION, {
          from: moment(account_statement.startDate).format("DD/MM/YYYY"),
          to: moment(account_statement.startDate).format("DD/MM/YYYY"),
          fromDate: moment(account_statement.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(account_statement.startDate)
            .utc()
            .add(1, "days")
            .endOf("day")
            .format(),
          open_picker: false,
        })
      );
    }
  };

  const exportRecords = () => {
    if (!account_statement.fromDate && !account_statement.fromDate) {
      applyToast("Please select From date and To date", "error");

      return false;
    }
    dispatch(updateState(userConstants.LOADER, { loading: true }));
    const rawQuery = {
      trans_type: account_statement.trans_type,
      pay_mode: account_statement.pay_mode,
      contact_type: account_statement.contact_type,
      "createdAt.$gte": stripTime(account_statement.fromDate),
      "createdAt.$lte": stripTime(account_statement.toDate),
      selection: account_statement.selection,
      searchTerm: account_statement.searchTerm,
      [account_statement.search_type]:
        account_statement[account_statement.search_type],
      van_account_no: account_statement.van_account_no,
      "merchant.id": account_statement.merchant_id,
      status: account_statement.status,
      "nodal_bank.id": account_statement.nodal_id,
    };

    const cleanQuery = Object.fromEntries(
      Object.entries(rawQuery).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    );

    const requestBody = { purpose: "transactionReport", query: cleanQuery };
    ApiGateway.post(
      `/payout/admin/downloadmanager/report/download`,
      requestBody,
      function (response) {
        if (response.success) {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          applyToast(response?.message, "success");
          setTimeout(() => {
            history.push("/report-list");
          }, 2000);
        } else {
          applyToast(response?.message, "info");
          dispatch(updateState(userConstants.LOADER, { loading: false }));
        }
      }
    );
  };

  const selectAccountNumber = (filter, e) => {
    let str = manipulateString(filter);
    dispatch(
      updateState(userConstants.TRANSACTION, {
        [filter]: e.virtual_account_number,
        [str]: e,
        searchTerm:
          "filter" === "search_type" ? "" : account_statement.searchTerm,
      })
    );
  };
  const selectMerchantFilter = (filter, e) => {
    let str = manipulateString(filter);
    dispatch(
      updateState(userConstants.TRANSACTION, {
        [filter]: e.merchantId,
        [str]: e,
        searchTerm:
          "filter" === "search_type" ? "" : account_statement.searchTerm,
      })
    );
  };

  const selectResellerFilter = (e) => {
    dispatch(
      updateState(userConstants.TRANSACTION, {
        reseller_id: e.reseller_id,
        reseller_name: e,
      })
    );
  };
  const selectNodalFilter = (e) => {
    dispatch(
      updateState(userConstants.TRANSACTION, {
        nodal_id: e.bank_id,
        nodal_name: e,
      })
    );
  };
  const getAllResller = async (searchQuery, loadedOptions, { page }) => {
    return new Promise((resolve, reject) => {
      let queryParam = "";
      queryParam += !searchQuery ? "" : `&search_term=${searchQuery}`;
      ApiGateway.get(
        `/payout/admin/reseller/list?page=${page}&limit=10${queryParam}`,
        function (response) {
          if (response) {
            resolve({
              options: response.data.resellers,
              hasMore: response.data.resellers.length >= 10,
              additional: {
                page: searchQuery ? 2 : page + 1,
              },
            });
          } else {
            reject(response);
          }
        }
      );
    });
  };

  const getNodalList = async (searchQuery, loadedOptions, { page }) => {
    return new Promise((resolve, reject) => {
      let queryParam = "";
      queryParam += !searchQuery ? "" : `&search_term=${searchQuery}`;
      // ApiGateway.get(`/payout/admin/nodal/list?page=${page}&limit=10${queryParam}`, function (response) {
      ApiGateway.get(
        `/payout/admin/downloadmanager/nodal/list?page=${page}&limit=10${queryParam}`,
        function (response) {
          if (response) {
            resolve({
              options: response.data.list,
              hasMore: response.data.list.length >= 10,
              additional: {
                page: searchQuery ? 2 : page + 1,
              },
            });
          } else {
            reject(response);
          }
        }
      );
    });
  };

  const openStatusModal = (id) => {
    dispatch(
      updateState(userConstants.TRANSACTION, {
        statusModal: !account_statement.statusModal,
        statusTransId: id,
      })
    );

    let data = {
      trans_id: id,
    };

    dispatch(updateState(userConstants.LOADER, { loading: true }));
    ApiGateway.post("/payout/admin/transaction/status", data, (response) => {
      if (response.success) {
        dispatch(updateState(userConstants.LOADER, { loading: false }));
        dispatch(
          updateState(userConstants.TRANSACTION, {
            statusResponse: response.data,
          })
        );
        applyToast(response.message, "success");
      } else {
        dispatch(updateState(userConstants.LOADER, { loading: false }));
        applyToast(response.message, "error");
      }
    });
  };

  const closeStatusModal = () => {
    dispatch(
      updateState(userConstants.TRANSACTION, {
        statusModal: !account_statement.statusModal,
        statusTransId: "",
        statusResponse: "",
      })
    );
  };

  return (
    <div className="content_wrapper dash_wrapper">
      {transactionListRoute ? (
        <>
          {loading.loading && <Loader />}
          <div className="dash_merchent_welcome">
            <div className="merchent_wlcome_content">
              Account Statement {acc_num ? `${acc_num}` : ""}
              <div className="bread_crumb">
                <ul className="breadcrumb">
                  <li>
                    <Link to="/dashboard" className="inactive_breadcrumb">
                      Home
                    </Link>
                  </li>
                  <li className="active_breadcrumb">Account Statment</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="white_tab_wrap">
            <div className="white_tab_box">
              <div className="col-xs-12 m-b-30 p-0">
                <div className="col-md-6 p-l-0">
                  <div className="trans-text m-b-5 color-grey font-semibold">
                    Select by UTR / Transaction No. / Name
                  </div>
                  <div className="payout_popup_search ">
                    <div className="input-group">
                      <input
                        className="payout_popup_search_input"
                        type="text"
                        name={account_statement.search_type || "searchTerm"}
                        value={
                          account_statement[account_statement.search_type] ||
                          account_statement.searchTerm
                        }
                        onChange={handleSearchChange}
                        disabled={seacrhBox}
                        style={{ backgroundColor: active ? "#fff" : "#f1f1f1" }}
                      />

                      <div className="payout_popup_search_select">
                        <Select
                          className="selectpicker"
                          options={Id_Filter}
                          value={
                            account_statement.SearchType !== undefined &&
                            account_statement.SearchType
                          }
                          onChange={(e) => {
                            selectFilter("search_type", e);
                          }}
                        />
                      </div>

                      <span
                        className="input-group-addon"
                        onClick={submitSerchFilter}
                      >
                        <i className="fa fa-search"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 p-l-0">
                  <div className="trans-text m-b-5 color-grey font-semibold">
                    Select By Type
                  </div>
                  <Select
                    className="selectpicker"
                    options={Trans_type}
                    onChange={(e) => selectFilter("trans_type", e)}
                    value={
                      account_statement.TransType !== undefined &&
                      account_statement.TransType
                    }
                  />
                </div>
                <div className="col-xs-12 col-md-3 p-0">
                  <div className="trans-text m-b-5 color-grey font-semibold">
                    Select By Payment Mode
                  </div>
                  <Select
                    className="selectpicker"
                    options={Pay_mode}
                    onChange={(e) => selectFilter("pay_mode", e)}
                    value={
                      account_statement.PayMode !== undefined &&
                      account_statement.PayMode
                    }
                  />
                </div>

                <div className="col-xs-12 p-0 m-t-30">
                  <div className="col-xs-12 col-md-3 p-0">
                    <div className="trans-text m-b-5 color-grey font-semibold">
                      Select By Dates
                    </div>
                    <input
                      className="fileter_form_input"
                      id="from_date"
                      name="date"
                      placeholder=""
                      type="text"
                      onClick={() =>
                        dispatch(
                          updateState(userConstants.TRANSACTION, {
                            open_picker: !account_statement.open_picker,
                          })
                        )
                      }
                      value={
                        account_statement.from !== "" &&
                        account_statement.to !== ""
                          ? `${account_statement.from} ~ ${account_statement.to}`
                          : ""
                      }
                    />
                    <div
                      className={
                        account_statement.open_picker
                          ? "react_date_range_picker"
                          : "react_date_range_picker hide"
                      }
                    >
                      <DateRangePicker
                        months={2}
                        ranges={selectionRange}
                        onChange={(e) => dateChange(e)}
                        direction="horizontal"
                        maxDate={new Date()}
                        showMonthAndYearPickers={false}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        showPreview={false}
                        showDateDisplay={false}
                      />
                      <span
                        className="submitDateBtn"
                        onClick={submitDateFilter}
                      >
                        Submit
                      </span>
                    </div>
                  </div>

                  <div className="col-xs-12 col-md-3">
                    <div className="trans-text m-b-5 color-grey font-semibold">
                      Select By Duration
                    </div>
                    <Select
                      className="selectpicker"
                      options={Duration_Filter}
                      onChange={(e) => selectFilter("selection", e)}
                      value={
                        account_statement.Selection !== undefined &&
                        account_statement.Selection
                      }
                    />
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <label className="trans-text m-b-5 color-grey font-semibold">
                      Select By Status
                    </label>
                    <Select
                      className="selectpicker"
                      options={status_filter}
                      placeholder="Status"
                      onChange={(e) => selectFilter("status", e)}
                      value={
                        account_statement.Status !== undefined &&
                        account_statement.Status
                      }
                    />
                  </div>
                  {/*  <>
                    <div className="col-xs-12 col-md-3 p-r-0">
                      <div className="trans-text m-b-5 color-grey font-semibold ">
                        Select By Account Number
                      </div>

                      <>
                        <AsyncPaginate
                          loadOptions={getAllData}
                          getOptionValue={(option) =>
                            option.virtual_account_number
                          }
                          getOptionLabel={(option) =>
                            option.virtual_account_number
                          }
                          onChange={(e) =>
                            selectAccountNumber("van_account_no", e)
                          }
                          isSearchable={true}
                          placeholder="Select Account Number"
                          additional={{
                            page: 1,
                          }}
                          value={
                            account_statement.VanAccountNo !== undefined &&
                            account_statement.VanAccountNo
                          }
                        />
                      </>
                    </div>
                  </> */}
                  {merchantListRoute && (
                    <div className="col-xs-12 col-md-3">
                      <div className="trans-text m-b-5 color-grey font-semibold">
                        Select by Business Name
                      </div>
                      <>
                        <AsyncPaginate
                          loadOptions={getAllMerchant}
                          getOptionValue={(option) => option.merchantId}
                          getOptionLabel={(option) => option.businessName}
                          onChange={(e) =>
                            selectMerchantFilter("merchant_id", e)
                          }
                          isSearchable={true}
                          placeholder="Select Buisness Name"
                          additional={{
                            page: 1,
                          }}
                          classNamePrefix={"react-select"}
                          value={
                            account_statement.MerchantId !== undefined &&
                            account_statement.MerchantId
                          }
                        />
                      </>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xs-12 m-b-10 p-0 ">
                <div className="col-xs-12 col-md-3 p-0">
                  <div className="trans-text m-b-5 color-grey font-semibold">
                    Select By Source
                  </div>
                  <Select
                    className="selectpicker"
                    options={Source_filter}
                    placeholder="Select..."
                    onChange={(e) => selectSource(e)}
                    value={
                      account_statement.productType !== undefined &&
                      account_statement.productType
                    }
                  />
                </div>

                {subAdminRoutes !== "RESELLER" && (
                  <div className="col-xs-12 col-md-3 p-r-0">
                    <label className="trans-text m-b-5  color-grey font-semibold">
                      Select Reseller Name
                    </label>
                    <div className="">
                      <AsyncPaginate
                        loadOptions={getAllResller}
                        getOptionValue={(option) => option?.reseller_id}
                        getOptionLabel={(option) => option?.reseller_name}
                        onChange={(e) => selectResellerFilter(e)}
                        isSearchable={true}
                        placeholder="Select Reseller"
                        additional={{
                          page: 1,
                        }}
                        classNamePrefix={"react-select"}
                        value={
                          account_statement.reseller_name !== undefined &&
                          account_statement.reseller_name
                        }
                      />
                    </div>
                  </div>
                )}
                <div className="col-xs-12 col-md-3 p-r-0">
                  <label className="trans-text m-b-5  color-grey font-semibold">
                    Scheduled Payment Status
                  </label>
                  <div className="">
                    <Select
                      className="selectpicker"
                      options={scheduledstatus}
                      onChange={(e) => selectScheduleFilter(e)}
                      value={
                        account_statement.isScheduled_label !== undefined &&
                        account_statement.isScheduled_label
                      }
                    />
                  </div>
                </div>

                <div className="col-xs-12 col-md-3 p-r-0">
                  <label className="trans-text m-b-5  color-grey font-semibold">
                    Select Escrow / Pool Account
                  </label>
                  <div className="">
                    <AsyncPaginate
                      loadOptions={getNodalList}
                      getOptionValue={(option) => option?.bank_id}
                      getOptionLabel={(option) => option?.name}
                      onChange={(e) => selectNodalFilter(e)}
                      isSearchable={true}
                      placeholder="Select..."
                      additional={{
                        page: 1,
                      }}
                      classNamePrefix={"react-select"}
                      value={
                        account_statement.nodal_name !== undefined &&
                        account_statement.nodal_name
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="col-xs-12 m-b-10 p-0 textCenter">
                <label className="col-xs-12 m-t-25 ">
                  <span
                    className="submitBtn border-plain"
                    onClick={submitSerchFilter}
                  >
                    Submit
                  </span>
                  <span
                    className="btn btn-default  border-plain m-l-15 pointer-cursor"
                    onClick={resetFilter}
                  >
                    Reset
                  </span>
                  <span className="submitBtn m-l-15" onClick={exportRecords}>
                    Export
                  </span>
                </label>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div className="int_transfer">
                    <span className="transfer_highlight"></span>&nbsp;- Denotes
                    Internal Transfer
                  </div>
                  <div className="table-responsive m-t-5">
                    <table className="table  table_customization">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          {transactionDetailRoute && <th>Transaction ID</th>}
                          <th>Transaction Time</th>
                          <th>Source</th>
                          <th>Mode</th>
                          {transactionStatusRoute && <th>Status</th>}
                          <th>Type</th>
                          <th>Business Name</th>
                          <th>Beneficiary</th>
                          {/* <th>Contact Name</th>
                                            <th>Contact Phone Number</th>
                                            <th>Contact Email</th> */}
                          {transactionDetailRoute && <th>Action</th>}
                          <th>Withdrawal Amount</th>
                          <th>Deposit Amount</th>
                          <th>Closing Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {account_statement.TransactionList.map((list, i) => {
                          return (
                            <tr
                              key={"list" + i}
                              className={
                                list?.remarks === "internaltransfer"
                                  ? "internaltransfer_background"
                                  : ""
                              }
                            >
                              <td>{(pageno - 1) * limit + (i + 1)}</td>
                              {transactionDetailRoute && (
                                <>
                                  <td>
                                    {list?.trans_id ? (
                                      <a
                                        onClick={() =>
                                          viewDetail(list?.trans_id)
                                        }
                                        className="remarks_tooltip"
                                      >
                                        {list?.trans_id ? list?.trans_id : "-"}
                                        <span className="remarks_tooltip_popup">
                                          <span className="tootip_head">
                                            Payout Purpose:{" "}
                                          </span>
                                          <span className="toottip_content">
                                            {list?.remarks
                                              ? list?.remarks
                                              : "-"}
                                          </span>
                                        </span>
                                      </a>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                </>
                              )}
                              <td>
                                {list?.createdAt
                                  ? returnTimeZoneDate(list?.createdAt)
                                  : "-"}
                              </td>
                              <td>
                                {list?.product_type
                                  ? list?.product_type === "acc_veri"
                                    ? "Account Verification"
                                    : formatName(list?.product_type)
                                  : "-"}
                              </td>
                              <td>{list?.pay_mode ? list?.pay_mode : "-"}</td>
                              {transactionStatusRoute && (
                                <td>
                                  <span
                                    className={
                                      list?.status == "success"
                                        ? "label_success pointer"
                                        : list?.status == "pending"
                                        ? "label_warning pointer"
                                        : list?.status == "processing"
                                        ? "label_edit pointer"
                                        : list?.status == "failed"
                                        ? "label_danger pointer"
                                        : "label_edit pointer"
                                    }
                                    onClick={() =>
                                      openStatusModal(list?.trans_id)
                                    }
                                  >
                                    {list?.status
                                      ? textCapitalize(list?.status)
                                      : ""}
                                  </span>
                                </td>
                              )}
                              <td>
                                {list?.trans_type
                                  ? list?.trans_type.toLowerCase() ===
                                    "com_credit"
                                    ? "Credit Commission"
                                    : list?.trans_type.toLowerCase() ===
                                      "intnl_credit"
                                    ? "Internal Transfer"
                                    : formatName(list?.trans_type)
                                  : ""}
                              </td>
                              <td>
                                {list?.merchant && list?.merchant?.name
                                  ? list?.merchant?.name
                                  : "-"}
                              </td>
                              <td>
                                {list?.beneficiary &&
                                list?.beneficiary?.name &&
                                list?.beneficiary?.name?.full
                                  ? list?.beneficiary?.name?.full
                                  : "-"}
                              </td>
                              {/* <td>{list?.contact?.name?.full ? list?.contact?.name?.full : "-" }</td>
                                                        <td>{list?.contact?.mobile?.national_number ? list?.contact?.mobile?.national_number : "-" }</td>
                                                        <td>{list?.contact?.email ? list?.contact?.email : "-" }</td> */}
                              {transactionDetailRoute && (
                                <td>
                                  <a
                                    onClick={() => viewDetail(list?.trans_id)}
                                    className="label_edit"
                                  >
                                    View
                                  </a>
                                </td>
                              )}
                              <td>
                                {list?.trans_type &&
                                list?.trans_type.toLowerCase() == "debit"
                                  ? currencyFormatter(
                                      Math.round(list?.final_amount * 100) /
                                        100,
                                      { code: "INR" }
                                    )
                                  : "-"}
                              </td>
                              <td>
                                {list?.trans_type &&
                                list?.trans_type.toLowerCase() == "credit"
                                  ? currencyFormatter(
                                      Math.round(list?.final_amount * 100) /
                                        100,
                                      { code: "INR" }
                                    )
                                  : list?.trans_type &&
                                    list?.trans_type.toLowerCase() ==
                                      "com_credit"
                                  ? currencyFormatter(
                                      Math.round(list?.final_amount * 100) /
                                        100,
                                      { code: "INR" }
                                    )
                                  : "-"}
                              </td>
                              <td>
                                {list?.closing_balance
                                  ? currencyFormatter(
                                      Math.round(list?.closing_balance * 100) /
                                        100,
                                      { code: "INR" }
                                    )
                                  : "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="table-bottom-content">
                    <Pagination
                      handle={getTransactionList}
                      list={recordsLength}
                      currentpage={pageno}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TransactionDetail {...memoizedValue} closeModal={closeModal} />

          <Modal
            className="report_modal"
            isOpen={account_statement.statusModal}
            ariaHideApp={false}
          >
            <div
              className="modal modalbg fade in"
              style={{
                display: "block",
                overflowX: "hidden",
                overflowY: "auto",
              }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="close font-28"
                      onClick={closeStatusModal}
                    >
                      ×
                    </button>
                    <h4 className="modal-title modal-title-sapce">
                      Transaction Status - #
                      {account_statement?.statusTransId
                        ? account_statement?.statusTransId
                        : "-"}
                    </h4>
                  </div>
                  <div className="modal-body clearfix ">
                    <div className=" clearfix">
                      <div className="col-xs-12">
                        <div className="row">
                          <div className="col-xs-12 col-md-6">UTR No :</div>
                          <div className="col-xs-12 col-md-5">
                            {account_statement?.statusResponse?.utrNo
                              ? account_statement?.statusResponse?.utrNo
                              : "-"}
                          </div>
                        </div>
                        <div className="row m-t-10">
                          <div className="col-xs-12 col-md-6">
                            Processing Date :
                          </div>
                          <div className="col-xs-12 col-md-5">
                            {account_statement?.statusResponse?.processingDate
                              ? account_statement?.statusResponse
                                  ?.processingDate
                              : "-"}
                          </div>
                        </div>
                        <div className="row m-t-10">
                          <div className="col-xs-12 col-md-6">CRN :</div>
                          <div className="col-xs-12 col-md-5">
                            {account_statement?.statusResponse?.crn
                              ? account_statement?.statusResponse?.crn
                              : "-"}
                          </div>
                        </div>
                        <div className="row m-t-10">
                          <div className="col-xs-12 col-md-6">Status :</div>
                          <div className="col-xs-12 col-md-5">
                            {account_statement?.statusResponse
                              ?.transactionStatus
                              ? account_statement?.statusResponse?.transactionStatus.toUpperCase()
                              : "-"}
                          </div>
                        </div>
                        <div className="row m-t-10">
                          <div className="col-xs-12 col-md-6">
                            Description :
                          </div>
                          <div className="col-xs-12 col-md-5">
                            {account_statement?.statusResponse
                              ?.statusDescription
                              ? account_statement?.statusResponse
                                  ?.statusDescription
                              : "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </>
      ) :
 <>
      <div className="dash_merchent_welcome">
      <div className="merchent_wlcome_content">
        Account Statement {acc_num ? `${acc_num}` : ""}
        <div className="bread_crumb">
          <ul className="breadcrumb">
            <li>
              <Link to="/dashboard" className="inactive_breadcrumb">
                Home
              </Link>
            </li>
            <li className="active_breadcrumb">Account Statment</li>
          </ul>
        </div>
      </div>
    </div>
      <div className="white_tab_wrap">
      <div className="white_tab_box">
        <div className="col-xs-12 text-center p-0 access-denied">
          Access Denied to view this Section. Contact Admin.
        </div>
      </div>
    </div></>}
    </div>
  );
};

export default AccountStatement;
