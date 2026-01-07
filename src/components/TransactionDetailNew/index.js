import React, { useRef, useEffect, memo, useState } from "react";
import {
  currencyFormatter,
  formatLabel,
  formatName,
  returnTimeZoneDate,
  textCapitalize,
  twelveHourDateTimeFormat,
} from "../../DataServices/Utils";
import Info from "../../assets/images/info-circle.png";
import Time from "../../assets/images/time-info.png";
import Payer from "../../assets/images/time-info.png";
import Success from "../../assets/images/check.png";
import Failed from "../../assets/images/error.png";
import PreviewDocs from "../PreviewDocs";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const TransactionDetail = (props) => {
  const [state, setState] = useState(true);

  const history = useHistory();
  const handleClose = () => {
    setState((prev) => ({
      ...prev,
      auditLog: [],
    }));
    props.closeModal();
  };

  const handleNavigateAccount = (id, transID) => {
    handleClose();

    if (id === "trans_id") {
      history.push(`/transaction/detail/${transID}`);
    } else if (id === "trans_ref") {
      history.push(`/transaction/detail/ref/${transID}`);
    }
  };

  return (
    <>
      <div
        className={
          props?.isTransDetail ? "modal modalbg fade in" : "modal fade"
        }
        style={
          props?.isTransDetail
            ? { display: "block", overflowX: "hidden", overflowY: "auto" }
            : {}
        }
      >
        <div className="trans-modal-dialog">
          <div className="modal-content">
            <div
              className={
                props?.TransactionDetail?.status === "success"
                  ? "status-header-success"
                  : props?.TransactionDetail?.status === "pending"
                  ? "status-header-pending"
                  : props?.TransactionDetail?.status === "accepted"
                  ? "status-header-accepted"
                  : props?.TransactionDetail?.status === "failed"
                  ? "status-header-failed"
                  : "status-header-accepted"
              }
            >
              <button
                type="button"
                className="close"
                onClick={props?.closeModal}
              >
                &times;
              </button>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="modal-title mb-0">
                    Transfer Details - #
                    {props?.TransactionDetail?.trans_id || "-"}
                  </h4>
                </div>
              </div>
            </div>
            <div className="clearfix"></div>
            <div className="container-fluid">
              <div className="trans-amount-sec">
                <span className="trans-modal-amount">
                  {props?.TransactionDetail?.transaction_amount
                    ? currencyFormatter(
                        Math.round(
                          props?.TransactionDetail?.transaction_amount * 100
                        ) / 100,
                        { code: "INR" }
                      )
                    : currencyFormatter(Math.round(0 * 100) / 100, {
                        code: "INR",
                      })}
                </span>

                <span className="detail-status-span">
                  <span
                    className={
                      props?.TransactionDetail?.status?.toLowerCase() ===
                      "accepted"
                        ? "label label-success label-sm accepted"
                        : props?.TransactionDetail?.status?.toLowerCase() ===
                          "queued"
                        ? "label label-success label-sm queued"
                        : props?.TransactionDetail?.status?.toLowerCase() ===
                          "processing"
                        ? "label label-primary label-sm processing"
                        : props?.TransactionDetail?.status?.toLowerCase() ===
                          "success"
                        ? "label label-success label-sm success"
                        : props?.TransactionDetail?.status?.toLowerCase() ===
                          "failed"
                        ? "label label-danger label-sm failed"
                        : props?.TransactionDetail?.status?.toLowerCase() ===
                          "cancelled"
                        ? "label label-warning label-sm cancelled"
                        : props.TransactionDetail?.status === "pending"
                        ? "label cancelled_trans label-sm failed"
                        : ""
                    }
                  >
                    {props?.TransactionDetail?.status
                      ? textCapitalize(props?.TransactionDetail?.status)
                      : "-"}
                  </span>
                </span>
              </div>

              <div className="div-line"></div>
              <div className="payment-detail-sec">
                <span className="info-span">
                  <img src={Info} alt="info" className="info-img" />
                </span>
                <span className="payment-text">
                  <span>Payment Details</span>
                </span>
              </div>

              <div className="col-xs-12 pay-section">
                <div className="col-xs-6">
                  <div className="row m-t-10">
                    <div className="col-xs-4 detail-label">Transfer Mode</div>
                    <div className="col-xs-6 detail-value">
                      {props?.TransactionDetail?.pay_mode
                        ? props?.TransactionDetail?.pay_mode
                        : ""}
                    </div>
                  </div>
                  <div className="row m-t-10">
                    <div className="col-xs-4 detail-label">Purpose</div>
                    <div className="col-xs-6 detail-value">
                      {props?.TransactionDetail?.product_type
                        ? formatName(props?.TransactionDetail?.product_type)
                        : "-"}
                    </div>
                  </div>
                  <div className="row m-t-10">
                    <div className="col-xs-4 detail-label">Sub Total</div>
                    <div className="col-xs-6 detail-value">
                      {props?.TransactionDetail?.transaction_amount
                        ? currencyFormatter(
                            Math.round(
                              props?.TransactionDetail?.transaction_amount * 100
                            ) / 100,
                            { code: "INR" }
                          )
                        : currencyFormatter(Math.round(0 * 100) / 100, {
                            code: "INR",
                          })}
                    </div>
                  </div>
                  <div className="row m-t-10">
                    <div className="col-xs-4 detail-label">Fees & tax</div>
                    <div className="col-xs-6 detail-value">
                      {props?.TransactionDetail?.commission
                        ? currencyFormatter(
                            Math.round(
                              props?.TransactionDetail?.commission?.value * 100
                            ) / 100,
                            { code: "INR" }
                          )
                        : currencyFormatter(Math.round(0 * 100) / 100, {
                            code: "INR",
                          })}
                      +
                      {props?.TransactionDetail?.commission
                        ? currencyFormatter(
                            Math.round(
                              props?.TransactionDetail?.commission?.tax * 100
                            ) / 100,
                            { code: "INR" }
                          )
                        : currencyFormatter(Math.round(0 * 100) / 100, {
                            code: "INR",
                          })}
                    </div>
                  </div>
                  {/* {state && (
                    <>
                      {" "}
                      <div className="row m-t-10">
                        <div className="col-xs-4 detail-label">
                          Paid (Fixed Commission)
                        </div>
                        <div className="col-xs-6 text-success-value">
                          {props?.TransactionDetail?.final_amount
                            ? currencyFormatter(
                                Math.round(
                                  props?.TransactionDetail?.final_amount * 100
                                ) / 100,
                                { code: "INR" }
                              )
                            : currencyFormatter(Math.round(0 * 100) / 100, {
                                code: "INR",
                              })}
                        </div>
                      </div>
                      <div className="row m-t-10">
                        <div className="col-xs-4 detail-label">
                          Unpaid (% Commission)
                        </div>
                        <div className="col-xs-6 text-failure-value">
                          {props?.TransactionDetail?.final_amount
                            ? currencyFormatter(
                                Math.round(
                                  props?.TransactionDetail?.final_amount * 100
                                ) / 100,
                                { code: "INR" }
                              )
                            : currencyFormatter(Math.round(0 * 100) / 100, {
                                code: "INR",
                              })}
                        </div>
                      </div>
                    </>
                  )} */}

                  <div className="row m-t-10">
                    <div className="col-xs-4 detail-label">Total</div>
                    <div className="col-xs-6 detail-value">
                      {props?.TransactionDetail?.final_amount
                        ? currencyFormatter(
                            Math.round(
                              props?.TransactionDetail?.final_amount * 100
                            ) / 100,
                            { code: "INR" }
                          )
                        : currencyFormatter(Math.round(0 * 100) / 100, {
                            code: "INR",
                          })}
                    </div>
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="row m-t-10">
                    <div className="col-xs-4 detail-label">UTR</div>
                    <div className="col-xs-6 detail-value">
                      {props?.TransactionDetail?.utr
                        ? props?.TransactionDetail?.utr
                        : "-"}
                    </div>
                  </div>

                  {props?.TransactionDetail?.product_type ===
                    "splitTransfer" && (
                    <div className="row m-t-10">
                      <div className="col-xs-4 detail-label">Reference ID</div>
                      <div className="col-xs-6 detail-value">
                        {props?.TransactionDetail?.trans_ref ? (
                          <Link
                            onClick={() =>
                              handleNavigateAccount(
                                "trans_ref",
                                props.TransactionDetail?.trans_ref
                              )
                            }
                          >
                            {props.TransactionDetail.trans_ref}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </div>
                    </div>
                  )}

                  <div className="row m-t-10">
                    <div className="col-xs-4 detail-label">Transaction ID</div>
                    <div className="col-xs-6 detail-value">
                      {props?.TransactionDetail?.trans_id
                        ? props?.TransactionDetail?.trans_id
                        : "-"}
                    </div>
                  </div>
                  <div className="row m-t-10">
                    <div className="col-xs-4 detail-label">Description</div>
                    <div className="col-xs-6 detail-value">
                      {props?.TransactionDetail?.remarks
                        ? props?.TransactionDetail?.remarks
                        : "-"}
                    </div>
                  </div>
                  <div className="row m-t-10">
                    <div className="col-xs-4 detail-label">Reseller</div>
                    <div className="col-xs-6 detail-value">
                      {props?.TransactionDetail?.reseller?.name
                        ? props?.TransactionDetail?.reseller?.name
                        : "-"}
                    </div>
                  </div>
                  <div className="row m-t-10">
                    <div className="col-xs-4 detail-label">Split Details</div>
                    <div className="col-xs-6 detail-value">
                      {props.TransactionDetail?.trans_type === "CREDIT" ||
                        (props.TransactionDetail?.trans_type === "DEBIT" && (
                          <div className="">
                            {/* <div> split details</div> */}
                            <>
                              <div className="info_value">
                                {props?.TransactionDetail?.split?.split_type ===
                                  "value" ||
                                props?.TransactionDetail?.split?.split_type ===
                                  "residual" ? (
                                  <span>
                                    {props?.TransactionDetail?.split?.amount
                                      ? currencyFormatter(
                                          Math.round(
                                            props?.TransactionDetail?.split
                                              ?.amount * 100
                                          ) / 100,
                                          { code: "INR" }
                                        )
                                      : currencyFormatter(
                                          Math.round(0 * 100) / 100,
                                          {
                                            code: "INR",
                                          }
                                        )}
                                  </span>
                                ) : (
                                  <span>
                                    {props?.TransactionDetail?.split?.value
                                      ? Math.round(
                                          props?.TransactionDetail?.split
                                            ?.value * 100
                                        ) / 100
                                      : Math.round(0 * 100) / 100}
                                    % -
                                    {props?.TransactionDetail?.split?.amount
                                      ? currencyFormatter(
                                          Math.round(
                                            props?.TransactionDetail?.split
                                              ?.amount * 100
                                          ) / 100,
                                          { code: "INR" }
                                        )
                                      : currencyFormatter(
                                          Math.round(0 * 100) / 100,
                                          {
                                            code: "INR",
                                          }
                                        )}
                                  </span>
                                )}
                              </div>
                              <Link
                                onClick={() =>
                                  handleNavigateAccount(
                                    "trans_id",
                                    props.TransactionDetail?.trans_id
                                  )
                                }
                              >
                                View Split Transaction
                              </Link>
                            </>
                          </div>
                        ))}
                      <div>
                        {props.TransactionDetail?.product_type ===
                          "splitTransfer" && (
                          <div className="d-flex align-items-center gap-10">
                            {/* <div className="modal-title m-l-10">Split details</div> */}
                            {/* <div className="info_value">
                              {props?.TransactionDetail?.split?.value
                                ? Math.round(
                                    props?.TransactionDetail?.split?.value * 100
                                  ) / 100
                                : Math.round(0 * 100) / 100}
                              % -
                              {props?.TransactionDetail?.split?.amount
                                ? currencyFormatter(
                                    Math.round(
                                      props?.TransactionDetail?.split?.amount *
                                        100
                                    ) / 100,
                                    {
                                      code: "INR",
                                    }
                                  )
                                : currencyFormatter(Math.round(0 * 100) / 100, {
                                    code: "INR",
                                  })}
                            </div> */}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {props?.TransactionDetail?.status?.toLowerCase() ===
                    "failed" && (
                    <div className="row m-t-10">
                      <div className="col-xs-4 detail-label">
                        Failure Reason
                      </div>
                      <div className="col-xs-6 detail-value">
                        {props?.TransactionDetail?.failure_reason
                          ? props?.TransactionDetail?.failure_reason
                          : "-"}
                      </div>
                    </div>
                  )}

                  {props?.TransactionDetail?.is_scheduled && (
                    <>
                      {" "}
                      <div className="row m-t-10">
                        <div className="col-xs-4 detail-label">
                          Scheduled Date & Time
                        </div>
                        <div className="col-xs-6 detail-value">
                          {props?.TransactionDetail?.schedule_payment?.time
                            ? returnTimeZoneDate(
                                props?.TransactionDetail?.schedule_payment?.time
                              )
                            : "-"}
                        </div>
                      </div>
                      <div className="row m-t-10">
                        <div className="col-xs-4 detail-label">
                          Scheduled Status
                        </div>
                        <div className="col-xs-6 detail-value">
                          <span
                            className={
                              props?.TransactionDetail?.schedule_payment
                                ?.status === "added"
                                ? "label label-info label-sm accepted"
                                : props?.TransactionDetail?.schedule_payment
                                    ?.status === "processed"
                                ? "label label-primary label-sm processing"
                                : props?.TransactionDetail?.schedule_payment
                                    ?.status === "cancelled"
                                ? "label label-warning label-sm cancelled"
                                : ""
                            }
                          >
                            {" "}
                            {props?.TransactionDetail?.schedule_payment?.status
                              ? textCapitalize(
                                  props?.TransactionDetail?.schedule_payment
                                    ?.status
                                )
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="row m-t-10">
                    {/* <div className="col-xs-4 detail-label">
                      Proof of Transaction
                    </div>
                    <div className="col-xs-6 detail-value">
                      <div className="doc-item">
                        <button
                          type="button"
                          onClick={openFullView}
                          className="doc-preview"
                          title={props.transactionData?.docs}
                        >
                          <img src={pdfimg} alt="PDF" />
                          <span className="doc-name">
                            {props.transactionData?.docs} 
                          </span>
                        </button>
                      </div>
                    </div> */}
                    {/* <PreviewDocs transactionData={props?.TransactionDetail} /> */}
                    <PreviewDocs
                      transactionData={props?.TransactionDetail}
                      labelStyle={"info_title"}
                    />
                  </div>
                </div>
              </div>
              <div className="clearfix"></div>
              {props?.TransactionDetail?.product_type !== "refund" ||
              props?.TransactionDetail?.product_type !== "acc_creation" ? (
                <>
                  <div className="div-line"></div>
                  <div className="payment-detail-sec">
                    <span className="info-span">
                      <img src={Time} alt="time" className="info-img" />
                    </span>
                    <span className="payment-text">
                      <span>Transaction Log</span>
                    </span>
                  </div>
                  <div className="col-xs-12">
                    {props?.auditLog?.length > 0 ? (
                      props?.auditLog?.map((list, i) => {
                        return (
                          <div key={i}>
                            <div className="detail-label m-t-10">
                              {list?.action === "TRANSACTION_INITIATED" ? (
                                <img
                                  src={Time}
                                  alt="inititated"
                                  className="h-15"
                                />
                              ) : list?.action === "TRANSACTION_SUCCESS" ? (
                                <img
                                  src={Success}
                                  alt="success"
                                  className="h-15 success-filter"
                                />
                              ) : list?.action === "TRANSACTION_REJECTED" ? (
                                <img
                                  src={Failed}
                                  alt="failed"
                                  className="h-15 failure-filter"
                                />
                              ) : null}
                              <span className="m-l-5">
                                {" "}
                                {formatLabel(list?.action)}
                              </span>
                            </div>
                            <div className="detail-value">
                              {returnTimeZoneDate(list?.createdAt)}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="detail-value">No Data</div>
                    )}
                  </div>
                  <div className="payment-time">
                    {/*           {props?.TransactionDetail?.product_type == "acc_creation" ||
                    props?.TransactionDetail?.product_type == "refund" ||
                    props?.TransactionDetail?.product_type ==
                      "upi_verification" ||
                    props?.TransactionDetail?.product_type == "acc_veri" ? (
                      <div className="col-xs-12">
                        <div className="p-20">
                          <div className="row">
                            <div className="col-xs-6">
                              <div>Created At</div>
                              <div>
                                {props?.TransactionDetail?.createdAt
                                  ? returnTimeZoneDate(
                                      props?.TransactionDetail?.createdAt
                                    )
                                  : "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="timeline-container"></div>
                        <div className="col-xs-12">
                          <div className="p-20">
                            <div className="row">
                              <div className="col-xs-6">
                                <div>Created At</div>
                                <div>
                                  {props?.TransactionDetail?.createdAt
                                    ? returnTimeZoneDate(
                                        props?.TransactionDetail?.createdAt
                                      )
                                    :  "-"}
                                </div>
                              </div>
                              <div className="col-xs-6">
                                <div>Completed At</div>
                                <div>
                                  {props?.TransactionDetail?.internal?.status
                                    ?.meta?.processingDate
                                    ? twelveHourDateTimeFormat(
                                        props?.TransactionDetail?.internal
                                          ?.status?.meta?.processingDate
                                      )
                                    : props?.TransactionDetail?.createdAt
                                    ? returnTimeZoneDate(
                                        props?.TransactionDetail?.createdAt
                                      )
                                    : "-"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )} */}
                  </div>
                  <div className="clearfix"></div>

                  {/* Payout*/}

                  {props?.TransactionDetail?.trans_type?.toLowerCase() ==
                    "debit" &&
                    props?.TransactionDetail?.product_type?.toLowerCase() ==
                      "payout" && (
                      <>
                        <div className="div-line"></div>
                        <div className="payment-detail-sec">
                          <span className="info-span">
                            <img src={Payer} alt="payee" className="info-img" />
                          </span>
                          <span className="payment-text">
                            <span>Payer / Payee Details</span>
                          </span>
                        </div>
                        <div className="col-xs-12 m-t-10 m-b-30 payment_account_section">
                          <div className="payment_line">
                            <div className="trans_line"></div>
                            <div className="trans_img">
                              {props?.TransactionDetail?.status ===
                              "success" ? (
                                <img
                                  src={Success}
                                  alt="success"
                                  className="check_img"
                                />
                              ) : (
                                <img
                                  src={Failed}
                                  alt="failed"
                                  className="error_check"
                                />
                              )}
                            </div>
                            <div className="trans_line"></div>
                          </div>
                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Payment From
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.holder_name
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.holder_name
                                  : "-"
                                : props?.TransactionDetail?.van?.name
                                ? props?.TransactionDetail?.van?.name
                                : props?.TransactionDetail?.merchant?.name
                                ? props?.TransactionDetail?.merchant?.name
                                : ""}
                            </div>
                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.number
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.number
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.number
                                ? props?.TransactionDetail?.van?.account?.number
                                : ""}
                            </div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.ifsc
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.ifsc
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.ifsc
                                ? props?.TransactionDetail?.van?.account?.ifsc
                                : ""}
                            </div>
                          </div>
                          <div className="col-xs-6">
                            <div className="m-t-10 payment-label-head">
                              Payment Sent to
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.beneficiary?.name?.full
                                ? props?.TransactionDetail?.beneficiary?.name
                                    ?.full
                                : "-"}
                            </div>

                            {props?.TransactionDetail?.pay_mode.toLowerCase() ==
                            "upi" ? (
                              <>
                                <div className="m-t-15 payment-label">
                                  UPI ID
                                </div>
                                <div className="m-t-5 detail-value">
                                  {props.TransactionDetail?.beneficiary?.account
                                    ?.number
                                    ? props.TransactionDetail?.beneficiary
                                        ?.account?.number
                                    : "-"}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="m-t-15 payment-label">
                                  Account Number
                                </div>
                                <div className="m-t-5 detail-value">
                                  {props.TransactionDetail?.beneficiary?.account
                                    ?.number
                                    ? props.TransactionDetail?.beneficiary
                                        ?.account?.number
                                    : "-"}
                                </div>
                                <div className="m-t-15 payment-label">IFSC</div>
                                <div className="m-t-5 detail-value">
                                  {props.TransactionDetail?.beneficiary?.account
                                    ?.ifsc
                                    ? props.TransactionDetail?.beneficiary
                                        ?.account?.ifsc
                                    : "-"}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                  {/* Payout com credit*/}

                  {props?.TransactionDetail?.trans_type?.toLowerCase() ==
                    "com_credit" &&
                    props?.TransactionDetail?.product_type?.toLowerCase() ==
                      "payout" && (
                      <>
                        <div className="div-line"></div>
                        <div className="payment-detail-sec">
                          <span className="info-span">
                            <img src={Payer} alt="payee" className="info-img" />
                          </span>
                          <span className="payment-text">
                            <span>Payer / Payee Details</span>
                          </span>
                        </div>
                        <div className="col-xs-12 m-t-10 m-b-30 payment_account_section">
                          <div className="payment_line">
                            <div className="trans_line"></div>
                            <div className="trans_img">
                              {props?.TransactionDetail?.status ===
                              "success" ? (
                                <img
                                  src={Success}
                                  alt="success"
                                  className="check_img"
                                />
                              ) : (
                                <img
                                  src={Failed}
                                  alt="failed"
                                  className="error_check"
                                />
                              )}
                            </div>
                            <div className="trans_line"></div>
                          </div>
                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Payment From
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.remmiter?.name
                                ? props?.TransactionDetail?.remmiter?.name
                                : ""}
                            </div>
                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.remmiter?.account_no
                                ? props?.TransactionDetail?.remmiter?.account_no
                                : ""}
                            </div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.remmiter?.ifsc
                                ? props?.TransactionDetail?.remmiter?.ifsc
                                : ""}
                            </div>
                          </div>
                          <div className="col-xs-6">
                            <div className="m-t-10 payment-label-head">
                              Payment Sent to
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.merchant?.name
                                ? props?.TransactionDetail?.merchant?.name
                                : "-"}
                            </div>

                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">-</div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">-</div>
                          </div>
                        </div>
                      </>
                    )}

                  {/* acc verify */}
                  {props?.TransactionDetail?.trans_type?.toLowerCase() ==
                    "debit" &&
                    props?.TransactionDetail?.product_type?.toLowerCase() ==
                      "acc_veri" && (
                      <>
                        <div className="div-line"></div>
                        <div className="payment-detail-sec">
                          <span className="info-span">
                            <img src={Payer} alt="payee" className="info-img" />
                          </span>
                          <span className="payment-text">
                            <span>Payer / Payee Details</span>
                          </span>
                        </div>
                        <div className="col-xs-12 m-t-10 m-b-30 payment_account_section">
                          <div className="payment_line">
                            <div className="trans_line"></div>
                            <div className="trans_img">
                              {props?.TransactionDetail?.status ===
                              "success" ? (
                                <img
                                  src={Success}
                                  alt="success"
                                  className="check_img"
                                />
                              ) : (
                                <img
                                  src={Failed}
                                  alt="failed"
                                  className="error_check"
                                />
                              )}
                            </div>
                            <div className="trans_line"></div>
                          </div>
                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Payment From
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.merchant?.name
                                ? props?.TransactionDetail?.merchant?.name
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.number
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.number
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.number
                                ? props?.TransactionDetail?.van?.account?.number
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.ifsc
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.ifsc
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.ifsc
                                ? props?.TransactionDetail?.van?.account?.ifsc
                                : "-"}
                            </div>
                          </div>

                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Account Verification For
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.beneficiary?.name?.full
                                ? props?.TransactionDetail?.beneficiary?.name
                                    ?.full
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.beneficiary?.account
                                ?.number
                                ? props?.TransactionDetail?.beneficiary?.account
                                    ?.number
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.beneficiary?.account
                                ?.ifsc
                                ? props?.TransactionDetail?.beneficiary?.account
                                    ?.ifsc
                                : "-"}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  {/* acc verify com credit */}
                  {props?.TransactionDetail?.trans_type?.toLowerCase() ==
                    "com_credit" &&
                    props?.TransactionDetail?.product_type?.toLowerCase() ==
                      "acc_veri" && (
                      <>
                        <div className="div-line"></div>
                        <div className="payment-detail-sec">
                          <span className="info-span">
                            <img src={Payer} alt="payee" className="info-img" />
                          </span>
                          <span className="payment-text">
                            <span>Payer / Payee Details</span>
                          </span>
                        </div>
                        <div className="col-xs-12 m-t-10 m-b-30 payment_account_section">
                          <div className="payment_line">
                            <div className="trans_line"></div>
                            <div className="trans_img">
                              {props?.TransactionDetail?.status ===
                              "success" ? (
                                <img
                                  src={Success}
                                  alt="success"
                                  className="check_img"
                                />
                              ) : (
                                <img
                                  src={Failed}
                                  alt="failed"
                                  className="error_check"
                                />
                              )}
                            </div>
                            <div className="trans_line"></div>
                          </div>
                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Payment From
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props.TransactionDetail?.remmiter?.name
                                ? props.TransactionDetail?.remmiter?.name
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">
                              {props.TransactionDetail?.remmiter?.account_no
                                ? props.TransactionDetail?.remmiter?.account_no
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.remmiter?.ifsc
                                ? props?.TransactionDetail?.remmiter?.ifsc
                                : "-"}
                            </div>
                          </div>

                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Payment Sent To
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props.TransactionDetail?.merchant?.name
                                ? props.TransactionDetail?.merchant?.name
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">-</div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">-</div>
                          </div>
                        </div>
                      </>
                    )}

                  {/* UPi verify */}
                  {props?.TransactionDetail?.trans_type?.toLowerCase() ==
                    "debit" &&
                    props?.TransactionDetail?.product_type?.toLowerCase() ==
                      "upi_verification" && (
                      <>
                        <div className="div-line"></div>
                        <div className="payment-detail-sec">
                          <span className="info-span">
                            <img src={Payer} alt="payee" className="info-img" />
                          </span>
                          <span className="payment-text">
                            <span>Payer / Payee Details</span>
                          </span>
                        </div>
                        <div className="col-xs-12 m-t-10 m-b-30 payment_account_section">
                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Account Verification For
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.beneficiary?.name?.full
                                ? props?.TransactionDetail?.beneficiary?.name
                                    ?.full
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">UPI ID</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.beneficiary?.account
                                ?.number
                                ? props?.TransactionDetail?.beneficiary?.account
                                    ?.number
                                : "-"}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  {/* upi verfy com credit */}

                  {props?.TransactionDetail?.trans_type?.toLowerCase() ==
                    "com_credit" &&
                    props?.TransactionDetail?.product_type?.toLowerCase() ==
                      "upi_verification" && (
                      <>
                        <div className="div-line"></div>
                        <div className="payment-detail-sec">
                          <span className="info-span">
                            <img src={Payer} alt="payee" className="info-img" />
                          </span>
                          <span className="payment-text">
                            <span>Payer / Payee Details</span>
                          </span>
                        </div>
                        <div className="col-xs-12 m-t-10 m-b-30 payment_account_section">
                          <div className="col-xs-6">
                            <div className="m-t-10 payment-label-head">
                              Account Information
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.merchant?.name
                                ? props?.TransactionDetail?.merchant?.name
                                : "-"}
                            </div>

                            <div className="m-t-15 payment-label">UPI ID</div>
                            <div className="m-t-5 detail-value">-</div>
                          </div>
                        </div>
                      </>
                    )}

                  {/* ecollect*/}
                  {props?.TransactionDetail?.trans_type?.toLowerCase() ==
                    "credit" &&
                    props?.TransactionDetail?.product_type?.toLowerCase() ==
                      "ecollect" && (
                      <>
                        <div className="div-line"></div>
                        <div className="payment-detail-sec">
                          <span className="info-span">
                            <img src={Payer} alt="payee" className="info-img" />
                          </span>
                          <span className="payment-text">
                            <span>Payer / Payee Details</span>
                          </span>
                        </div>
                        <div className="col-xs-12 m-t-10 m-b-30 payment_account_section">
                          <div className="payment_collect_line">
                            <div className="trans_collect_line"></div>
                            <div className="trans_img">
                              {props?.TransactionDetail?.status ===
                              "success" ? (
                                <img
                                  src={Success}
                                  alt="success"
                                  className="check_img"
                                />
                              ) : (
                                <img
                                  src={Failed}
                                  alt="failed"
                                  className="error_check"
                                />
                              )}
                            </div>
                            <div className="trans_collect_line"></div>
                          </div>
                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Payment Collected From
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.remmiter?.name
                                ? props?.TransactionDetail?.remmiter?.name
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.remmiter?.account_no
                                ? props?.TransactionDetail?.remmiter?.account_no
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.remmiter.ifsc
                                ? props?.TransactionDetail?.remmiter.ifsc
                                : "-"}
                            </div>
                          </div>
                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Payment Received To
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.merchant?.name
                                ? props?.TransactionDetail?.merchant?.name
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.number
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.number
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.number
                                ? props?.TransactionDetail?.van?.account?.number
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.ifsc
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.ifsc
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.ifsc
                                ? props?.TransactionDetail?.van?.account?.ifsc
                                : "-"}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  {/* ecollect com credit */}
                  {props?.TransactionDetail?.trans_type?.toLowerCase() ==
                    "com_credit" &&
                    props?.TransactionDetail?.product_type?.toLowerCase() ==
                      "ecollect" && (
                      <>
                        <div className="div-line"></div>
                        <div className="payment-detail-sec">
                          <span className="info-span">
                            <img src={Payer} alt="payee" className="info-img" />
                          </span>
                          <span className="payment-text">
                            <span>Payer / Payee Details</span>
                          </span>
                        </div>
                        <div className="col-xs-12 m-t-10 m-b-30 payment_account_section">
                          <div className="payment_collect_line">
                            <div className="trans_collect_line"></div>
                            <div className="trans_img">
                              {props?.TransactionDetail?.status ===
                              "success" ? (
                                <img
                                  src={Success}
                                  alt="success"
                                  className="check_img"
                                />
                              ) : (
                                <img
                                  src={Failed}
                                  alt="failed"
                                  className="error_check"
                                />
                              )}
                            </div>
                            <div className="trans_collect_line"></div>
                          </div>
                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Payment Collected From
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.remmiter?.name
                                ? props?.TransactionDetail?.remmiter?.name
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.remmiter?.account_no
                                ? props?.TransactionDetail?.remmiter?.account_no
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.remmiter.ifsc
                                ? props?.TransactionDetail?.remmiter.ifsc
                                : "-"}
                            </div>
                          </div>
                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Payment Received To
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.merchant?.name
                                ? props?.TransactionDetail?.merchant?.name
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.number
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.number
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.number
                                ? props?.TransactionDetail?.van?.account?.number
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.ifsc
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.ifsc
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.ifsc
                                ? props?.TransactionDetail?.van?.account?.ifsc
                                : "-"}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  {/* Acc Creation */}
                  {props?.TransactionDetail?.trans_type?.toLowerCase() ==
                    "debit" &&
                    props?.TransactionDetail?.product_type?.toLowerCase() ==
                      "acc_creation" && (
                      <>
                        <div className="div-line"></div>
                        <div className="payment-detail-sec">
                          <span className="info-span">
                            <img src={Payer} alt="payee" className="info-img" />
                          </span>
                          <span className="payment-text">
                            <span>Payer / Payee Details</span>
                          </span>
                        </div>
                        <div className="col-xs-12 m-t-10 m-b-30 payment_account_section">
                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Account Created From
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.merchant?.name
                                ? props?.TransactionDetail?.merchant?.name
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.number
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.number
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.number
                                ? props?.TransactionDetail?.van?.account?.number
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.ifsc
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.ifsc
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.ifsc
                                ? props?.TransactionDetail?.van?.account?.ifsc
                                : "-"}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  {/* Acc Creation com credit */}
                  {props?.TransactionDetail?.trans_type?.toLowerCase() ==
                    "com_credit" &&
                    props?.TransactionDetail?.product_type?.toLowerCase() ==
                      "acc_creation" && (
                      <>
                        <div className="div-line"></div>
                        <div className="payment-detail-sec">
                          <span className="info-span">
                            <img src={Payer} alt="payee" className="info-img" />
                          </span>
                          <span className="payment-text">
                            <span>Payer / Payee Details</span>
                          </span>
                        </div>
                        <div className="col-xs-12 m-t-10 m-b-30 payment_account_section">
                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Payment Sent to
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.merchant?.name
                                ? props?.TransactionDetail?.merchant?.name
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.number
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.number
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.number
                                ? props?.TransactionDetail?.van?.account?.number
                                : "-"}
                            </div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.ifsc
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.ifsc
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.ifsc
                                ? props?.TransactionDetail?.van?.account?.ifsc
                                : "-"}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  {/*Split Transfer*/}
                  {props?.TransactionDetail?.trans_type?.toLowerCase() ==
                    "debit" &&
                    props?.TransactionDetail?.product_type?.toLowerCase() ==
                      "splittransfer" && (
                      <>
                        <div className="div-line"></div>
                        <div className="payment-detail-sec">
                          <span className="info-span">
                            <img src={Payer} alt="payee" className="info-img" />
                          </span>
                          <span className="payment-text">
                            <span>Payer / Payee Details</span>
                          </span>
                        </div>
                        <div className="col-xs-12 m-t-10 m-b-30 payment_account_section">
                          <div className="payment_line">
                            <div className="trans_line"></div>
                            <div className="trans_img">
                              {props?.TransactionDetail?.status ===
                              "success" ? (
                                <img
                                  src={Success}
                                  alt="success"
                                  className="check_img"
                                />
                              ) : (
                                <img
                                  src={Failed}
                                  alt="failed"
                                  className="error_check"
                                />
                              )}
                            </div>
                            <div className="trans_line"></div>
                          </div>
                          <div className="col-xs-6">
                            <div className="m-t-15 payment-label-head">
                              Payment From
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.holder_name
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.holder_name
                                  : "-"
                                : props?.TransactionDetail?.van?.name
                                ? props?.TransactionDetail?.van?.name
                                : props?.TransactionDetail?.merchant?.name
                                ? props?.TransactionDetail?.merchant?.name
                                : ""}
                            </div>
                            <div className="m-t-15 payment-label">
                              Account Number
                            </div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.number
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.number
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.number
                                ? props?.TransactionDetail?.van?.account?.number
                                : ""}
                            </div>
                            <div className="m-t-15 payment-label">IFSC</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.connected_bank
                                ? props?.TransactionDetail?.connected_bank
                                    ?.account?.ifsc
                                  ? props?.TransactionDetail?.connected_bank
                                      ?.account?.ifsc
                                  : "-"
                                : props?.TransactionDetail?.van?.account?.ifsc
                                ? props?.TransactionDetail?.van?.account?.ifsc
                                : ""}
                            </div>
                          </div>
                          <div className="col-xs-6">
                            <div className="m-t-10 payment-label-head">
                              Payment Sent to
                            </div>
                            <div className="m-t-15 payment-label">Name</div>
                            <div className="m-t-5 detail-value">
                              {props?.TransactionDetail?.beneficiary?.name?.full
                                ? props?.TransactionDetail?.beneficiary?.name
                                    ?.full
                                : "-"}
                            </div>

                            {props?.TransactionDetail?.pay_mode.toLowerCase() ==
                            "upi" ? (
                              <>
                                <div className="m-t-15 payment-label">
                                  UPI ID
                                </div>
                                <div className="m-t-5 detail-value">
                                  {props.TransactionDetail?.beneficiary?.account
                                    ?.number
                                    ? props.TransactionDetail?.beneficiary
                                        ?.account?.number
                                    : "-"}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="m-t-15 payment-label">
                                  Account Number
                                </div>
                                <div className="m-t-5 detail-value">
                                  {props.TransactionDetail?.beneficiary?.account
                                    ?.number
                                    ? props.TransactionDetail?.beneficiary
                                        ?.account?.number
                                    : "-"}
                                </div>
                                <div className="m-t-15 payment-label">IFSC</div>
                                <div className="m-t-5 detail-value">
                                  {props.TransactionDetail?.beneficiary?.account
                                    ?.ifsc
                                    ? props.TransactionDetail?.beneficiary
                                        ?.account?.ifsc
                                    : "-"}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(TransactionDetail);
