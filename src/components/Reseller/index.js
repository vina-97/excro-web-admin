import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import {
  manipulateString,
  formatDate,
  currencyFormatter,
  formatDateToYYYYMMDD,
  returnTimeZoneDate,
  textCapitalize,
} from "../../DataServices/Utils";
import ApiGateway from "../../DataServices/DataServices";
import { ToastProvider, useToasts } from "react-toast-notifications";
import Switch from "react-switch";
import Modal from "react-modal";
import Loader from "../Loader";
import Select from "react-select";
import Pagination from "../Pagination";
import { AsyncPaginate } from "react-select-async-paginate";
import ReactSelect from "react-select";
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import useRouteExist from "../../DataServices/useRouteExist";
const Reseller = () => {
  const { reseller } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };


  const resellerList = useRouteExist(["admin-reseller-list"]);
  const resellerCreate = useRouteExist(["admin-reseller-create"]);
  const resellerPricingUpdate = useRouteExist([
    "admin-reseller-pricing-update",
  ]);
  const resellerPricingDetail = useRouteExist([
    "admin-reseller-pricing-detail",
  ]);
  const resellerStatus = useRouteExist(["admin-reseller-status-update"]);
  const latestValue = useRef({});

  latestValue.current = reseller;

  const Id_Filter = [
    { value: "search_term", label: "Reseller Id" },
    { value: "search_term", label: "Reseller Name" },
    { value: "search_term", label: "Business Name" },
    { value: "email", label: "Email" },
    { value: "phone.number", label: " Phone Number" },
  ];

  const Duration_Filter = [
    { value: "", label: "All" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  const status_filter = [
    { value: "", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "In Active" },
  ];

  const [selectionRange, setSelectionRange] = useState([
    {
      startDate: reseller.startDate,
      endDate: reseller.endDate,
      key: "selection",
    },
  ]);
  const [state, setState] = useState({ loading: false });
  const [pageno, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [recordsLength, setrecordLength] = useState([]);

  useEffect(() => {
    ResellerList(pageno);
  }, [reseller.filter]);

  useEffect(() => {
    resetFilter();
  }, []);
  const submitFilter = () => {
    var queryParam = "";

    queryParam +=
      !reseller.status || reseller.status === "all"
        ? ""
        : `&status=${reseller.status}`;
    queryParam += !reseller.selection ? "" : `&selection=${reseller.selection}`;
    queryParam +=
      reseller.fromDate === "" ? "" : "&from_date=" + reseller.fromDate;

    queryParam += reseller.toDate === "" ? "" : "&to_date=" + reseller.toDate;
    queryParam +=
      reseller[reseller.search_type] === undefined ||
      reseller[reseller.search_type] === ""
        ? ""
        : `&${reseller.search_type}=` + reseller[reseller.search_type];
    queryParam += reseller.searchTerm
      ? "&search_term=" + reseller.searchTerm
      : "";
    dispatch(updateState(userConstants.RESELLER, { filter: queryParam }));
    setPageNo(1);
  };

  const ResellerList = (page) => {
    setPageNo(page);
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    ApiGateway.get(
      `/payout/admin/reseller/list?page=${page}&limit=${limit}${
        reseller.filter ? reseller.filter.trim() : ""
      }`,
      (response) => {
        if (response.success) {
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
          dispatch(
            updateState(userConstants.RESELLER, {
              resellerList: response?.data?.resellers
                ? response?.data?.resellers
                : [],
            })
          );
          setrecordLength(response.data.resellers.length);
        } else {
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
          applyToast(response.message, "error");
        }
      }
    );
  };

  const dateChange = (dates) => {
    setSelectionRange([dates.selection]);
    dispatch(
      updateState(userConstants.RESELLER, {
        startDate: dates.selection.startDate,
        endDate: dates.selection.endDate,
      })
    );
  };
  const handleSearchChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    dispatch(updateState(userConstants.RESELLER, { [name]: value }));
  };

  /*   const handleChange = (resellerId, idx, status) => {
    var data = {
      status: status ? "inactive" : "active",
      reseller_id: resellerId,
    };

    ApiGateway.patch(
      `/payout/admin/reseller/update/status`,
      data,
      function (response) {
        if (response.success) {
          let reSeller = reseller.resellerList;
          reSeller[idx].status = status ? "deactive" : "active";

          dispatch(
            updateState(userConstants.RESELLER, {
              resellerList: reSeller,
            })
          );
        }
      }
    );
  }; */
  const handleChange = (list) => {
    var data = {
      status:
        list.status == "active"
          ? "inactive"
          : list.status == "inactive"
          ? "active"
          : list.status,
      reseller_id: list.reseller_id,
    };

    dispatch(updateState(userConstants.LOADER, { loading: true }));
    ApiGateway.patch(
      `/payout/admin/reseller/update/status`,
      data,
      function (response) {
        if (response.success) {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          ResellerList(pageno);
          applyToast(response.message, "success");
        } else {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          applyToast(response.message, "error");
        }
      }
    );
  };
  const [active, setActive] = useState(false);
  const [seacrhBox, setSeacrhBox] = useState(true);
  const selectFilter = (filter, e) => {
    if (filter == "search_type") {
      setSeacrhBox(false);
      setActive(true);
    } else if (filter == "selection") {
      setSelectionRange([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
      dispatch(
        updateState(userConstants.RESELLER, {
          from: "",
          to: "",
          fromDate: "",
          startDate: "",
          endDate: "",
          toDate: "",
          fromDate: "",
        })
      );
    }

    let str = manipulateString(filter);

    dispatch(
      updateState(userConstants.RESELLER, {
        [filter]: e.value,
        [str]: e,
        searchTerm: "filter" === "search_type" ? "" : reseller.searchTerm,
      })
    );
  };

  const submitDateFilter = () => {
    const reseller = latestValue.current;

    if (reseller.endDate > reseller.startDate) {
      dispatch(
        updateState(userConstants.RESELLER, {
          from: moment(reseller.startDate).format("DD/MM/YYYY"),
          to: moment(reseller.endDate).format("DD/MM/YYYY"),
          fromDate: moment(reseller.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(reseller.endDate)
            .utc()
            .add(1, "days")
            .endOf("day")
            .format(),
          open_picker: false,
        })
      );
    } else {
      dispatch(
        updateState(userConstants.RESELLER, {
          from: moment(reseller.startDate).format("DD/MM/YYYY"),
          to: moment(reseller.startDate).format("DD/MM/YYYY"),
          fromDate: moment(reseller.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(reseller.startDate)
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

    setPageNo(1);
    let reseller_copy = reseller;

    if (reseller_copy.status) {
      delete reseller_copy.status;
      delete reseller_copy.Status;
    }

    if (reseller_copy.from) {
      reseller_copy.startDate = new Date();
      reseller_copy.endDate = new Date();
      reseller_copy.from = "";
      reseller_copy.to = "";
      reseller_copy.fromDate = "";
      reseller_copy.toDate = "";
      delete reseller_copy.Dates;
    }
    if (reseller_copy.selection) {
      delete reseller_copy.selection;
      delete reseller_copy.Selection;
    }
    if (reseller_copy.searchTerm) {
      delete reseller_copy.searchTerm;
      reseller_copy.searchTerm = "";
    }
    if (reseller_copy.search_type) {
      delete reseller_copy[reseller_copy.search_type];
      delete reseller_copy.SearchType;
      reseller_copy.search_type = "";
      ResellerList(pageno);
    }
    dispatch(
      updateState(userConstants.RESELLER, {
        ...reseller_copy,
      })
    );
    dispatch(
      updateState(userConstants.RESELLER, {
        filter: "",
      })
    );
    setActive(false);
    setSeacrhBox(true);
    setPageNo(1);
  };
  return (
    <>
      <div className="content_wrapper dash_wrapper">
        
        {state.loading && <Loader />}
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">
            Reseller List
            <div className="bread_crumb">
              <ul className="breadcrumb">
                <li>
                  <Link to="/dashboard" className="inactive_breadcrumb">
                    Home
                  </Link>
                </li>
                <li className="active_breadcrumb">Reseller List</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="white_tab_wrap">
          <div className="white_tab_box">
            <div className="row p-0 m-b-5 ">
              <div className="col-xs-12 ">
                <div className="col-md-6 p-l-0">
                  <div className="trans-text m-b-5 color-grey font-semibold">
                    Select by Business Name / Email / Phone /Reseller Id
                  </div>
                  <div className="payout_popup_search ">
                    <div className="input-group">
                      <input
                        className="payout_popup_search_input"
                        type="text"
                        name={reseller.search_type || "searchTerm"}
                        value={
                          reseller[reseller.search_type] || reseller.searchTerm
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
                            reseller.SearchType !== undefined &&
                            reseller.SearchType
                          }
                          onChange={(e) => {
                            selectFilter("search_type", e);
                          }}
                        />
                      </div>
                      <span
                        className="input-group-addon"
                        onClick={submitFilter}
                      >
                        <i className="fa fa-search"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 p-r-0">
                  <div className="trans-text m-b-5 color-grey font-semibold">
                    Select By Duration
                  </div>
                  <Select
                    className="selectpicker"
                    options={Duration_Filter}
                    onChange={(e) => selectFilter("selection", e)}
                    value={
                      reseller.Selection !== undefined && reseller.Selection
                    }
                  />
                </div>

                <div className="m-t-25 pull-right">
                  {resellerCreate && (
                    <Link
                      className="submitBtn m-l-15 border-plain"
                      to="/reseller/add"
                    >
                      Add Reseller
                    </Link>
                  )}
                </div>
                <div className="m-t-25 pull-right">
                  {/*   <Link
                    className="submitBtn m-l-15 border-plain"
                    to="/reseller/pricing"
                  >
                    Reseller Pricing
                  </Link> */}
                </div>
                <div className="col-xs-12 m-t-15 p-0">
                  <div className="col-xs-12 col-md-2 p-l-0 m-b-5">
                    <label className="trans-text m-b-5  color-grey font-semibold">
                      Select By Status
                    </label>
                    <Select
                      className="selectpicker"
                      options={status_filter}
                      placeholder="Status"
                      onChange={(e) => selectFilter("status", e)}
                      value={reseller.Status !== undefined && reseller.Status}
                    />
                  </div>
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
                          updateState(userConstants.RESELLER, {
                            open_picker: !reseller.open_picker,
                            Selection: "",
                          })
                        )
                      }
                      value={
                        reseller.from !== ""
                          ? `${reseller.from} ~ ${reseller.to}`
                          : ""
                      }
                    />
                    <div
                      className={
                        reseller.open_picker
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
                </div>

                <div className="col-xs-12 m-t-15 p-0 textCenter">
                  <div className="col-xs-12 m-t-25">
                    <a
                      className="submitBtn border-plain "
                      onClick={submitFilter}
                    >
                      Submit
                    </a>
                    <a
                      className="btn btn-default m-l-15 border-plain "
                      onClick={resetFilter}
                    >
                      Reset
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="col-xs-12">
                <div className="table-responsive m-t-25">
                  <table className="table table_customization">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Reseller Name</th>
                        <th>Referral Code</th>
                        <th>Reseller Business Name</th>
                        <th>Reseller ID</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Created At</th>
                        <th>Created By</th>
                        {resellerPricingUpdate && resellerPricingDetail && (
                          <th>Action</th>
                        )}
                        {resellerStatus && <th>Status</th>} <th>View Escrow</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resellerList ? (
                        <>
                          {reseller?.resellerList?.map((lists, i) => {
                            return (
                              <tr key={i}>
                                <td>{(pageno - 1) * limit + (i + 1)}</td>
                                <td>
                                  {lists?.reseller_name
                                    ? lists?.reseller_name
                                    : "-"}
                                </td>
                                <td>
                                  {lists?.referral_code
                                    ? lists?.referral_code
                                    : "-"}
                                </td>
                                <td>
                                  {lists?.business_name
                                    ? lists?.business_name
                                    : "-"}
                                </td>
                                <td>
                                  {lists?.reseller_id
                                    ? lists?.reseller_id
                                    : "-"}
                                </td>
                                <td> {lists?.email ? lists?.email : "-"} </td>
                                <td>
                                  {" "}
                                  {lists?.phone?.national_number
                                    ? lists?.phone?.national_number
                                    : "-"}{" "}
                                </td>
                                <td>
                                  {" "}
                                  {lists?.createdAt
                                    ? returnTimeZoneDate(lists?.createdAt)
                                    : "-"}{" "}
                                </td>
                                <td>
                                  {" "}
                                  {lists?.audit?.name
                                    ? lists?.audit?.name
                                    : "-"}{" "}
                                </td>
                                {/*   <td>
                              <Switch
                                checked={
                                  lists?.status === "active" ? true : false
                                }
                                onChange={() =>
                                  handleChange(
                                    lists?.reseller_id,
                                    i,
                                    lists?.status === "active" ? true : false
                                  )
                                }
                                onColor="#86d3ff"
                                onHandleColor="#2693e6"
                                handleDiameter={30}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={20}
                                width={48}
                                className="react-switch"
                                id="material-switch"
                              />
                            </td> */}
                                {resellerPricingUpdate &&
                                  resellerPricingDetail && (
                                    <td>
                                      <Link
                                        to={`/reseller/merchant-reseller-pricing/${lists?.reseller_id}`}
                                        className="label_edit"
                                      >
                                        Update Pricing
                                      </Link>
                                    </td>
                                  )}

                                <td>
                                  {resellerStatus && (
                                    <span
                                      className={
                                        lists?.status == "active"
                                          ? "label_success cursor-pointer pointer"
                                          : "label_warning cursor-pointer pointer"
                                      }
                                      onClick={() => handleChange(lists)}
                                    >
                                      {textCapitalize(lists?.status)}
                                    </span>
                                  )}{" "}
                                </td>
                                <td>
                                  <Link
                                    to={`/escrow-pool-accounts?resellerId=${
                                      lists?.reseller_id
                                    }&resellerName=${encodeURIComponent(
                                      lists?.reseller_name ||
                                        lists?.business_name
                                    )}`}
                                  >
                                    <span className="label_edit pointer-cursor">
                                      View
                                    </span>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </>
                      ) : (
                        <tr>
                          <td className="text-center" colSpan="9">
                            Access Denied
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="table-bottom-content">
                  <Pagination
                    handle={ResellerList}
                    list={recordsLength}
                    currentpage={pageno}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reseller;
