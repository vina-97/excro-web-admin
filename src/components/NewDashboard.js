import React, { useRef, useEffect, useState } from "react";

import ApiGateway from "../DataServices/DataServices";

import ApexChart from "./Chart";

import {
  currencyFormatter,
  formatDate,
  formatName,
  returnTimeZoneDate,
  textCapitalize,
} from "../DataServices/Utils";
import { DateRange, DateRangePicker } from "react-date-range";
import moment from "moment";

import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "./Loader";

import PaymentModeLineChart from "./Chart/TransactionTrends";
import TransactionDonutChart from "./Chart/TransactionDonut";
import useRouteExist from "../DataServices/useRouteExist";
const NewDashboard = () => {
  const history = useHistory();

  const dashboardGraphRoute = useRouteExist(["admin-dashboard-details"]);

  {
    /*line chart*/
  }

  const payModeMeta = {
    UPI: { label: "UPI Transactions", icon: "💳" },
    NEFT: { label: "NEFT Transfers", icon: "🏦" },
    IMPS: { label: "IMPS Payments", icon: "⚡" },
    RTGS: { label: "RTGS Transfers", icon: "🚀" },
  };

  const formatNumber = (num) => {
    if (num >= 10000000) return (num / 10000000).toFixed(1) + "Cr";
    if (num >= 100000) return (num / 100000).toFixed(1) + "L";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };
  const allowedModes = ["UPI", "IMPS", "RTGS", "NEFT"];

  {
    /*donust chart*/
  }
  const getDonutDataFromOverall = (overall) => {
    const formatSection = (label, count, volume) => ({
      label: `${label} (${count} / ₹${volume})`,
      count,
      volume,
    });

    const formatData = (type) => {
      const section = overall[type];
      return [
        formatSection("Success", section.successCount, section.successVolume),
        formatSection(
          "Pending",
          section.initiatedCount,
          section.initiatedVolume
        ),
        formatSection("Failed", section.failedCount, section.failedVolume),
      ];
    };

    return {
      debitData: formatData("DEBIT"),
      creditData: formatData("CREDIT"),
    };
  };

  const [state, setState] = useState({
    payin_payout_count: "today",
    loading: false,
    transactionList: [],
    open_picker: false,
    startDate: new Date(),
    endDate: new Date(),
    from: "",
    to: "",
    fromDate: "",
    toDate: "",
    transactionDetail: false,
    trans_id: "",
    isTransDetail: false,
    TransactionDetail: {},
    transactionModes: [],
    transactionModesData: [],
    payinPayoutCount: [],
    transactionDonut: [],
    recentTransaction: [],
  });

  const [selectionRange, setSelectionRange] = useState([
    { startDate: state.startDate, endDate: state.endDate, key: "selection" },
  ]);
  const [isCalendar, setisCalendar] = useState(true);
  const [pageno, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  let currentdate = new Date();
  const [memoChartValueProps, setMemoChartValueProps] = useState({});
  const [memoPieChart, setMemoPieChart] = useState({});
  let last2months = new Date(currentdate.setMonth(currentdate.getMonth() - 2));
  const latestValue = useRef({});

  useEffect(() => {
    dashboardDetails(pageno);
  }, [state.payin_payout_count, state.toDate, state.fromDate]);

  useEffect(() => {
    if (state.getlastSevenDaysTransactionDetails) {
      setMemoChartValueProps(state.getlastSevenDaysTransactionDetails);
    }
  }, [state.getlastSevenDaysTransactionDetails]);
  useEffect(() => {
    if (state.transactionDonut) {
      setMemoPieChart(state.transactionDonut);
    }
  }, [state.transactionDonut]);

  const submitDateFilter = () => {
    if (state.endDate > state.startDate) {
      setState((prevState) => ({
        ...prevState,
        from: moment(state.startDate).format("DD/MM/YYYY"),
        to: moment(state.endDate).format("DD/MM/YYYY"),
        fromDate: moment(state.startDate)
          .utc()
          .add(1, "days")
          .startOf("day")
          .format(),
        toDate: moment(state.endDate)
          .utc()
          .add(1, "days")
          .endOf("day")
          .format(),
        open_picker: false,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        from: moment(state.startDate).format("DD/MM/YYYY"),
        to: moment(state.endDate).format("DD/MM/YYYY"),
        fromDate: moment(state.startDate)
          .utc()
          .add(1, "days")
          .startOf("day")
          .format(),
        toDate: moment(state.endDate)
          .utc()
          .add(1, "days")
          .endOf("day")
          .format(),
        open_picker: false,
      }));
    }
    setState((prevState) => ({
      ...prevState,
      payin_payout_count: "",
    }));
  };

  const dateChange = (dates) => {
    setSelectionRange([dates.selection]);

    setState((prevState) => ({
      ...prevState,
      startDate: dates.selection.startDate,
      endDate: dates.selection.endDate,
    }));
  };

  const dashboardDetails = (page) => {
    const sampleData = {
      getlastSevenDaysTransactionDetails: [
        {
          pay_mode_view: [
            {
              _id: "UPI",
              data: [
                {
                  _id: "2025-08-06",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 5000,
                  no_of_trans: 22,
                },
                {
                  _id: "2025-08-05",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 200,
                  no_of_trans: 2,
                },
                {
                  _id: "2025-08-04",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 3000,
                  no_of_trans: 22,
                },
                {
                  _id: "2025-08-03",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 100,
                  no_of_trans: 10,
                },
                {
                  _id: "2025-08-02",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 216,
                  no_of_trans: 10,
                },
              ],
            },
            {
              _id: "IMPS",
              data: [
                {
                  _id: "2025-08-06",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 2000,
                  no_of_trans: 10,
                },
                {
                  _id: "2025-08-05",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 200,
                  no_of_trans: 5,
                },
                {
                  _id: "2025-08-04",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 300,
                  no_of_trans: 10,
                },
                {
                  _id: "2025-08-03",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 1000,
                  no_of_trans: 5,
                },
                {
                  _id: "2025-08-02",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 1000,
                  no_of_trans: 5,
                },
              ],
            },
            {
              _id: "RTGS",
              data: [
                {
                  _id: "2025-08-06",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 1000,
                  no_of_trans: 20,
                },
                {
                  _id: "2025-08-05",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 100,
                  no_of_trans: 20,
                },
                {
                  _id: "2025-08-04",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 2000,
                  no_of_trans: 20,
                },
                {
                  _id: "2025-08-03",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 500,
                  no_of_trans: 8,
                },
                {
                  _id: "2025-08-02",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 400,
                  no_of_trans: 5,
                },
              ],
            },

            {
              _id: "NEFT",
              data: [
                {
                  _id: "2025-08-06",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 4000,
                  no_of_trans: 10,
                },
                {
                  _id: "2025-08-05",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 2000,
                  no_of_trans: 2,
                },
                {
                  _id: "2025-08-04",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 1000,
                  no_of_trans: 10,
                },
                {
                  _id: "2025-08-03",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 500,
                  no_of_trans: 5,
                },
                {
                  _id: "2025-08-02",
                  trans_type: "DEBIT",
                  info: "Pay out",
                  y: 100,
                  no_of_trans: 5,
                },
              ],
            },
          ],
        },
      ],
    };

    setPageNo(page);
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    var queryParam = "";
    queryParam += state.fromDate ? `&from_date=${state.fromDate}` : "";
    queryParam += state.toDate ? `&to_date=${state.toDate}` : "";
    queryParam += state.payin_payout_count
      ? `&selection=${state.payin_payout_count}`
      : "";
    ApiGateway.get(
      `/payout/admin/dashboard?page=${page}&limit=${limit}${queryParam}`,
      (response) => {
        if (response.success) {
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
          setState((prevState) => ({
            ...prevState,
            // transactionModes:sampleData?.getlastSevenDaysTransactionDetails ? sampleData?.getlastSevenDaysTransactionDetails[0]?.pay_mode_view : [],

            transactionModes: response?.data?.results
              ?.getlastSevenDaysTransactionDetails
              ? response?.data?.results?.getlastSevenDaysTransactionDetails[0]
                  ?.pay_mode_view
              : [],
            getlastSevenDaysTransactionDetails:
              response?.data?.results?.getlastSevenDaysTransactionDetails &&
              response?.data?.results?.getlastSevenDaysTransactionDetails[0]
                ?.overall[0]
                ? response?.data?.results?.getlastSevenDaysTransactionDetails[0]
                    ?.overall[0]
                : [],
            transactionModesData: response?.data?.results?.collection_total
              ? response?.data?.results?.collection_total[0]?.pay_mode_view
              : {},
            transactionDonut: response.data?.results?.collection_total
              ? response.data?.results?.collection_total[0]?.overall
              : {},
            recentTransaction: response.data?.results?.account_statement
              ? response.data?.results?.account_statement?.transactions
              : {},
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
        }
      }
    );
  };

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
      loading: false,
      payin_payout_count: "today",
      transactionList: [],
      open_picker: false,
    }));
    if (selectionRange) {
      setSelectionRange([
        {
          startDate: null,
          endDate: new Date(""),
          key: "selection",
        },
      ]);
    }
    if (state.from) {
      state.startDate = new Date();
      state.endDate = new Date();
      state.from = "";
      state.to = "";
      state.fromDate = "";
      state.toDate = "";
    }

    setisCalendar(true);
  };
  const handlePayinPayoutCount = (e, id) => {
    setState((prevState) => ({
      ...prevState,
      payin_payout_count: id,
      fromDate: "",
      toDate: "",
      from: "",
      to: "",
      open_picker: false,
    }));

    if (selectionRange) {
      setSelectionRange([
        {
          startDate: null,
          endDate: new Date(""),
          key: "selection",
        },
      ]);
    }
    setisCalendar(true);
  };

  const handleTransListRedirect = () => {
    history.push("/accountstatement");
  };
  return (
    <>
      <div className="content_wrapper dash_wrapper">
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">Dashboard</div>
        </div>
        {dashboardGraphRoute ? (
          <div className="white_tab_wrap">
            <div className="white_tab_box">
              {/*filters*/}
              <div className="col-xs-12 col-sm-12 col-md-7 ">
                <div className="filter-search m-l-15">
                  <button
                    className={
                      state?.payin_payout_count === "today"
                        ? "active_orders"
                        : "inactive_orders"
                    }
                    onClick={(e) => handlePayinPayoutCount(e, "today")}
                  >
                    Today
                  </button>
                  <button
                    className={
                      state?.payin_payout_count === "week"
                        ? "active_orders m-l-5"
                        : "inactive_orders m-l-5"
                    }
                    onClick={(e) => handlePayinPayoutCount(e, "week")}
                  >
                    This Week
                  </button>
                  <button
                    className={
                      state?.payin_payout_count === "month"
                        ? "active_orders m-l-5"
                        : "inactive_orders m-l-5"
                    }
                    onClick={(e) => handlePayinPayoutCount(e, "month")}
                  >
                    This Month
                  </button>
                  <div className="datepicker_boxradius">
                    <div className="left-side-filter">
                      <input
                        className="fileter_dateform_input"
                        id="from_date"
                        name="date"
                        placeholder=""
                        type="text"
                        onClick={() =>
                          setState((prevState) => ({
                            ...prevState,
                            open_picker: !state.open_picker,
                          }))
                        }
                        value={
                          state.from !== ""
                            ? `${state.from} ~ ${state.to}`
                            : `Select Date`
                        }
                      />
                      <div
                        className={
                          state.open_picker
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
                          minDate={last2months}
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

                  <button className="reset_orders m-l-5" onClick={handleReset}>
                    Reset
                  </button>
                </div>
              </div>
              {/*transaction mode */}

              <div className="col-xs-12">
                <div className="card-container transaction-grid">
                  {allowedModes?.map((mode) => {
                    const values = state?.transactionModesData?.[mode] || {
                      volume: 0,
                      count: 0,
                    };
                    const meta = payModeMeta?.[mode] || {
                      label: mode.toUpperCase(),
                      icon: null,
                    };

                    return (
                      <div
                        key={mode}
                        className={`card transaction-card ${mode}-bg`}
                      >
                        <div className="mode-title">
                          {meta.label}
                          {meta.icon && (
                            <span className="mode-title-icon">{meta.icon}</span>
                          )}
                        </div>
                        <div className="transaction-mode-amount">
                          {formatNumber(
                            currencyFormatter(
                              Math.round(values.volume * 100) / 100,
                              { code: "INR" }
                            ) || 0
                          )}
                        </div>
                        <div className="transaction-mode-count">
                          {formatNumber(Number(values.count) || 0)} transactions
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/*payin payout */}
              <div className="col-xs-12">
                <div className="col-md-6 col-xs-12">
                  <div
                    className={`payin-payout-graph pb-59 ${
                      memoChartValueProps?.data?.length > 0
                        ? ""
                        : `graph-no-data pb-225`
                    }`}
                  >
                    {memoChartValueProps?.data?.length > 0 ? (
                      <>
                        <ApexChart memoChartValueProps={memoChartValueProps} />
                        <div className="recent-transaction-info">
                          Recent 7 day Credit and Debit Transactions
                        </div>
                      </>
                    ) : (
                      <div className="recent-transaction-info">
                        No Transaction Found
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-xs-12">
                  <div className="payin-payout-graph">
                    <PaymentModeLineChart
                      transactionModes={state?.transactionModes}
                    />
                    <div className="text-center line-chart-x-label">Date</div>
                    <div className="recent-transaction-info">
                      Recent 7 Day Payment Mode Transactions
                    </div>
                  </div>
                </div>
              </div>

              {/*pie chart*/}

              <div className="col-xs-12 m-t-10">
                <div className="col-md-6 col-xs-12 payin-payout-pie">
                  {/* {memoPieChart} */}
                  <TransactionDonutChart overall={state?.transactionDonut} />
                </div>

                <div className="col-md-6">
                  <div className="table-responsive shadow rounded-3 overflow-hidden">
                    <div className="recent-transaction-info">
                      Recent Transactions{" "}
                      <span
                        className="label_edit cursor-pointer pointer"
                        onClick={handleTransListRedirect}
                      >
                        View All
                      </span>
                    </div>
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="text-nowrap">S.No</th>
                          <th className="text-nowrap">Transaction Id</th>
                          <th className="text-nowrap">Transaction Time</th>
                          <th className="text-nowrap">Source</th>
                          <th className="text-nowrap">Amount</th>
                          <th className="text-nowrap">Mode</th>
                          <th className="text-nowrap">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state?.recentTransaction.length > 0 ? (
                          state?.recentTransaction.map((list, i) => (
                            <tr
                              key={i}
                              className={
                                list?.remarks === "internaltransfer"
                                  ? "table-info"
                                  : ""
                              }
                            >
                              <td>{(pageno - 1) * limit + (i + 1)}</td>
                              <td>
                                <a className="text-primary text-decoration-none position-relative remarks_tooltip">
                                  {list.trans_id || "-"}
                                  <span className="position-absolute bg-light border rounded p-2 shadow remarks_tooltip_popup">
                                    <strong>Payout Purpose:</strong>{" "}
                                    {list?.remarks || "-"}
                                  </span>
                                </a>
                              </td>
                              <td>
                                {returnTimeZoneDate(list?.createdAt || "-")}
                              </td>
                              <td>
                                {list?.product_type
                                  ? formatName(list?.product_type)
                                  : "-"}
                              </td>
                              <td>
                                {currencyFormatter(
                                  Math.round(
                                    (list?.transaction_amount || 0) * 100
                                  ) / 100,
                                  { code: "INR" }
                                )}
                              </td>
                              <td>{list?.pay_mode || "-"}</td>
                              <td>
                                <span
                                  className={
                                    list.status == "success"
                                      ? "label_success"
                                      : list?.status == "pending"
                                      ? "label_warning"
                                      : list?.status == "processing"
                                      ? "label_edit"
                                      : list?.status == "failed"
                                      ? "label_danger"
                                      : "label_edit"
                                  }
                                >
                                  {textCapitalize(list?.status || "")}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="7"
                              className="text-center text-muted py-4"
                            >
                              No Records Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="white_tab_wrap">
              <div className="white_tab_box">
                <div className="dash_table">
                <div className="col-xs-12 p-0">
                    <div className="access-denied text-center"> Access Denied to view this Section. Contact Admin.</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default NewDashboard;
