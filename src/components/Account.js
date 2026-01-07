import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import { imagePath } from "../assets/ImagePath";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { userConstants } from ".././constants/ActionTypes";
import { ToastProvider, useToasts } from "react-toast-notifications";
import ApiGateway from "../DataServices/DataServices";
import Pagination from "./Pagination";
import {
  validate,
  manipulateString,
  textCapitalize,
  returnTimeZoneDate,
  formatDate,
  formatLabel,
} from "../DataServices/Utils";
import moment from "moment";
import { DateRange, DateRangePicker } from "react-date-range";
import Select from "react-select";
import FilterList from "./FilterList";
import { AsyncPaginate } from "react-select-async-paginate";
import useRouteExist from "../DataServices/useRouteExist";
import Loader from "./Loader";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Modal from "react-modal";

import Time from "../assets/images/time-info.png";
import Success from "../assets/images/check.png";
import Failed from "../assets/images/error.png";
const Account = () => {
  const { account, account_statement } = useSelector((state) => state);
  const dispatch = useDispatch();
  const latestValue = useRef({});
  latestValue.current = account;
  const [loading, setLoading] = useState(false);
  const [pageno, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [state, setState] = useState({
    auditLog: [],
  });
  const [recordsLength, setrecordLength] = useState([]);
  const accountListRoute = useRouteExist(["admin-account-list"]);
  const accountDetailRoute = useRouteExist(["admin-account-detail"]);
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };
  useEffect(() => {
    getAccountList(pageno);
  }, [account.page, account.filter]);

  useEffect(() => {
    resetFilter();
  }, []);
  const updateReducer = (a) => {
    return function (b) {
      if (b) {
        return updateReducer({ ...a, ...b });
      }
      dispatch(updateState(userConstants.ACCOUNT, a));
    };
  };
  const onChange = (page) => {
    updateReducer({ page })();
  };
  const submitFilter = () => {
    var queryParam = "";
    queryParam += !account.merchant_id
      ? ""
      : `&merchant_id=${account.merchant_id}`;
    queryParam += account.fromDate ? `&from_date=${account.fromDate}` : "";
    queryParam += account.toDate ? `&to_date=${account.toDate}` : "";
    queryParam +=
      !account.status || account.status === "all"
        ? ""
        : `&status=${account.status}`;
    queryParam += !account.selection ? "" : `&selection=${account.selection}`;
    queryParam += !account.contact_type
      ? ""
      : `&contact_type=${account.contact_type}`;
    queryParam += account.searchTerm
      ? "&search_term=" + account.searchTerm
      : "";
    queryParam +=
      account[account.search_type] === undefined ||
      account[account.search_type] === ""
        ? ""
        : `&${account.search_type}=` + account[account.search_type];
    dispatch(updateState(userConstants.ACCOUNT, { filter: queryParam }));
    setPageNo(1);
  };
  const getAccountList = (page) => {
    setPageNo(page);
    setLoading(true);
    ApiGateway.get(
      `/payout/admin/account/list?page=${page}&limit=${limit}${
        account.filter ? account.filter : ""
      }`,
      function (response) {
        if (response.success) {
          setLoading(false);
          dispatch(
            updateState(userConstants.ACCOUNT, {
              accountList: response.data.accounts,
            })
          )
          setrecordLength(response.data.accounts.length);
        } else {
          setLoading(false);

          applyToast(response.message, "error");
        }
      }
    );
  };

  const changeTab = (a) => {
    return function (b) {
      if (b) {
        return changeTab({ [a]: b });
      }
      dispatch(updateState(userConstants.ACCOUNT, a));
    };
  };

  const selectFilter = useCallback((filter, e) => {
    let str = manipulateString(filter);
    dispatch(
      updateState(userConstants.ACCOUNT, { [filter]: e.value, [str]: e })
    );
  }, []);

  const Duration_Filter = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "3month", label: "Last 3 Months" },
    /*   { value: '6month', label: 'Last 6 Months' },
        { value: 'year', label: 'Last year' } */
  ];

  const Contact_type = [
    { value: "customer", label: "Customer" },
    { value: "merchant", label: "Merchant" },
    { value: "employee", label: "Employee" },
    { value: "vendor", label: "Vendor" },
    { value: "supplier", label: "Supplier" },
  ];

  const Status_Filter = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];
  const handleSearchChange = useCallback((e) => {
    var name = e.target.name;
    var value = e.target.value;
    dispatch(updateState(userConstants.ACCOUNT, { [name]: value }));
  }, []);

  const handleChange = useCallback((merchant) => {
    updateReducer({ selectedMerchant: merchant !== null ? merchant : {} })({
      merchant_id: merchant !== null ? merchant.value : "",
    })();
  }, []);
  const [seacrhBox, setSeacrhBox] = useState(true);
  const selectAccountFilter = (filter) => {
    setSeacrhBox(false);
    dispatch(
      updateState(userConstants.ACCOUNT, {
        merchant_id: filter.merchantId,
        FullName: filter,
        searchTerm: "filter" === "search_type" ? "" : account.searchTerm,
      })
    );
  };

  const getAllMerchant = async (searchQuery, loadedOptions, { page }) => {
    return new Promise((resolve, reject) => {
      let queryParam = "";
      queryParam += !searchQuery ? "" : `&search_term=${searchQuery}`;
      ApiGateway.get(
        `/payout/admin/merchant/list?page=${page}&limit=10${queryParam}`,
        function (response) {
          if (response) {
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
  const selectMerchantFilter = (filter, e) => {
    let str = manipulateString(filter);
    dispatch(
      updateState(userConstants.ACCOUNT, {
        [filter]: e.merchantId,
        [str]: e,
        searchTerm:
          "filter" === "search_type" ? "" : account_statement.searchTerm,
      })
    );
  };
  const [selectionRange, setSelectionRange] = useState([
    {
      startDate: account.startDate,
      endDate: account.endDate,
      key: "selection",
    },
  ]);

  const dateChange = (dates) => {
    setSelectionRange([dates.selection]);
    dispatch(
      updateState(userConstants.ACCOUNT, {
        startDate: dates.selection.startDate,
        endDate: dates.selection.endDate,
      })
    );
  };
  const submitDateFilter = () => {
    const account = latestValue.current;
    if (account.endDate > account.startDate) {
      dispatch(
        updateState(userConstants.ACCOUNT, {
          from: moment(account.startDate).format("DD/MM/YYYY"),
          to: moment(account.endDate).format("DD/MM/YYYY"),
          fromDate: moment(account.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(account.endDate)
            .utc()
            .add(1, "days")
            .endOf("day")
            .format(),
          open_picker: false,
        })
      );
    } else {
      dispatch(
        updateState(userConstants.ACCOUNT, {
          from: moment(account.startDate).format("DD/MM/YYYY"),
          to: moment(account.startDate).format("DD/MM/YYYY"),
          fromDate: moment(account.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(account.startDate)
            .utc()
            .add(1, "days")
            .endOf("day")
            .format(),
          open_picker: false,
        })
      );
    }
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
    let account_copy = account;
    if (account_copy.contact_type) {
      delete account_copy.contact_type;
      delete account_copy.ContactType;
    }
    if (account_copy.selection) {
      delete account_copy.selection;
      delete account_copy.Selection;
    }
    if (account_copy.searchTerm) {
      account_copy.searchTerm = "";
    }
    if (account_copy.searchTerm) {
      delete account_copy.searchTerm;
      account_copy.searchTerm = "";
    }
    if (account_copy.search_type) {
      delete account_copy[account_copy.search_type];
      delete account_copy.SearchType;
      account_copy.search_type = "";
    }
    if (account_copy.status) {
      delete account_copy.status;
      delete account_copy.Status;
    }
    if (account_copy.from) {
      account_copy.startDate = new Date();
      account_copy.endDate = new Date();
      account_copy.from = "";
      account_copy.to = "";
      account_copy.fromDate = "";
      account_copy.toDate = "";
    }
    if (account_copy.merchant_id) {
      delete account_copy.merchant_id;
      delete account_copy.MerchantId;
    }
    dispatch(updateState(userConstants.ACCOUNT, { ...account_copy }));
    dispatch(updateState(userConstants.ACCOUNT, { filter: "" }));
  };

  const onMenuClose = useCallback(() => {
    dispatch(updateState(userConstants.ACCOUNT, { isOpenMenu: false }));
  }, []);

  const showToggle = useCallback(
    (name) => {
      dispatch(updateState(userConstants.ACCOUNT, { [name]: !account[name] }));
    },
    [account.more_filters]
  );

  const openPicker = useCallback(() => {
    dispatch(
      updateState(userConstants.ACCOUNT, { open_picker: !account.open_picker })
    );
  }, []);

  const showDetail = (id) => {
    dispatch(
      updateState(userConstants.ACCOUNT, {
        openAccountDetailModal: !account.openAccountDetailModal,
      })
    );
    setLoading(true);

    ApiGateway.get(
      `/payout/admin/account/detail?account_id=${id}`,
      function (response) {
        if (response.success) {
          auditLog(id);
          setLoading(false);
          dispatch(
            updateState(userConstants.ACCOUNT, {
              accountDetail: response.data.account,
            })
          );
        } else {
          setLoading(false);

          applyToast(response.message, "error");
        }
      }
    );
  };

  const auditLog = (id) => {
    setLoading(true);
    ApiGateway.get(
      `/payout/admin/account/audit/${id}`,
      function (response) {
        if (response.success) {
          setState((prev)=>({...prev,
            auditLog:response.data.account_audit || []
          }))
          setLoading(false);
        } else {
          setLoading(false);
          // applyToast(response.message, "info");
        }
      }
    );
  };

  const closeMerchantTypeModal = () => {

    dispatch(
      updateState(userConstants.ACCOUNT, {
        openAccountDetailModal: !account.openAccountDetailModal,
      })
    );

  };

  const returnFilter = () => {
    return (
      <>
        <div className="col-xs-12 m-b-10 p-0 m-t-10">
          {loading && <Loader />}
          <div className="col-xs-12 col-md-2 p-0 m-b-5 ">
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
                  updateState(userConstants.ACCOUNT, {
                    open_picker: !account.open_picker,
                  })
                )
              }
              value={
                account.from !== "" ? `${account.from} ~ ${account.to}` : ""
              }
            />
            <div
              className={
                account.open_picker
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
              <span className="submitDateBtn" onClick={submitDateFilter}>
                Submit
              </span>
            </div>
          </div>
          <div className="col-xs-12 col-md-3 p-l-0  payout_select_picker p-r-0 m-b-30 p-0 m-l-20">
            <div className="trans-text m-b-5 color-grey font-semibold">
              Select By Status
            </div>
            <Select
              className="selectpicker"
              placeholder="Status"
              options={Status_Filter}
              onChange={(e) => selectFilter("status", e)}
              value={account.Status !== undefined && account.Status}
            />
          </div>

          <div className="col-xs-12 col-md-3 p-r-0">
              <div className="trans-text m-b-5 color-grey font-semibold">
                Select by Business Name
              </div>

              <>
                <AsyncPaginate
                  loadOptions={getAllMerchant}
                  getOptionValue={(option) => option.merchantId}
                  getOptionLabel={(option) => option.businessName}
                  onChange={(e) => selectMerchantFilter("merchant_id", e)}
                  isSearchable={true}
                  placeholder="Select Business"
                  additional={{
                    page: 1,
                  }}
                  classNamePrefix={"react-select"}
                  value={account.MerchantId !== undefined && account.MerchantId}
                />
              </>
            </div>
        </div>
        <div className="col-xs-12 m-b-10">
          <label className="col-xs-12 textCenter">
            <a className="submitBtn m-l-15 border-plain" onClick={submitFilter}>
              Submit
            </a>
            <a
              className="btn btn-default m-l-15 border-plain "
              onClick={resetFilter}
            >
              Reset
            </a>
          </label>
        </div>
      </>
    );
  };

  return (
    <div className="content_wrapper dash_wrapper">
      {accountListRoute ? <> 
      <div className="dash_merchent_welcome">
        <div className="merchent_wlcome_content">
          Accounts
          <div className="bread_crumb">
            <ul className="breadcrumb">
              <li>
                <Link to="/dashboard" className="inactive_breadcrumb">
                  Home
                </Link>
              </li>
              <li className="active_breadcrumb">Accounts</li>
            </ul>
          </div>
        </div>
      </div>

        <div className="white_tab_wrap">
          <div className="white_tab_box">
            <div className="col-xs-12 p-0 ">
              <div className="tab-content">
                {account.mainToggle === "virtual_account" ? (
                  <div
                    className={
                      account.mainToggle === "virtual_account"
                        ? "tab-pane fade active in"
                        : "tab-pane fade"
                    }
                  >
                    <div className="child_tab_con_wrap">
                      {account.subToggle === "list" ? (
                        <div
                          className={
                            account.subToggle === "list"
                              ? "child_tab_fade active"
                              : "child_tab_fade"
                          }
                        >
                          {returnFilter()}
                          <div className="col-xs-12 p-0">
                            <div className="table-responsive">
                              <table className="table   table_customization">
                                <thead>
                                  <tr>
                                    <th>S.No</th>
                                    <th>Date & Time</th>
                                    <th>Merchant ID</th>
                                    <th>Account Number</th>
                                    <th>Ifsc Number</th>
                                    <th>Buisness Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                 {accountDetailRoute && <th>Action</th>}   
                                  </tr>
                                </thead>
                                <tbody>
                                  {accountListRoute ? <>
                                    {account.accountList.map((list, i) => {
                                    return (
                                      <tr key={"list" + i}>
                                        <td>
                                          {(pageno - 1) * limit + (i + 1)}
                                        </td>
                                        <td>
                                          {returnTimeZoneDate(list?.createdAt)}
                                        </td>
                                        <td>{list?.merchant_id}</td>
                                        <td>{list?.virtual_account_number}</td>
                                        <td>
                                          {list?.van_accounts?.axis?.ifsc}
                                        </td>
                                        <td>{list?.name ? list?.name : "-"}</td>
                                        <td>
                                          {list?.email ? list?.email : "-"}
                                        </td>
                                        <td>
                                          <a
                                            className={
                                              list?.status === "active"
                                                ? "label_success"
                                                : "label_failed"
                                            }
                                          >
                                            {textCapitalize(list?.status)}
                                          </a>
                                        </td>
                                        {/* <td><Link className="label_edit" to={`/accountstatement/${list?.virtual_account_number}`}>View</Link></td> */}
                                   {accountDetailRoute &&  <td>
                                          <span
                                            className="label_edit cursor-pointer pointer"
                                            onClick={() =>
                                              showDetail(list?.account_id)
                                            }
                                          >
                                            View
                                          </span>
                                        </td>}    
                                      </tr>
                                    );
                                  })}</>:  <tr>
                                  <td className="text-center" colSpan="9">
                                    Access Denied
                                  </td>
                                </tr>}

                                  
                                </tbody>
                              </table>
                            </div>
                            <div className="table-bottom-content">
                              <Pagination
                                handle={getAccountList}
                                list={recordsLength}
                                currentpage={pageno}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div></> :
     <>
         <div className="dash_merchent_welcome">
         <div className="merchent_wlcome_content">
           Accounts
           <div className="bread_crumb">
             <ul className="breadcrumb">
               <li>
                 <Link to="/dashboard" className="inactive_breadcrumb">
                   Home
                 </Link>
               </li>
               <li className="active_breadcrumb">Accounts</li>
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
     
      
   
      <Modal
        className="customized_modal_new"
        isOpen={account.openAccountDetailModal}
        ariaHideApp={false}
      >
        <div
          className="modal modalbg fade in"
          style={{ display: "block", overflowX: "hidden", overflowY: "auto" }}
        >
          <div className="modal-dialog">

            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close font-28"
                  onClick={()=>closeMerchantTypeModal()}
                >
                  ×
                </button>
                <h4 className="modal-title modal-title-sapce">
                  Account Details-Merchant ID :{" "}
                  {account?.accountDetail?.merchant_id}
                </h4>
              </div>
              <div className="modal-body clearfix modal_label_right">
                <div className="row m-b-15">
                  <div className="col-md-6 control-label">Name</div>
                  <div className="col-md-6 font-700">
                    {textCapitalize(account?.accountDetail?.name)}
                  </div>
                </div>
                <div className="row m-b-15">
                  <div className="col-md-6 control-label">Bank Name</div>
                  <div className="col-md-6 font-700">
                    {account?.accountDetail?.van_accounts?.primary
                      ? textCapitalize(
                          account?.accountDetail?.van_accounts?.primary
                        )
                      : "-"}
                  </div>
                </div>
                <div className="row m-b-15">
                  <div className="col-md-6 control-label">Account Number</div>
                  <div className="col-md-3 font-700">
                    {account?.accountDetail?.van_accounts?.[
                      account?.accountDetail?.van_accounts.primary
                    ].account_no
                      ? textCapitalize(
                          account?.accountDetail?.van_accounts?.[
                            account?.accountDetail?.van_accounts.primary
                          ].account_no
                        )
                      : "-"}
                  </div>
                </div>
                <div className="row m-b-15">
                  <div className="col-md-6 control-label">IFSC</div>
                  <div className="col-md-6 font-700">
                    {account?.accountDetail?.van_accounts?.[
                      account?.accountDetail?.van_accounts.primary
                    ].ifsc
                      ? textCapitalize(
                          account?.accountDetail?.van_accounts?.[
                            account?.accountDetail?.van_accounts.primary
                          ].ifsc
                        )
                      : ""}
                  </div>
                </div>
                <div className="row m-b-15">
                  <div className="col-md-6 control-label">
                    Account Activation Status
                  </div>
                  <div className="col-md-6 font-700">
                    <span
                      className={
                        account?.accountDetail?.accountActivationStatus ===
                        "activated"
                          ? "label_success"
                          : account?.accountDetail?.accountActivationStatus ===
                            "pending"
                          ? "label_warning"
                          : "label_danger"
                      }
                    >
                      {account?.accountDetail?.accountActivationStatus
                        ? textCapitalize(
                            account?.accountDetail?.accountActivationStatus
                          )
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="row m-b-15">
                  <div className="col-md-6 control-label">Created At</div>
                  <div className="col-md-6 font-700">
                    {account?.accountDetail?.createdAt
                      ? returnTimeZoneDate(account?.accountDetail?.createdAt)
                      : ""}
                  </div>
                </div>
                <hr></hr>
                <div>Account Log</div>

                {state?.auditLog?.length > 0 ? state?.auditLog?.map((list, i) => {
                  return (
                    <div key={i}>
                      
                      <div className="control-label">
                        {list?.action === "ACCOUNT_CREATED" ? (
                          <img src={Time} alt="inititated" className="h-15" />
                        ) : list?.action === "ACCOUNT_STATUS_UPDATE_ACTIVE" ? (
                          <img
                            src={Success}
                            alt="success"
                            className="h-15 success-filter"
                          />
                        ) : list?.action ===
                          "ACCOUNT_STATUS_UPDATE_INACTIVE" ? (
                          <img
                            src={Failed}
                            alt="failed"
                            className="h-15 failure-filter"
                          />
                        ) : null}
                        <span className="m-l-5">
                          {list?.action === "ACCOUNT_CREATED"
                            ? formatLabel(list?.action)
                            : list?.action === "ACCOUNT_STATUS_UPDATE_INACTIVE"
                            ? "Account Status Changed to Inactive"
                            : list?.action === "ACCOUNT_STATUS_UPDATE_ACTIVE"
                            ? "Account Status Changed to Active"
                            : "-"}
                        </span>
                      </div>
                      <div className="info_value">
                        {returnTimeZoneDate(list?.createdAt)}
                      </div>
                    </div>
                  );
                }) : 
                <div className="info_value">
                     No Data
                      </div>}
              </div>
            </div>
          </div>
        </div>
      </Modal>







      
    </div>
  );
};
export default Account;
