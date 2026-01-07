import React, { useRef, useEffect, memo } from "react";
import { currencyFormatter, formatName, returnTimeZoneDate, textCapitalize } from "../DataServices/Utils";

const TransactionDetail = (props) => {

    return (
        <>
            <div className={props?.isTransDetail ? "modal modalbg fade in" : "modal fade"} style={props?.isTransDetail ? { display: "block", overflowX: "hidden", overflowY: "auto" } : {}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={props?.closeModal}>&times;</button>
                            <h4 className="modal-title">Transfer Details - #{props?.TransactionDetail?.trans_id ? props?.TransactionDetail?.trans_id : "-"}</h4>
                        </div>
                        <div className="modal-body clearfix modal_label_right">
                            <div className="col-xs-12 p-0 m-b-15">
                                <div className="tab_sub_title width_auto m-0 line_height_38">
                                    Amount -{" "}
                                </div>
                                <div className="tab_title width_auto m-l-10 m-t-0 line_height_38">
                                    {props?.TransactionDetail?.transaction_amount ? currencyFormatter(
                                        Math.round(props?.TransactionDetail?.transaction_amount * 100) /
                                        100,
                                        { code: "INR" }
                                    ) :  currencyFormatter(
                                        Math.round(0 * 100) /
                                        100,
                                        { code: "INR" }
                                    )}
                                </div>
                            </div>
                               
                            <p className="account-head">Payment Information  </p>
                            <div className="col-xs-12 col-sm-6 p-0">
                                {(props?.TransactionDetail?.product_type !== 'acc_creation' && props?.TransactionDetail?.product_type !== 'upi_verification') &&
                                    <>
                                        <div className="info_title">UTR Number</div>
                                        <div className="info_value">{props?.TransactionDetail?.utr ? props?.TransactionDetail?.utr : "-"}</div>
                                        <div className="info_title">Purpose</div>
                                        <div className="info_value">
                                            {props?.TransactionDetail?.product_type
                                                ? formatName(props?.TransactionDetail?.product_type)
                                                : "-"}
                                        </div>
                                    </>
                                }
                                <div className="info_title">Reference ID</div>
                                <div className="info_value">
                                    {props?.TransactionDetail?.trans_ref ? props?.TransactionDetail?.trans_ref : ""}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 p-0">
                                {(props?.TransactionDetail?.product_type != 'acc_creation' && props?.TransactionDetail?.product_type != 'upi_verification') &&
                                    <>
                                        <div className="info_title">Transfer Method</div>
                                        <div className="info_value">
                                            {props?.TransactionDetail?.pay_mode ?  props?.TransactionDetail?.pay_mode : ""}
                                        </div>
                                    </>
                                }
                                <div className="info_title">Created By</div>
                                <div className="info_value">
                                    {props?.TransactionDetail?.init_source
                                        ? props?.TransactionDetail?.init_source
                                        : "API"}
                                </div>
                                <div className="info_title">Payout Purpose</div>
                                <div className="info_value">
                                    {props?.TransactionDetail?.remarks
                                        ? props?.TransactionDetail?.remarks
                                        : "-"}
                                </div>
                     
                            </div>
                            <div className="clearfix"></div>
                            {(props?.TransactionDetail?.product_type == 'upi_verification') && <div className="col-xs-12 col-sm-6 p-0">
                                    <p className="account-head">Account Information</p>
                                    <div className="info_title">Name</div>
                                    <div className="info_value">
                                        {props?.TransactionDetail?.beneficiary?.name?.full ? props?.TransactionDetail?.beneficiary?.name?.full : ""}
                                    </div>
                                    <div className="info_title">UPI ID</div>
                                    <div className="info_value">
                                        {props?.TransactionDetail?.beneficiary?.account?.number ? props?.TransactionDetail?.beneficiary?.account?.number : ""}
                                    </div>
                                   
                                </div>}
                            {(props.TransactionDetail?.product_type == 'payout' || props.TransactionDetail?.product_type != 'acc_creation' && props?.TransactionDetail?.product_type != 'upi_verification' && props?.TransactionDetail?.product_type != 'ecollect') &&
                                <div className="col-xs-12 col-sm-6 p-0">
                                    <p className="account-head">Payment from...</p>
                                    <div className="info_title">Name</div>
                                    <div className="info_value">
                                        {props?.TransactionDetail?.merchant?.name ? props?.TransactionDetail?.merchant?.name : ""}
                                    </div>
                                    <div className="info_title">Account Number</div>
                                    <div className="info_value">
                                        {props?.TransactionDetail?.van?.account?.number ? props?.TransactionDetail?.van?.account?.number : ""}
                                    </div>
                                    <div className="info_title">IFSC</div>
                                    <div className="info_value">
                                        {props?.TransactionDetail?.van?.account?.ifsc ? props?.TransactionDetail?.van?.account?.ifsc : ""}
                                    </div>
                                </div>
                            }
                            <div className="col-xs-12 col-sm-6 p-0">
                                {(props.TransactionDetail?.product_type != 'acc_creation' && props.TransactionDetail?.product_type != 'upi_verification') &&
                                    <>
                                        {
                                            props?.TransactionDetail?.product_type == 'payout' ?
                                                <p className="account-head">Payment sent to...</p>
                                                :
                                                props?.TransactionDetail?.product_type == 'acc_veri' ?
                                                    <p className="account-head">Account Verification</p>
                                                    :
                                                    props?.TransactionDetail?.product_type == 'refund' ?
                                                        <p className="account-head">Refund to...</p>
                                                        :
                                                        props?.TransactionDetail?.product_type == 'ecollect' ?
                                                            <p className="account-head">Payment Collected from</p>
                                                            :
                                                            props?.TransactionDetail?.product_type == 'topup' ?
                                                                <p className="account-head">Account Topup</p>
                                                                :
                                                                <p className="account-head">Payment sent to</p>
                                        }

                                        {props?.TransactionDetail?.trans_type?.toLowerCase() == 'debit' ?
                                            <>
                                                <div className="info_title">Name</div>
                                                <div className="info_value">
                                                    {props?.TransactionDetail?.beneficiary?.name?.full ? props?.TransactionDetail?.beneficiary?.name?.full : '-'}
                                                </div>
                                                {
                                                    props?.TransactionDetail?.pay_mode?.toLowerCase() == 'upi' ?
                                                        <>
                                                            <div className="info_title">UPI ID</div>
                                                            <div className="info_value">
                                                                {props.TransactionDetail?.beneficiary?.account?.number ? props.TransactionDetail?.beneficiary?.account?.number : '-'}
                                                            </div>
                                                        </>
                                                        :
                                                        <>
                                                            <div className="info_title">Account Number</div>
                                                            <div className="info_value">
                                                                {props.TransactionDetail?.beneficiary?.account?.number ? props.TransactionDetail?.beneficiary?.account?.number : '-'}
                                                            </div>
                                                            <div className="info_title">IFSC</div>
                                                            <div className="info_value">
                                                                {props.TransactionDetail?.beneficiary?.account?.ifsc ? props.TransactionDetail?.beneficiary?.account?.ifsc : '-'}
                                                            </div>
                                                        </>
                                                }
                                            </>
                                            :
                                            <>
                                                <div className="info_title">Name</div>
                                                <div className="info_value">
                                                    {props.TransactionDetail?.remmiter?.name ? props.TransactionDetail?.remmiter?.name : '-'}
                                                </div>
                                                {props?.TransactionDetail?.pay_mode?.toLowerCase() == 'upi' ?
                                                    <>
                                                        <div className="info_title">UPI ID</div>
                                                        <div className="info_value">
                                                            {props.TransactionDetail?.remmiter?.account_no ? props.TransactionDetail?.remmiter?.account_no : '-'}
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div className="info_title">Account Number</div>
                                                        <div className="info_value">
                                                            {props?.TransactionDetail?.remmiter?.account_no ? props?.TransactionDetail?.remmiter?.account_no : '-'}
                                                        </div>
                                                        <div className="info_title">IFSC</div>
                                                        <div className="info_value">
                                                            {props?.TransactionDetail?.remmiter?.ifsc ? props?.TransactionDetail?.remmiter?.ifsc : '-'}
                                                        </div>
                                                    </>
                                                }
                                            </>
                                        }
                                    </>
                                }
                            </div>
                            {props.TransactionDetail?.product_type == 'ecollect' &&
                                <div className="col-xs-12 col-sm-6 p-0">
                                    <p className="account-head">Payment Received to</p>
                                    <div className="info_title">Name</div>
                                    <div className="info_value">
                                        {props?.TransactionDetail?.merchant?.name ? props?.TransactionDetail?.merchant?.name : "-"}
                                    </div>
                                    <div className="info_title">Account Number</div>
                                    <div className="info_value">
                                        {props?.TransactionDetail?.van?.account?.number ? props?.TransactionDetail?.van?.account?.number : "-"}
                                    </div>
                                    <div className="info_title">IFSC</div>
                                    <div className="info_value">
                                        {props?.TransactionDetail?.van?.account?.ifsc ? props?.TransactionDetail?.van?.account?.ifsc  : "-"}
                                    </div>
                                </div>
                            }
                            {props?.TransactionDetail?.pay_mode?.toLowerCase() == 'upi' && <div className="clearfix"></div>}
                            <p className="account-head">Transaction Information</p>
                            <div className="col-xs-12 col-sm-6 p-0">
                                {(props?.TransactionDetail?.product_type != 'acc_creation' && props?.TransactionDetail?.product_type != 'upi_verification' && props?.TransactionDetail?.product_type != 'ecollect') ?
                                    <>
                                        <div className="info_title">Amount</div>
                                        <div className="info_value">
                                            {props?.TransactionDetail?.final_amount ? currencyFormatter(
                                                Math.round(props?.TransactionDetail?.final_amount * 100) /
                                                100,
                                                { code: "INR" }
                                            ) : currencyFormatter(
                                                Math.round(0 * 100) /
                                                100,
                                                { code: "INR" }
                                            )}
                                            <div className="trans_total">
                                                (
                                                Sub Total {props?.TransactionDetail?.transaction_amount ? currencyFormatter(
                                                    Math.round(props?.TransactionDetail?.transaction_amount * 100) / 100,
                                                    { code: "INR" }
                                                ) : currencyFormatter(
                                                    Math.round(0 * 100) / 100,
                                                    { code: "INR" }
                                                )} +
                                                Fees & Tax {props?.TransactionDetail?.commission?.total ? currencyFormatter(
                                                    Math.round(props?.TransactionDetail?.commission?.total * 100) /
                                                    100,
                                                    { code: "INR" }
                                                ) : currencyFormatter(
                                                    Math.round(0 * 100) /
                                                    100,
                                                    { code: "INR" }
                                                )}
                                                )
                                            </div>
                                        </div>
                                    </> :
                                    (props?.TransactionDetail?.product_type == 'ecollect') ?
                                        <>
                                            <div className="info_title">Amount</div>
                                            <div className="info_value">
                                                {props?.TransactionDetail?.final_amount ? currencyFormatter(
                                                    Math.round(props?.TransactionDetail?.final_amount * 100) /
                                                    100,
                                                    { code: "INR" }
                                                ) : currencyFormatter(
                                                    Math.round(0 * 100) /
                                                    100,
                                                    { code: "INR" }
                                                )}
                                                <div className="trans_total">
                                                    (
                                                    Sub Total {props?.TransactionDetail?.transaction_amount ? currencyFormatter(
                                                        Math.round(props?.TransactionDetail?.transaction_amount * 100) / 100,
                                                        { code: "INR" }
                                                    ) : currencyFormatter(
                                                        Math.round(0 * 100) / 100,
                                                        { code: "INR" }
                                                    )} -
                                                    Fees & Tax {props?.TransactionDetail?.commission?.total ? currencyFormatter(
                                                        Math.round(props?.TransactionDetail?.commission?.total * 100) /
                                                        100,
                                                        { code: "INR" }
                                                    ) : currencyFormatter(
                                                        Math.round(0 * 100) /
                                                        100,
                                                        { code: "INR" }
                                                    )}
                                                    )
                                                </div>
                                            </div>
                                        </> :
                                        (props?.TransactionDetail?.product_type == 'acc_creation') ?
                                            <>
                                                <div className="info_title">Amount</div>
                                                <div className="info_value">
                                                    {props?.TransactionDetail?.final_amount ? currencyFormatter(
                                                        Math.round(props?.TransactionDetail?.final_amount * 100) /
                                                        100,
                                                        { code: "INR" }
                                                    ) : currencyFormatter(
                                                        Math.round(0 * 100) /
                                                        100,
                                                        { code: "INR" }
                                                    )}
                                                    <div className="trans_total">
                                                        (
                                                        Sub Total {props?.TransactionDetail?.transaction_amount ? currencyFormatter(
                                                            Math.round(props?.TransactionDetail?.transaction_amount * 100) / 100,
                                                            { code: "INR" }
                                                        ) : currencyFormatter(
                                                            Math.round(0 * 100) / 100,
                                                            { code: "INR" }
                                                        )} +
                                                        Fees & Tax {props?.TransactionDetail?.commission?.total ? currencyFormatter(
                                                            Math.round(props?.TransactionDetail?.commission?.total * 100) /
                                                            100,
                                                            { code: "INR" }
                                                        ) : currencyFormatter(
                                                            Math.round(0 * 100) /
                                                            100,
                                                            { code: "INR" }
                                                        )}
                                                        )
                                                    </div>
                                                </div>
                                            </> :
                                            (props?.TransactionDetail?.product_type == 'upi_verification') ?
                                                <>
                                                    <div className="info_title">Amount</div>
                                                    <div className="info_value">
                                                        {props?.TransactionDetail?.final_amount ? currencyFormatter(
                                                            Math.round(props?.TransactionDetail?.final_amount * 100) /
                                                            100,
                                                            { code: "INR" }
                                                        ) : currencyFormatter(
                                                            Math.round(0 * 100) /
                                                            100,
                                                            { code: "INR" }
                                                        )}
                                                        <div className="trans_total">
                                                            (
                                                            Sub Total {props?.TransactionDetail?.transaction_amount ? currencyFormatter(
                                                                Math.round(props?.TransactionDetail?.transaction_amount * 100) / 100,
                                                                { code: "INR" }
                                                            ) : currencyFormatter(
                                                                Math.round(0 * 100) / 100,
                                                                { code: "INR" }
                                                            )} +
                                                            Fees & Tax {props?.TransactionDetail?.commission?.total ? currencyFormatter(
                                                                Math.round(props?.TransactionDetail?.commission?.total * 100) /
                                                                100,
                                                                { code: "INR" }
                                                            ) : currencyFormatter(
                                                                Math.round(0 * 100) /
                                                                100,
                                                                { code: "INR" }
                                                            )}
                                                            )
                                                        </div>
                                                    </div>
                                                   
                                                    
                                                </> :
                                                <>
                                                    <div className="info_title">Total</div>
                                                    <div className="info_value">
                                                        {props?.TransactionDetail?.transaction_amount ? currencyFormatter(
                                                            Math.round(props?.TransactionDetail?.transaction_amount * 100) / 100,
                                                            { code: "INR" }
                                                        ) : currencyFormatter(
                                                            Math.round(0 * 100) / 100,
                                                            { code: "INR" }
                                                        )}
                                                    </div></>
                                }
                                <div className="info_title">Transaction ID</div>
                                <div className="info_value">
                                    {props?.TransactionDetail?.trans_id ? props?.TransactionDetail?.trans_id : "-"}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 p-0">
                                <div className="info_title">Status</div>
                                <div className="info_value">
                                    <a
                                        className={
                                            props?.TransactionDetail?.status?.toLowerCase() === "accepted"
                                                ? "label label-success label-sm accepted"
                                                : props?.TransactionDetail?.status?.toLowerCase() === "queued"
                                                    ? "label label-success label-sm queued"
                                                    : props?.TransactionDetail?.status?.toLowerCase() ===
                                                        "processing"
                                                        ? "label label-primary label-sm processing"
                                                        : props?.TransactionDetail?.status?.toLowerCase() === "success"
                                                            ? "label label-success label-sm success"
                                                            : props?.TransactionDetail?.status?.toLowerCase() === "failed"
                                                                ? "label label-danger label-sm failed"
                                                                : props?.TransactionDetail?.status?.toLowerCase() ===
                                                                    "cancelled"
                                                                    ? "label label-warning label-sm cancelled"
                                                                    : props.TransactionDetail?.status ===
                                                                    "pending"
                                                                  ? "label cancelled_trans label-sm failed"
                                                                  :  ""
                                        }
                                    >
                                        {props?.TransactionDetail?.status ? textCapitalize(props?.TransactionDetail?.status) : "-"}
                                    </a>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 p-0">
                                <div className="info_title">Failure Reason</div>
                                <div className="info_value">
                                {props?.TransactionDetail?.failure_reason ? props?.TransactionDetail?.failure_reason : "-"}
                                </div>
                            </div>
                           
                            <div className="col-xs-12 col-sm-6 p-0">
                                <div className="info_title">Created On</div>
                                <div className="info_value">
                                    {props?.TransactionDetail?.createdAt ? returnTimeZoneDate(props?.TransactionDetail?.createdAt) : "-"}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 p-0">
                                <div className="info_title">Reseller Name</div>
                                <div className="info_value">
                                {props?.TransactionDetail?.reseller?.name ? props?.TransactionDetail?.reseller?.name : ""} 
                                </div>
                            </div>
                        </div>
                      
                    </div>
                </div>
            </div>
        </>
    )

}


export default memo(TransactionDetail);
