import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import { manipulateString, returnTimeZoneDate, textCapitalize } from "../../DataServices/Utils";
import ApiGateway from "../../DataServices/DataServices";
import { ToastProvider, useToasts } from "react-toast-notifications";
import {formatDate,currencyFormatter} from "../../DataServices/Utils";
import Modal from "react-modal";
import Loader from "../Loader";
import Pagination from "../Pagination";
import { AsyncPaginate } from "react-select-async-paginate";
import ReactSelect from "react-select";
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import Download from "../../assets/images/download.png";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
const InvoiceList = () => {
  const { invoice } = useSelector((state) => state);
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
  latestValue.current = invoice;


const [state,setState]=useState({loading:false})
const [pageno, setPageNo] = useState(1);
const [limit, setLimit] = useState(10);
const [recordsLength, setrecordLength] = useState([]);
const Status_Filter = [
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "UnPaid" },
    { value: "partially_paid", label: "Partially Paid" }
];

const [selectionRange, setSelectionRange] = useState([
  {
    startDate: invoice.startDate,
    endDate: invoice.endDate,
    key: "selection",
  },
]);
  useEffect(() => {
    InvoiceList(pageno);
  }, [invoice.merchant_id,invoice.selection,invoice.toDate,invoice.fromDate]);

  useEffect(()=>{
    resetFilter()
  },[])


  const dateChange = (dates) => {
    setSelectionRange([dates.selection]);
    dispatch(
      updateState(userConstants.INVOICE, {
        startDate: dates.selection.startDate,
        endDate: dates.selection.endDate,
      })
    );
  };
 
  const submitDateFilter = () => {

    dispatch(updateState(userConstants.INVOICE, { selection :"" }));
    const invoice = latestValue.current;
    if (invoice.endDate > invoice.startDate) {
      dispatch(
        updateState(userConstants.INVOICE, {
          from: moment(invoice.startDate).format("DD/MM/YYYY"),
          to: moment(invoice.endDate).format("DD/MM/YYYY"),
          fromDate: moment(invoice.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(invoice.endDate)
            .utc()
            .add(1, "days")
            .endOf("day")
            .format(),
          open_picker: false,
        })
      );
    } else {
      dispatch(
        updateState(userConstants.INVOICE, {
          from: moment(invoice.startDate).format("DD/MM/YYYY"),
          to: moment(invoice.startDate).format("DD/MM/YYYY"),
          fromDate: moment(invoice.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(invoice.startDate)
            .utc()
            .add(1, "days")
            .endOf("day")
            .format(),
          open_picker: false,
        })
      );
    }
  };



   const InvoiceList = (page) => {
    setPageNo(page);
    setState((prevState) => ({
        ...prevState,
          loading:true
      }));
      let queryParam = "";
      queryParam += !invoice.merchant_id
      ? ""
      : `&merchant.id=${invoice.merchant_id}`;
      queryParam += !invoice.selection
      ? ""
      : `&selection=${invoice.selection}`;
      queryParam += invoice.fromDate ? `&from_date=${invoice.fromDate}` : "";
      queryParam += invoice.toDate ? `&to_date=${invoice.toDate}` : "";
      dispatch(updateState(userConstants.INVOICE, { invoice_list: invoice.invoice_list }));
   /*  ApiGateway.get(`/payout/admin/transaction/dayreport/list?page=${page}&limit=${limit}${queryParam}`, (response) => {
      if (response.success) {
        setState((prevState) => ({
            ...prevState,
              loading:false
          }));
        dispatch(updateState(userConstants.INVOICE, { invoice_list: response.data.consolidatedReports }));
        setrecordLength(response.data.consolidatedinvoice.length);
      }else{
        setState((prevState) => ({
            ...prevState,
              loading:false
          }));
          applyToast(response.message,"error")
      }
    }); */
  };

  const getAllMerchant = async (searchQuery, loadedOptions, { page }) => {
    return new Promise((resolve, reject) => {
                let queryParam = "";
                queryParam += !searchQuery ? ""  : `&search_term=${searchQuery}`;
                ApiGateway.get(`/payout/admin/merchant/list?page=${page}&limit=10${queryParam}`, function (response) {
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
        });
    });
}; 
const selectMerchantFilter = (filter,e) =>{
    let str = manipulateString(filter);
    dispatch(
      updateState(userConstants.INVOICE, {
        [filter]: e.merchantId,
        [str]: e,
        // searchTerm:
        //   "filter" === "search_type" ? "" : invoice.searchTerm,
      })
    );
  }
  const selectDuration = (filter,e) =>{

    let str = manipulateString(filter);
    dispatch(
      updateState(userConstants.INVOICE, {
        [filter]: e.value,
        [str]: e,
      })
    );
  }
const viewModal=(id)=>{
    ApiGateway.get(`/payout/admin/transaction/dayreport/detail?report_id=${id}`, (response) => {
        if (response.success) {
          dispatch(updateState(userConstants.INVOICE, { reportDetail: response.data,openModal: !invoice.openModal  }));
        }else{
            applyToast(response.message,"error")
    
        }
      });
}
const closeReportModal =()=>{
    dispatch(updateState(userConstants.INVOICE, { openModal: !invoice.openModal }));

}
const resetFilter =()=>{
    let report_copy = invoice;
    if (report_copy.MerchantId) {
        delete report_copy.merchant_id
        delete report_copy.MerchantId;
    }
    if (report_copy.selection) {
        delete report_copy.selection
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
        updateState(userConstants.INVOICE, {
          ...report_copy,
        })
      );
}



const DownloadInvoice = () =>{
// console.log("DownloadInvoice")
}
  return (
    <>
      <div className="content_wrapper dash_wrapper">
        {/* {state.loading && <Loader/>} */}
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">Invoice Report List</div>
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
                                        onChange={(e) => selectMerchantFilter("merchant_id",e)}   
                                        isSearchable={true}
                                        placeholder="Select Business"
                                        additional={{
                                            page: 1,
                                        }}
                                        classNamePrefix={"react-select"}
                                        value={
                                            invoice.MerchantId !== undefined &&
                                            invoice.MerchantId
                                          }
                                    />
                         </>
            </div>
            <div className="col-xs-3 p-r-0">
                            <div className="trans-text m-b-5 color-grey font-semibold">Select By Status</div>
                            <ReactSelect
                                className="selectpicker"
                                options={Status_Filter}
                                onChange={(e) => selectDuration("selection", e)}
                                value={
                                    invoice.Selection !== undefined &&
                                    invoice.Selection
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
                          dispatch(updateState(userConstants.INVOICE, { open_picker: !invoice.open_picker,}))
                          
                        }
                        value={
                          invoice.from !== ""
                            ? `${invoice.from} ~ ${invoice.to}`
                            : ""
                        }
                      />
                      <div
                        className={
                          invoice.open_picker
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
                        <div className="col-xs-3">
                        <label className="col-xs-3 col-md-2 p-0 m-t-25">
                    <a
                      className="btn btn-default  border-plain "
                      onClick={resetFilter}
                    >
                      Reset
                    </a>
                   
                  </label>
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
                        <th>Merchant ID</th>
                        <th>Merchant's Business Name</th>                  
                        <th>Invoice ID</th>
                       
                        <th>Invoice Period</th>
                        <th>Current Invoice Status</th>
                        <th>Fixed Commission</th>
                        <th>Percentage Commission</th>
                        <th>Invoice Type</th>
                        <th>Invoiced Date</th>
                        <th>Due Date</th>
                       
                        <th style={{textAlign:"center"}}>Download Invoice</th>
                        <th>View Invoice</th> 
                      </tr>
                    </thead>
                    <tbody>
                      {invoice?.invoice_list?.map((lists, i) => {
                        return (
                          <tr key={i}>
                            <td>{(pageno - 1) * limit + (i + 1)}</td>
                            <td>{lists?.merchant?.name ? lists?.merchant?.name : "-"}</td>
                            <td>{lists?.merchant?.id ? lists?.merchant?.id : "-"}</td>
                            <td>{lists?.invoice_id ? lists?.invoice_id : "-"}</td>
                            <td>{lists?.slot ? lists?.slot : "-"}</td>
                            <td ><a className={
                                  lists.status
                                    ? "label_success" : "label_warning"
                                }>{lists?.status ? lists?.status : "-"}</a></td>
                            <td><a className={
                                  lists.status
                                    ? "label_success" : "label_warning"
                                }>{lists?.status ? lists?.status : "-"}</a> </td>
                            <td><a className={
                                  lists.status
                                    ? "label_success" : "label_warning"
                                }>Paid</a></td>
                                    <td>Partially Paid</td>
                            <td>20-11-2024</td>
                            <td>02-12-2024</td>
                  
                            <td style={{textAlign:"center"}}><img src={Download} alt="download" style={{height:"25px"}} onClick={()=>DownloadInvoice()}/></td>
                            <td><Link to="/view-invoice"><span className="label_edit pointer-cursor">View</span></Link></td>
                          </tr>
                        );
                      })}
          
                      {/* <td><span className="label_edit pointer-cursor" onClick={viewModal}>View</span></td> */}
                    </tbody>
                  </table>
                </div>
                <div className="table-bottom-content">
                    <Pagination
                      handle={InvoiceList}
                      list={recordsLength}
                      currentpage={pageno}
                    />
                  </div>
              </div>
            </div>
          </div>
        </div>
{/*  <Modal
        className="report_modal"
        isOpen={invoice.openModal}
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
                Detailed Report - {invoice.reportDetail?.merchant?.name}
                </h4>
   
                        </div>
                        <div className="modal-body clearfix ">
                        <div className=" clearfix">
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-xs-6">
                                    <div className="report_head">Credit Fixed Commission</div>
                                    <div className="col-xs-3 m-t-10">
                                        <div className="report_lable">Value</div>
                                        <div className="report_lable">Tax</div>
                                        <div className="report_lable">Total</div>
                                    </div>
                                    <div className="col-xs-3 m-t-10">
                                    <div>{currencyFormatter(
                                      Math.round(invoice.reportDetail.creditFixedCommission?.value * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                                        <div>{currencyFormatter(
                                      Math.round(invoice.reportDetail.creditFixedCommission?.tax * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                                        <div>{currencyFormatter(
                                      Math.round(invoice.reportDetail.creditFixedCommission?.total * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                                    </div>
                                </div>
                                <div className="col-xs-6">
                                    <div className="report_head">Credit Percentage Commission</div>
                                    <div className="col-xs-3 m-t-10">
                                        <div className="report_lable">Value</div>
                                        <div className="report_lable">Tax</div>
                                        <div className="report_lable">Total</div>
                                    </div>
                                    <div className="col-xs-3 m-t-10">
                                    <div>{currencyFormatter(
                                      Math.round(invoice.reportDetail.creditPercentageCommission?.value * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                                        <div>{currencyFormatter(
                                      Math.round(invoice.reportDetail.creditPercentageCommission?.tax * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                                        <div>{currencyFormatter(
                                      Math.round(invoice.reportDetail.creditPercentageCommission?.value * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="row m-t-20">
                                <div className="col-xs-6">
                                    <div className="report_head">Debit Fixed Commission</div>
                                    <div className="col-xs-3 m-t-10">
                                        <div className="report_lable">Value</div>
                                        <div className="report_lable">Tax</div>
                                        <div className="report_lable">Total</div>
                                    </div>
                                    <div className="col-xs-3 m-t-10">
                                    <div>{currencyFormatter(
                                      Math.round(invoice?.reportDetail?.debitFixedCommission?.value * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                                        <div>{currencyFormatter(
                                      Math.round(invoice?.reportDetail?.debitFixedCommission?.tax * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                                        <div>{currencyFormatter(
                                      Math.round(invoice?.reportDetail?.debitFixedCommission?.total * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                                    </div>
                                </div>
                                <div className="col-xs-6">
                                    <div className="report_head">Debit Percentage Commission</div>
                                    <div className="col-xs-3 m-t-10">
                                        <div className="report_lable">Value</div>
                                        <div className="report_lable">Tax</div>
                                        <div className="report_lable">Total</div>
                                    </div>
                                    <div className="col-xs-3 m-t-10">
                                    <div>{currencyFormatter(
                                      Math.round(invoice?.reportDetail?.debitPercentageCommission?.value * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                                        <div>{currencyFormatter(
                                      Math.round(invoice?.reportDetail?.debitPercentageCommission?.tax * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                                        <div>{currencyFormatter(
                                      Math.round(invoice?.reportDetail?.debitPercentageCommission?.total * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            </div>
                            </div>
                       
                     
                        
                      





                    </div>
                </div>
        </div>
      </Modal>  */}
      </div>
      
    </>
  );
};

export default InvoiceList;
