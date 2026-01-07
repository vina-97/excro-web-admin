import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import {
  manipulateString,
  formatDate,
  currencyFormatter,
  formatDateToYYYYMMDD,
} from "../../DataServices/Utils";
import ApiGateway from "../../DataServices/DataServices";
import { ToastProvider, useToasts } from "react-toast-notifications";

import Modal from "react-modal";
import Loader from "../Loader";
import Pagination from "../Pagination";
import { AsyncPaginate } from "react-select-async-paginate";
import ReactSelect from "react-select";
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import useRouteExist from "../../DataServices/useRouteExist";
const Reports = () => {
  const { reports } = useSelector((state) => state);
  const consolidateListRoute = useRouteExist(["admin-consolidate-list"]);
  const consolidateDetail = useRouteExist(["admin-consolidate-detail"]);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };

  const latestValue = useRef({});
  latestValue.current = reports;

  const [state, setState] = useState({ loading: false });
  const [pageno, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [recordsLength, setrecordLength] = useState([]);
  const Duration_Filter = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  const [selectionRange, setSelectionRange] = useState([
    {
      startDate: reports.startDate,
      endDate: reports.endDate,
      key: "selection",
    },
  ]);
  useEffect(() => {
    ReportList(pageno);
  }, [reports.filter]);

  useEffect(() => {
    resetFilter();
  }, []);

  const dateChange = (dates) => {
    setSelectionRange([dates.selection]);
    dispatch(
      updateState(userConstants.REPORTS, {
        startDate: dates.selection.startDate,
        endDate: dates.selection.endDate,
      })
    );
  };

  const submitDateFilter = () => {
    dispatch(updateState(userConstants.REPORTS, { selection: "" }));
    const reports = latestValue.current;
    if (reports.endDate > reports.startDate) {
      dispatch(
        updateState(userConstants.REPORTS, {
          from: moment(reports.startDate).format("DD/MM/YYYY"),
          to: moment(reports.endDate).format("DD/MM/YYYY"),
          fromDate: moment(reports.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(reports.endDate)
            .utc()
            .add(1, "days")
            .endOf("day")
            .format(),
          open_picker: false,
        })
      );
    } else {
      dispatch(
        updateState(userConstants.REPORTS, {
          from: moment(reports.startDate).format("DD/MM/YYYY"),
          to: moment(reports.startDate).format("DD/MM/YYYY"),
          fromDate: moment(reports.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(reports.startDate)
            .utc()
            .add(1, "days")
            .endOf("day")
            .format(),
          open_picker: false,
        })
      );
    }
  };

  const submitFilter = () => {
    setPageNo(1);
    let queryParam = "";
    queryParam += !reports.merchant_id
      ? ""
      : `&merchant.id=${reports.merchant_id}`;
    queryParam += !reports.selection ? "" : `&selection=${reports.selection}`;
    queryParam += reports.fromDate
      ? `&from_date=${formatDateToYYYYMMDD(reports.fromDate)}`
      : "";
    queryParam += reports.toDate
      ? `&to_date=${formatDateToYYYYMMDD(reports.toDate)}`
      : "";

    dispatch(updateState(userConstants.REPORTS, { filter: queryParam }));
  };

  const ReportList = (page) => {
    setPageNo(page);
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    let queryParam = "";
    queryParam += !reports.merchant_id
      ? ""
      : `&merchant.id=${reports.merchant_id}`;
    queryParam += !reports.selection ? "" : `&selection=${reports.selection}`;
    queryParam += reports.fromDate
      ? `&from_date=${formatDateToYYYYMMDD(reports.fromDate)}`
      : "";
    queryParam += reports.toDate
      ? `&to_date=${formatDateToYYYYMMDD(reports.toDate)}`
      : "";
    ApiGateway.get(
      `/payout/admin/transaction/dayreport/list?page=${page}&limit=${limit}${
        reports.filter ? reports.filter : ""
      }`,
      (response) => {
        if (response.success) {
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
          dispatch(
            updateState(userConstants.REPORTS, {
              list: response.data.consolidatedReports,
            })
          );
          setrecordLength(response.data.consolidatedReports.length);
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
      updateState(userConstants.REPORTS, {
        [filter]: e.merchantId,
        [str]: e,
        // searchTerm:
        //   "filter" === "search_type" ? "" : reports.searchTerm,
      })
    );
  };
  const selectDuration = (filter, e) => {
    let str = manipulateString(filter);
    dispatch(
      updateState(userConstants.REPORTS, {
        [filter]: e.value,
        [str]: e,
      })
    );
  };
  const viewModal = (id) => {
    ApiGateway.get(
      `/payout/admin/transaction/dayreport/detail?report_id=${id}`,
      (response) => {
        if (response.success) {
          dispatch(
            updateState(userConstants.REPORTS, {
              reportDetail: response.data,
              openModal: !reports.openModal,
            })
          );
        } else {
          applyToast(response.message, "error");
        }
      }
    );
  };
  const closeReportModal = () => {
    dispatch(
      updateState(userConstants.REPORTS, { openModal: !reports.openModal })
    );
  };
  const resetFilter = () => {
    let report_copy = reports;
    if (report_copy.MerchantId) {
      delete report_copy.merchant_id;
      delete report_copy.MerchantId;
    }
    if (report_copy.selection) {
      delete report_copy.selection;
      delete report_copy.Selection;
    }

    if (selectionRange) {
      setSelectionRange([
        {
          startDate: null,
          endDate: new Date(""),
          key: "selection",
        },
      ]);
    }
    if (report_copy.from) {
      report_copy.startDate = new Date();
      report_copy.endDate = new Date();
      report_copy.from = "";
      report_copy.to = "";
      report_copy.fromDate = "";
      report_copy.toDate = "";
    }

    dispatch(
      updateState(userConstants.REPORTS, {
        ...report_copy,
      })
    );
    dispatch(
      updateState(userConstants.REPORTS, {
        filter: "",
      })
    );
  };
  return (
    <>
      <div className="content_wrapper dash_wrapper">
        {consolidateListRoute ? (
          <>
            {state.loading && <Loader />}
            <div className="dash_merchent_welcome">
              <div className="merchent_wlcome_content">
                Consolidate Report List
                <div className="bread_crumb">
                  <ul className="breadcrumb">
                    <li>
                      <Link to="/dashboard" className="inactive_breadcrumb">
                        Home
                      </Link>
                    </li>
                    <li className="active_breadcrumb">Consolidate Report</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="white_tab_wrap">
              <div className="white_tab_box">
                <div className="row p-0 m-b-5 ">
                  <div className="col-xs-12 ">
                    <div className="col-xs-3">
                      <div className="trans-text m-b-5 color-grey font-semibold">
                        Select by Business Name
                      </div>

                      <>
                        <AsyncPaginate
                          loadOptions={getAllMerchant}
                          getOptionValue={(option) => option.merchantId}
                          getOptionLabel={(option) => option?.businessName}
                          onChange={(e) =>
                            selectMerchantFilter("merchant_id", e)
                          }
                          isSearchable={true}
                          placeholder="Select Business"
                          additional={{
                            page: 1,
                          }}
                          classNamePrefix={"react-select"}
                          value={
                            reports.MerchantId !== undefined &&
                            reports.MerchantId
                          }
                        />
                      </>
                    </div>
                    <div className="col-xs-3 p-r-0">
                      <div className="trans-text m-b-5 color-grey font-semibold">
                        Select By Duration
                      </div>
                      <ReactSelect
                        className="selectpicker"
                        options={Duration_Filter}
                        onChange={(e) => selectDuration("selection", e)}
                        value={
                          reports.Selection !== undefined && reports.Selection
                        }
                      />
                    </div>
                    <div className="col-xs-3 p-r-0">
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
                            updateState(userConstants.REPORTS, {
                              open_picker: !reports.open_picker,
                            })
                          )
                        }
                        value={
                          reports.from !== ""
                            ? `${reports.from} ~ ${reports.to}`
                            : ""
                        }
                      />
                      <div
                        className={
                          reports.open_picker
                            ? "react_date_range_picker"
                            : "react_date_range_picker hide"
                        }
                      >
                        {/* <span className="cross" onClick={handleCloseDatePicker}>X</span> */}
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
                  <div className="col-xs-12 textCenter">
                    <label className="col-xs-12 p-0 m-t-25 ">
                      <a
                        className="submitBtn  border-plain "
                        onClick={submitFilter}
                      >
                        Submit
                      </a>
                      <a
                        className="btn btn-default m-l-10 border-plain "
                        onClick={resetFilter}
                      >
                        Reset
                      </a>
                    </label>
                  </div>
                </div>
                <div>
                  <div className="col-xs-12">
                    <div className="table-responsive m-t-25">
                      <table className="table table_customization">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Business Name</th>
                            <th>Merchant ID</th>
                            <th>Generated Date</th>
                            <th>Total Credit Count</th>
                            <th>Total Credit Volume</th>
                            <th>Total Credit Commission</th>
                            <th>Total Debit Count</th>
                            <th>Total Debit Volume </th>
                            <th>Total Debit Commission</th>
                            <th>Reseller Debit Commission</th>
                            <th>Reseller Credit Commission</th>
                            {consolidateDetail && <th>Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {consolidateListRoute ? (
                            <>
                              {reports?.list?.map((lists, i) => {
                                return (
                                  <tr key={i}>
                                    <td>{(pageno - 1) * limit + (i + 1)}</td>
                                    <td>
                                      {lists?.merchant?.name
                                        ? lists?.merchant?.name
                                        : "-"}
                                    </td>
                                    <td>
                                      {lists?.merchant?.id
                                        ? lists?.merchant?.id
                                        : "-"}
                                    </td>
                                    <td>
                                      {lists?.generatedDate
                                        ? formatDate(lists?.generatedDate)
                                        : "-"}
                                    </td>
                                    <td>
                                      {" "}
                                      {lists?.creditCount
                                        ? lists?.creditCount
                                        : "-"}{" "}
                                    </td>
                                    <td>
                                      {lists?.creditVolume
                                        ? currencyFormatter(
                                            Math.round(
                                              lists?.creditVolume * 100
                                            ) / 100,
                                            { code: "INR" }
                                          )
                                        : "-"}
                                    </td>

                                    <td>
                                      {lists?.creditCommissionTotal
                                        ? currencyFormatter(
                                            Math.round(
                                              lists?.creditCommissionTotal * 100
                                            ) / 100,
                                            { code: "INR" }
                                          )
                                        : "-"}
                                    </td>
                                    <td>
                                      {lists?.debitCount
                                        ? lists?.debitCount
                                        : "-"}
                                    </td>
                                    <td>
                                      {lists?.debitVolume
                                        ? currencyFormatter(
                                            Math.round(
                                              lists?.debitVolume * 100
                                            ) / 100,
                                            { code: "INR" }
                                          )
                                        : "-"}
                                    </td>

                                    <td>
                                      {lists?.debitCommissionTotal
                                        ? currencyFormatter(
                                            Math.round(
                                              lists?.debitCommissionTotal * 100
                                            ) / 100,
                                            { code: "INR" }
                                          )
                                        : "-"}
                                    </td>
                                    <td>
                                      {lists?.resellerDebitCommissionTotal
                                        ? currencyFormatter(
                                            Math.round(
                                              lists?.resellerDebitCommissionTotal *
                                                100
                                            ) / 100,
                                            { code: "INR" }
                                          )
                                        : "-"}
                                    </td>
                                    <td>
                                      {lists?.resellerCreditCommissionTotal
                                        ? currencyFormatter(
                                            Math.round(
                                              lists?.resellerCreditCommissionTotal *
                                                100
                                            ) / 100,
                                            { code: "INR" }
                                          )
                                        : "-"}
                                    </td>
                                    {consolidateDetail && (
                                      <td>
                                        <span
                                          className="label_edit pointer-cursor"
                                          onClick={() =>
                                            viewModal(lists?.report_id)
                                          }
                                        >
                                          View
                                        </span>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </>
                          ) : (
                            <tr>
                              <td className="text-center" colSpan="13">
                                Access Denied
                              </td>
                            </tr>
                          )}

                          {/* <td><span className="label_edit pointer-cursor" onClick={viewModal}>View</span></td> */}
                        </tbody>
                      </table>
                    </div>
                    <div className="table-bottom-content">
                      <Pagination
                        handle={ReportList}
                        list={recordsLength}
                        currentpage={pageno}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="dash_merchent_welcome">
              <div className="merchent_wlcome_content">
                Consolidate Report List
                <div className="bread_crumb">
                  <ul className="breadcrumb">
                    <li>
                      <Link to="/dashboard" className="inactive_breadcrumb">
                        Home
                      </Link>
                    </li>
                    <li className="active_breadcrumb">Consolidate Report</li>
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
            </div>
          </>
        )}

        <Modal
          className="report_modal"
          isOpen={reports.openModal}
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
                    onClick={closeReportModal}
                  >
                    ×
                  </button>
                  <h4 className="modal-title modal-title-sapce">
                    Detailed Report - {reports.reportDetail?.merchant?.name}
                  </h4>
                </div>
                <div className="modal-body clearfix ">
                  <div className=" clearfix">
                    <div className="col-xs-12">
                      <div className="row">
                        <div className="col-xs-6">
                          <div className="report_head">
                            Credit Fixed Commission
                          </div>
                          <div className="col-xs-3 m-t-10">
                            <div className="report_lable">Value</div>
                            <div className="report_lable">Tax</div>
                            <div className="report_lable">Total</div>
                          </div>
                          <div className="col-xs-3 m-t-10">
                            <div>
                              {currencyFormatter(
                                Math.round(
                                  reports.reportDetail.creditFixedCommission
                                    ?.value * 100
                                ) / 100,
                                { code: "INR" }
                              )}
                            </div>
                            <div>
                              {currencyFormatter(
                                Math.round(
                                  reports.reportDetail.creditFixedCommission
                                    ?.tax * 100
                                ) / 100,
                                { code: "INR" }
                              )}
                            </div>
                            <div>
                              {currencyFormatter(
                                Math.round(
                                  reports.reportDetail.creditFixedCommission
                                    ?.total * 100
                                ) / 100,
                                { code: "INR" }
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-6">
                          <div className="report_head">
                            Credit Percentage Commission
                          </div>
                          <div className="col-xs-3 m-t-10">
                            <div className="report_lable">Value</div>
                            <div className="report_lable">Tax</div>
                            <div className="report_lable">Total</div>
                          </div>
                          <div className="col-xs-3 m-t-10">
                            <div>
                              {currencyFormatter(
                                Math.round(
                                  reports.reportDetail
                                    .creditPercentageCommission?.value * 100
                                ) / 100,
                                { code: "INR" }
                              )}
                            </div>
                            <div>
                              {currencyFormatter(
                                Math.round(
                                  reports.reportDetail
                                    .creditPercentageCommission?.tax * 100
                                ) / 100,
                                { code: "INR" }
                              )}
                            </div>
                            <div>
                              {currencyFormatter(
                                Math.round(
                                  reports.reportDetail
                                    .creditPercentageCommission?.value * 100
                                ) / 100,
                                { code: "INR" }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row m-t-20">
                        <div className="col-xs-6">
                          <div className="report_head">
                            Debit Fixed Commission
                          </div>
                          <div className="col-xs-3 m-t-10">
                            <div className="report_lable">Value</div>
                            <div className="report_lable">Tax</div>
                            <div className="report_lable">Total</div>
                          </div>
                          <div className="col-xs-3 m-t-10">
                            <div>
                              {currencyFormatter(
                                Math.round(
                                  reports?.reportDetail?.debitFixedCommission
                                    ?.value * 100
                                ) / 100,
                                { code: "INR" }
                              )}
                            </div>
                            <div>
                              {currencyFormatter(
                                Math.round(
                                  reports?.reportDetail?.debitFixedCommission
                                    ?.tax * 100
                                ) / 100,
                                { code: "INR" }
                              )}
                            </div>
                            <div>
                              {currencyFormatter(
                                Math.round(
                                  reports?.reportDetail?.debitFixedCommission
                                    ?.total * 100
                                ) / 100,
                                { code: "INR" }
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-6">
                          <div className="report_head">
                            Debit Percentage Commission
                          </div>
                          <div className="col-xs-3 m-t-10">
                            <div className="report_lable">Value</div>
                            <div className="report_lable">Tax</div>
                            <div className="report_lable">Total</div>
                          </div>
                          <div className="col-xs-3 m-t-10">
                            <div>
                              {currencyFormatter(
                                Math.round(
                                  reports?.reportDetail
                                    ?.debitPercentageCommission?.value * 100
                                ) / 100,
                                { code: "INR" }
                              )}
                            </div>
                            <div>
                              {currencyFormatter(
                                Math.round(
                                  reports?.reportDetail
                                    ?.debitPercentageCommission?.tax * 100
                                ) / 100,
                                { code: "INR" }
                              )}
                            </div>
                            <div>
                              {currencyFormatter(
                                Math.round(
                                  reports?.reportDetail
                                    ?.debitPercentageCommission?.total * 100
                                ) / 100,
                                { code: "INR" }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Reports;
