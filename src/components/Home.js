import React, {
  useRef,
  useEffect,
  useMemo,
  memo,
  useCallback,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from ".././constants/ActionTypes";
import { useToasts } from "react-toast-notifications";
import ApiGateway from "../DataServices/DataServices";
import { imagePath } from "../assets/ImagePath";
import ApexChart from "./Chart";
// import TransactionDetail from "./TransactionDetail";

import TransactionDetail from "../components/TransactionDetailNew";
import {
  currencyFormatter,
  formatName,
  returnTimeZoneDate,
  textCapitalize,
} from "../DataServices/Utils";
import { DateRange, DateRangePicker } from "react-date-range";
import moment from "moment";
import useRouteExist from "../DataServices/useRouteExist";
import Loader from "./Loader";
import DonutChart from "./Chart/DonutCredit";
import DonutDebit from "./Chart/DonutDebit";
const Home = () => {
  const { home } = useSelector((state) => state);
  const [memoChartValueProps, setMemoChartValueProps] = useState({});
  const [donutChartValueProps, setDonutChartValueProps] = useState({});
  const [pageno, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [recordsLength, setrecordLength] = useState([]);
  const [selectionRange, setSelectionRange] = useState([{startDate: home.startDate, endDate: home.endDate, key: "selection"}]);
  const [isCalendar, setisCalendar] = useState(true);
  
  const [dateoption, setDateOption] = useState("today");
  const transactionDetailRoute = useRouteExist(["admin-transaction-detail"]);
  const dispatch = useDispatch();
  let currentdate = new Date();
  let last2months = new Date(currentdate.setMonth(currentdate.getMonth() - 2));

  const latestValue = useRef({});

  latestValue.current = home;
  const [state, setState] = useState({
    payinLastSeven: [],
    payoutLastSeven: [],
    getlastSevenDaysTransactionDetails: {},
    payin_success_trans_count:0,
    payin_failure_trans_count:0,
    payin_pending_trans_count:0,
    payin_success_trans_vol:0,
    payin_failure_trans_vol:0,
    payin_pending_trans_vol:0,
    payin_success_trans_comm:0,
    payin_failure_trans_comm:0,
    payin_pending_trans_comm:0,
    payout_success_trans_count:0,
    payout_failure_trans_count:0,
    payout_pending_trans_count:0,
    payout_success_trans_vol:0,
    payout_failure_trans_vol:0,
    payout_pending_trans_vol:0,
    payout_success_trans_comm:0,
    payout_failure_trans_comm:0,
    payout_pending_trans_comm:0,
    payin_success_percentage:0,
    payin_pending_percentage:0,
    payin_success_percentage:0,
    payout_success_percentage:0,
    payout_pending_percentage:0,
    payout_success_percentage:0,
    payin_payout_count:"today",
    transCountPercentage:{},
    auditLog:[],
    loading:false,
  });
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };

  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };

  useEffect(() => {
    if (state.getlastSevenDaysTransactionDetails) {
      setMemoChartValueProps(state.getlastSevenDaysTransactionDetails);
    }
  }, [state.getlastSevenDaysTransactionDetails]);
  useEffect(() => {
    dashboardDetails(pageno);
  }, [state.payin_payout_count,home.toDate,home.fromDate,]);


/*  useEffect(()=>{
  if(state.transCountPercentage){
    setDonutChartValueProps(state.transCountPercentage)
  }
  
},[state.transCountPercentage])  */





  const submitDateFilter =()=>{
    const home = latestValue.current;
    if (home.endDate > home.startDate) {
      dispatch(
        updateState(userConstants.HOME, {
          from: moment(home.startDate).format("DD/MM/YYYY"),
          to: moment(home.endDate).format("DD/MM/YYYY"),
          fromDate: moment(home.startDate).utc().add(1, "days").startOf("day").format(),
          toDate: moment(home.endDate).utc().add(1, "days").endOf("day").format(),
          open_picker: false,
        })
      );
    }else {
      dispatch(
        updateState(userConstants.HOME, {
          from: moment(home.startDate).format("DD/MM/YYYY"),
          to: moment(home.endDate).format("DD/MM/YYYY"),
          fromDate: moment(home.startDate)
          .utc().add(1, "days").startOf("day").format(),
          toDate: moment(home.endDate)
          .utc().add(1, "days").endOf("day").format(),
          open_picker: false,
        })
      );
    }
    setState((prevState) => ({
      ...prevState,
      payin_payout_count:""
    }));
  }

  const dateChange = (dates) => {
    setSelectionRange([dates.selection]);
    dispatch(
      updateState(userConstants.HOME, {
        startDate: dates.selection.startDate,
        endDate: dates.selection.endDate,
      })
    )
    setDateOption("")
  };


  const handleCalendar = () => {
    
    setisCalendar(false)
    if(!isCalendar){
      dispatch(
        updateState(userConstants.HOME, {
          open_picker: true,
        })
      )
    }else {
      dispatch(
        updateState(userConstants.HOME, {
          open_picker: true,
        })
      )
    }
  }


  const dashboardDetails = (page) => {
    setPageNo(page);
    setState((prevState) => ({
      ...prevState,
        loading:true
    }));
    var queryParam = "";
    queryParam += home.fromDate ? `&from_date=${home.fromDate}` : "";
    queryParam += home.toDate ? `&to_date=${home.toDate}` : "";
    queryParam += state.payin_payout_count ? `&selection=${state.payin_payout_count}` : "";
    ApiGateway.get(
      `/payout/admin/dashboard?page=${page}&limit=${limit}${queryParam}`,
      (response) => {
        if (response.success) {
          setState((prevState) => ({
            ...prevState,
            loading:false

          }));
          dispatch(
            updateState(userConstants.HOME, {
              transactionList:
                response?.data?.results?.account_statement?.transactions ? response?.data?.results?.account_statement?.transactions : [],
        
            })
          );
          setState((prevState) => ({
            ...prevState,
            getlastSevenDaysTransactionDetails:
              response?.data?.results?.getlastSevenDaysTransactionDetails ? response?.data?.results?.getlastSevenDaysTransactionDetails : {},
            payinLastSeven:
              response?.data?.results?.getlastSevenDaysTransactionDetails ? response?.data?.results?.getlastSevenDaysTransactionDetails : 0,
            payoutLastSeven:
              response?.data?.results?.getlastSevenDaysTransactionDetails ? response?.data?.results?.getlastSevenDaysTransactionDetails : 0,
              payout_success_trans_count:response?.data?.results?.collection_total?.result?.transaction_count?.DEBIT?.success,
              payout_pending_trans_count:response?.data?.results?.collection_total?.result?.transaction_count?.DEBIT?.pending,
              payout_failure_trans_count:response?.data?.results?.collection_total?.result?.transaction_count?.DEBIT?.failure,
              payout_success_trans_vol:response?.data?.results?.collection_total?.result?.transaction_total?.DEBIT?.success,
              payout_failure_trans_vol:response?.data?.results?.collection_total?.result?.transaction_total?.DEBIT?.failure,
              payout_pending_trans_vol:response?.data?.results?.collection_total?.result?.transaction_total?.DEBIT?.pending,
              payout_success_trans_comm:response?.data?.results?.collection_total?.result?.transaction_commission?.DEBIT?.success,
              payout_failure_trans_comm:response?.data?.results?.collection_total?.result?.transaction_commission?.DEBIT?.failure,
              payout_pending_trans_comm:response?.data?.results?.collection_total?.result?.transaction_commission?.DEBIT?.pending,
              payout_success_percentage:response?.data?.results?.collection_total?.result?.transaction_count?.DEBIT?.successPercentage,
              payout_pending_percentage:response?.data?.results?.collection_total?.result?.transaction_count?.DEBIT?.pendingPercentage,
              payout_failure_percentage:response?.data?.results?.collection_total?.result?.transaction_count?.DEBIT?.failurePercentage,
              
              payin_success_trans_count:response?.data?.results?.collection_total?.result?.transaction_count?.CREDIT?.success,
              payin_pending_trans_count:response?.data?.results?.collection_total?.result?.transaction_count?.CREDIT?.pending,
              payin_failure_trans_count:response?.data?.results?.collection_total?.result?.transaction_count?.CREDIT?.failure,
              payin_success_trans_vol:response?.data?.results?.collection_total?.result?.transaction_total?.CREDIT?.success,
              payin_failure_trans_vol:response?.data?.results?.collection_total?.result?.transaction_total?.CREDIT?.failure,
              payin_pending_trans_vol:response?.data?.results?.collection_total?.result?.transaction_total?.CREDIT?.pending,
              payin_success_trans_comm:response?.data?.results?.collection_total?.result?.transaction_commission?.CREDIT?.success,
              payin_failure_trans_comm:response?.data?.results?.collection_total?.result?.transaction_commission?.CREDIT?.failure,
              payin_pending_trans_comm:response?.data?.results?.collection_total?.result?.transaction_commission?.CREDIT?.pending,
              payin_success_percentage:response?.data?.results?.collection_total?.result?.transaction_count?.CREDIT?.successPercentage,
              payin_pending_percentage:response?.data?.results?.collection_total?.result?.transaction_count?.CREDIT?.pendingPercentage,
              payin_failure_percentage:response?.data?.results?.collection_total?.result?.transaction_count?.CREDIT?.failurePercentage,
        
              transCountPercentage:response?.data?.results?.collection_total?.result ? response?.data?.results?.collection_total?.result : response?.data?.results?.collection_total?.result == undefined ? {} : {},
          }));
          // setMemoChartValueProps(
          //   response?.data?.results?.getlastSevenDaysTransactionDetails
          // );
      
          setrecordLength(
            response?.data?.results?.account_statement?.transactions.length
          );
        }else{
          setState((prevState) => ({
            ...prevState,
            loading:false

          }));
        }
      }
    );
  };

  const onChange = (page) => {
    dispatch(
      updateState(userConstants.HOME, {
        page,
      })
    );
  };

  const handleReset =()=>{
    setState((prevState) => ({
      ...prevState,
      loading:false,
      payin_payout_count:"today",
      transactionList:[]
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
    if (home.from) {
      home.startDate = new Date();
      home.endDate = new Date();
      home.from = "";
      home.to = "";
      home.fromDate = "";
      home.toDate = "";
      
    }
    dispatch(
      updateState(userConstants.HOME, {
    
        open_picker: false,
      })
    )
    setisCalendar(true)

  }

  const handlePayinPayoutCount =(e,id)=>{
    setState((prevState) => ({
      ...prevState,
      payin_payout_count:id
    }));
    dispatch(
      updateState(userConstants.HOME, {
        fromDate: "",
        toDate: "",
        from:"",
        to:"",
        open_picker: false,
      })
    )
   
    if (selectionRange) {
      setSelectionRange([
        {
          startDate: null,
          endDate: new Date(""),
          key: "selection",
        },
      ]);
    }
    setisCalendar(true)
  
  }


  const closeModal = useCallback(() => {
    dispatch(
      updateState(userConstants.HOME, {
        isTransDetail: false,
        TransactionDetail: {},
      })
    );
  }, []);

  const memoizedValue = useMemo(() => {
    return {
      isTransDetail: home.isTransDetail,
      TransactionDetail: home.TransactionDetail,
      auditLog:state?.auditLog
    };
  }, [home.TransactionDetail, home.isTransDetail,state?.auditLog]);

  const viewDetail = (trans_id) => {
    setState((prev) => ({
      ...prev,
      loading:true
    }));
    auditLogDetail(trans_id);
    ApiGateway.get(
      `/payout/admin/transaction/detail?trans_id=${trans_id}`,
      function (response) {
        if (response.success) {
          setState((prev) => ({
            ...prev,
            loading:false
          }));
          dispatch(
            updateState(userConstants.HOME, {
              TransactionDetail: response?.data?.transaction,
              isTransDetail: true,
            })
          );
        }else{
          setState((prev) => ({
            ...prev,
            loading:false
          }));
          applyToast(response.message,"error")
        }
      }
    );
  };
const auditLogDetail = (id) => {
  
  
      ApiGateway.get(
        `/admin/transaction/payout-transaction/audit/${id}`,
        (response) => {
          if (response.success) {
            setState((prev) => ({
              ...prev,
              auditLog: response.data?.transaction_audit,
            }));
          } else {
            // applyToast(response.message, "error");
          }
        }
      );
  
    };


  return (
    <div className="content_wrapper dash_wrapper">
      {state.loading && <Loader/>}
      <div className="dash_merchent_welcome">
        <div className="merchent_wlcome_content">Dashboard</div>
      </div>
      <div className="fm_dash_tabs m-b-20">
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-5 p-r-0">
            <div className="dash_chart_wrap">
              <div>

              {memoChartValueProps?.data?.length > 0 && (
                  <ApexChart memoChartValueProps={memoChartValueProps} />
                )} 
              </div>
              <div className="col-xs-12 textCenter">
                  <div className="col-xs-12 col-md-6 m-b-0 ">
                    <div className="text-muted font-bold m-b-5 ">Pay In</div>
                    <div className="font-bold">
                      {state?.payinLastSeven?.payin_total ? currencyFormatter(
                        Math.round(state?.payinLastSeven?.payin_total * 100) /
                          100,
                        { code: "INR" }
                      ) : currencyFormatter(
                        Math.round(0 * 100) /
                          100,
                        { code: "INR" }
                      )}
                    </div>

                  </div>
                  <div className="col-xs-12 col-md-6 m-b-0">
                    <div className="text-muted font-bold m-b-5">Pay Out</div>
                    <div className="font-bold">
                      {state?.payoutLastSeven?.payout_total ? currencyFormatter(
                        Math.round(state?.payoutLastSeven?.payout_total * 100) /
                          100,
                        { code: "INR" }
                      ) : currencyFormatter(
                        Math.round(0 * 100) /
                          100,
                        { code: "INR" }
                      )}
                    </div>
                  </div>
                </div>
              </div>
          <div className="row">
          <div className="col-xs-12">
          <div className="dashboard-stats m-t-20">
                        <div className="stats-sub">Payout Pricing Percentage Commission</div>
                        <div className="row">
                       <div className="col-xs-12">
                       <div className="stats-sub m-t-10">Paid Commission</div>
                       <div className="col-xs-6">
                              <div><span className="dashboard-success-status">Success</span></div>
                           
                              </div>
                              <div className="col-xs-6">
                              <div>{state?.payout_success_trans_comm ? currencyFormatter(
                                      Math.round(state?.payout_success_trans_comm * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                            
                              </div>
                             </div>
                            
                       </div>
                       <div className="row m-t-10">
                       <div className="col-xs-12">
                       <div className="stats-sub m-t-10">UnPaid Commission</div>
                       <div className="col-xs-6">
                              <div><span className="dashboard-success-status">Success</span></div>
                           
                              </div>
                              <div className="col-xs-6">
                              <div>{state?.payout_success_trans_comm ? currencyFormatter(
                                      Math.round(state?.payout_success_trans_comm * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
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
            <div className="col-xs-12 col-sm-12 col-md-7 m-t-70 ">
              <div className="filter-search m-l-15">
                <button className={state?.payin_payout_count === "today" ? "active_orders" : "inactive_orders"} onClick={(e)=>handlePayinPayoutCount(e,"today")}>Today</button>
                {/* <button className={state.payin_payout_count === "yesterday" ? "active_orders m-l-5" : "inactive_orders m-l-5"} onClick={(e)=>handlePayinPayoutCount(e,"yesterday")}>Yesterday</button> */}
                <button className={state?.payin_payout_count === "week" ? "active_orders m-l-5" : "inactive_orders m-l-5"} onClick={(e)=>handlePayinPayoutCount(e,"week")}>This Week</button>
                <button className={state?.payin_payout_count === "month" ? "active_orders m-l-5" : "inactive_orders m-l-5"} onClick={(e)=>handlePayinPayoutCount(e,"month")}>This Month</button>
                <div className="datepicker_boxradius" >
                <div className="left-side-filter">
                  <input
                    className="fileter_dateform_input"
                    id="from_date"
                    name="date"
                    placeholder=""
                    type="text"
                    onClick={() =>
                      dispatch(
                        updateState(userConstants.HOME, {
                          open_picker: !home.open_picker,
                        })
                      )
                    }
                    value={
                      home.from !== ""
                        ? `${home.from} ~ ${home.to}`
                        : `Select Date`
                    }
                  />
                  <div
                    className={
                      home.open_picker
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
              <span className="submitDateBtn" onClick={submitDateFilter}>Submit</span> 
                  </div>
                </div>
              </div>
             
            
{/*                 {isCalendar === true ?
              <button className="inactive_orders m-l-5" onClick={handleCalendar}>Custom Date</button>
              :
              
              <div className="datepicker_boxradius" >
                <div className="left-side-filter">
                  <input
                    className="fileter_dateform_input"
                    id="from_date"
                    name="date"
                    placeholder=""
                    type="text"
                    onClick={() =>
                      dispatch(
                        updateState(userConstants.HOME, {
                          open_picker: !home.open_picker,
                        })
                      )
                    }
                    value={
                      home.from !== ""
                        ? `${home.from} ~ ${home.to}`
                        : `Select Date`
                    }
                  />
                  <div
                    className={
                      home.open_picker
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
              <span className="submitDateBtn" onClick={submitDateFilter}>Submit</span> 
                  </div>
                </div>
              </div>
            } */}
                <button className="reset_orders m-l-5" onClick={handleReset}>Reset</button>
              </div>
           <div className="col-xs-6 m-t-10">
            <div className="dash-stats-head textCenter">Collection</div>
                      <div className="dashboard-stats m-t-5">
                        <div className="stats-sub">Total Transaction Count</div>
                        <div className="row">
                             <div className="col-xs-6">
                              <div ><span className="dashboard-success-status">Success</span></div>
                              <div ><span className="dashboard-pending-status">Pending</span></div>
                              <div ><span className="dashboard-failure-status">Failure</span></div>
                              </div>
                              <div className="col-xs-6">
                              <div>{state?.payin_success_trans_count ? state?.payin_success_trans_count : 0}</div>
                              <div >{state?.payin_pending_trans_count ? state?.payin_pending_trans_count : 0}</div>
                              <div>{state?.payin_failure_trans_count ? state?.payin_failure_trans_count : 0}</div>
                              </div>
                             </div>
                        </div>

                        <div className="dashboard-stats m-t-20">
                        <div className="stats-sub">Total Transaction Volume</div>
                        <div className="row">
                        <div className="col-xs-6">
                              <div><span className="dashboard-success-status">Success</span></div>
                              <div><span className="dashboard-pending-status">Pending</span></div>
                              <div><span className="dashboard-failure-status">Failure</span></div>
                              </div>
                              <div className="col-xs-6">
                              <div>{state?.payin_success_trans_vol ? currencyFormatter(
                                      Math.round(state?.payin_success_trans_vol * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
                                        100,
                                      { code: "INR" }
                                    ) }</div>
                              <div>{state?.payin_pending_trans_vol ? currencyFormatter(
                                      Math.round(state?.payin_pending_trans_vol * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                              <div>{state?.payin_failure_trans_vol ? currencyFormatter(
                                      Math.round(state?.payin_failure_trans_vol * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                              </div>
                             </div>
                        </div>
                        <div className="dashboard-stats m-t-20">
                        <div className="stats-sub">Total Commission</div>
                        <div className="row">
                        <div className="col-xs-6">
                              <div><span className="dashboard-success-status">Success</span></div>
                              <div><span className="dashboard-pending-status">Pending</span></div>
                              <div><span className="dashboard-failure-status">Failure</span></div>
                              </div>
                              <div className="col-xs-6">
                              <div>{state?.payin_success_trans_comm ? currencyFormatter(
                                      Math.round(state?.payin_success_trans_comm * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                              <div>{state?.payin_pending_trans_comm ? currencyFormatter(
                                      Math.round(state?.payin_pending_trans_comm * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                              <div>{state?.payin_failure_trans_comm ? currencyFormatter(
                                      Math.round(state?.payin_failure_trans_comm * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                              </div>
                             </div>
                        </div>
                        <div className="dashboard-stats m-t-20">
                        <div className="stats-sub">Payin Count Percentage</div>
                        <div className="row">
                        <div className="col-xs-6">
                              <div><span className="dashboard-success-status">Success</span></div>
                              <div><span className="dashboard-pending-status">Pending</span></div>
                              <div><span className="dashboard-failure-status">Failure</span></div>
                              </div>
                              <div className="col-xs-6">
                              <div>{state?.payin_success_percentage ? <>{state.payin_success_percentage} %</> : <>0 %</>}</div>
                              <div>{state?.payout_pending_percentage ? <>{state?.payout_pending_percentage} %</> : <>0 %</>}</div>
                              <div>{state?.payout_failure_percentage ? <>{state?.payout_failure_percentage} %</> : <>0 %</>}</div>
                              </div>
                             </div>
                        </div>
           </div>
            <div className="col-xs-6 m-t-10">
            <div className="dash-stats-head textCenter">PayOut</div>
            <div className="dashboard-stats m-t-5">
                              <div className="stats-sub">Total Transaction Count</div>
                             <div className="row">
                             <div className="col-xs-6">
                              <div><span className="dashboard-success-status">Success</span></div>
                              <div><span className="dashboard-pending-status">Pending</span></div>
                              <div><span className="dashboard-failure-status">Failure</span></div>
                              </div>
                              <div className="col-xs-6">
                              <div>{state?.payout_success_trans_count ?  state?.payout_success_trans_count : 0}</div>
                              <div>{state?.payout_pending_trans_count ?  state?.payout_pending_trans_count : 0}</div>
                              <div>{state?.payout_failure_trans_count ?  state?.payout_failure_trans_count : 0}</div>
                              </div>
                             </div>
              </div>

                        <div className="dashboard-stats m-t-20">
                        <div className="stats-sub">Total Transaction Volume</div>
                        <div className="row">
                        <div className="col-xs-6">
                              <div><span className="dashboard-success-status">Success</span></div>
                              <div><span className="dashboard-pending-status">Pending</span></div>
                              <div><span className="dashboard-failure-status">Failure</span></div>
                              </div>
                              <div className="col-xs-6">
                              <div>{state?.payout_success_trans_vol ? currencyFormatter(
                                      Math.round(state?.payout_success_trans_vol * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                              <div>{state?.payout_pending_trans_vol ? currencyFormatter(
                                      Math.round(state?.payout_pending_trans_vol * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                              <div>{state?.payout_failure_trans_vol ? currencyFormatter(
                                      Math.round(state?.payout_failure_trans_vol * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                              </div>
                             </div>
                        </div>
                        <div className="dashboard-stats m-t-20">
                        <div className="stats-sub">Total Commission</div>
                        <div className="row">
                        <div className="col-xs-6">
                              <div><span className="dashboard-success-status">Success</span></div>
                              <div><span className="dashboard-pending-status">Pending</span></div>
                              <div><span className="dashboard-failure-status">Failure</span></div>
                              </div>
                              <div className="col-xs-6">
                              <div>{state?.payout_success_trans_comm ? currencyFormatter(
                                      Math.round(state?.payout_success_trans_comm * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                              <div>{state?.payout_pending_trans_comm ? currencyFormatter(
                                      Math.round(state?.payout_pending_trans_comm * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                              <div>{state?.payout_failure_trans_comm ? currencyFormatter(
                                      Math.round(state?.payout_failure_trans_comm * 100) /
                                        100,
                                      { code: "INR" }
                                    ) : currencyFormatter(
                                      Math.round(0 * 100) /
                                        100,
                                      { code: "INR" }
                                    )}</div>
                              </div>
                             </div>
                        </div>
                        <div className="dashboard-stats m-t-20">
                        <div className="stats-sub">Payout Count Percentage</div>
                        <div className="row">
                        <div className="col-xs-6">
                              <div><span className="dashboard-success-status">Success</span></div>
                              <div><span className="dashboard-pending-status">Pending</span></div>
                              <div><span className="dashboard-failure-status">Failure</span></div>
                              </div>
                              <div className="col-xs-6">

                              <div>{state?.payout_success_percentage ? <>{state?.payout_success_percentage} %</> : <>0 %</>}</div>
                              <div>{state?.payout_pending_percentage ? <>{state?.payout_pending_percentage} %</> : <>0 %</>}</div>
                              <div>{state?.payout_failure_percentage ? <>{state?.payout_failure_percentage} %</> : <>0 %</>}</div>
                              </div>
                             </div>
                        </div>
                       
                       
           </div>
 
          </div>
        </div>
        
      </div>

      
      

{/*  <div className="row p-0">
  <div className="col-xs-12 col-sm-12 col-md-6">

  <div className="timeline-box">
  <div className="home_recent_transactions m-b-30">Recent Account Statement</div>


  {home?.transactionList.length > 0 ? <>
    <div className="timeline">
    {home?.transactionList.slice(0, 5).map((transaction, index) => (
      <div key={index} className="timeline-item">
     
        <div
          className={`timeline-dot ${
            transaction.status === "success"
              ? "dot-success"
              : transaction.status === "failed"
              ? "dot-failure"
              : transaction.status === "pending"
              ? "dot-pending"
              : "dot-accepted"
          }`}
        ></div>


        <div
          className={`timeline-content ${
            transaction.status === "success"
              ? "box-success"
              : transaction.status === "failed"
              ? "box-failure"
              : transaction.status === "pending"
              ? "box-pending"
              : "box-accepted"
          }`}
        >
          <div className="timeline_date_view">
          <div className="timeline-time">
            {transaction?.createdAt ? returnTimeZoneDate(transaction?.createdAt) : "-"}
          </div>
          <div className="view_recent_trans pointer-cursor" onClick={() => viewDetail(transaction?.trans_id)}>View</div>
          </div>
          <div className="timeline-title">
            {transaction?.product_type === "acc_veri" ? "Account Verification" : transaction?.product_type ?
               formatName(transaction?.product_type)
              : "-"}
          </div>
          <div className="timeline-description remarks_tooltip">
            Transaction ID:
            <strong onClick={() => viewDetail(transaction?.trans_id)} className="pointer-cursor">{transaction?.trans_id ? transaction?.trans_id : "-"}</strong>
            <span className="remarks_tooltip_popup"><span className="tootip_head">Payout Purpose: </span><span className="toottip_content">{transaction?.remarks ? transaction?.remarks : "-"}</span></span>

          </div>
          <div className="timeline-amount">
            { transaction?.transaction_amount ? currencyFormatter(
              Math.round(
                (transaction?.transaction_amount) * 100
              ) / 100,
              { code: "INR" }
            )  : currencyFormatter(
              Math.round(
                (0) * 100
              ) / 100,
              { code: "INR" }
            )}
          </div>
        </div>
      </div>
    )) }
  </div></> : <div className="no_data">
  <div>No Records Found</div></div>}
   
  </div>
  </div>
  <div className="row col-xs-12 col-sm-12 col-md-6 m-nl-108 textCenter">
   <div className="col-xs-12 col-sm-12 donut-chart-bg textCenter">
   <div className="m-t-20 textCenter">
      {Object.keys(donutChartValueProps).length ? <DonutChart percentage={donutChartValueProps}/> : <div className="no_record">
   
        No Records Found For Credit Count Percentage</div>}
   
    </div>
    <div className="m-t-20 textCenter">
      {Object.keys(donutChartValueProps).length ? <DonutDebit percentage={donutChartValueProps}/> : <div className="no_record">No Records Found For Debit Count Percentage</div>}
   
    </div>
   </div>

  </div>
</div>  */}



<div className="dash_table">
        <div className="page_title p-0 m-b-20">Recent Account Statement</div>
 <div className="col-xs-12 p-0">
          <div className="int_transfer"><span className="transfer_highlight"></span>&nbsp;- Denotes Internal Transfer</div>
            <div className="table-responsive">
              <table className="table  table_customization">
                <thead>
                  <tr>
                    <th>S.No</th>
                    {transactionDetailRoute && <th>Id</th>}
                    <th>Transaction Time</th>
                    <th>Source</th>
                    <th>Amount</th>
                    <th>Payment Mode</th>
                    <th>Status</th>
                  
                    {transactionDetailRoute && (
                      <th className="">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {home?.transactionList.length > 0 ? (home?.transactionList.map((list, i) => {
                    return (
                      <tr key={i} className={list?.remarks === "internaltransfer" ? "internaltransfer_background" :""}>
                        <td>{(pageno - 1) * limit + (i + 1)}</td>
                        {transactionDetailRoute && (
                          <td>
                            <a onClick={() => viewDetail(list?.trans_id)} className="remarks_tooltip">
                              {list.trans_id ? list?.trans_id : "-"}
                              <span className="remarks_tooltip_popup"><span className="tootip_head">Payout Purpose: </span><span className="toottip_content">{list?.remarks ? list?.remarks : "-"}</span></span>
                            </a>
                          </td>
                        )}

                        <td>
                          {returnTimeZoneDate(
                            list?.createdAt ? list?.createdAt : "-"
                          )}
                        </td>
                        <td>
                          {list?.product_type ?  formatName(list?.product_type) : ""}
                        </td>
                        <td>
                          {list?.transaction_amount ? currencyFormatter(
                            Math.round(list?.transaction_amount * 100) / 100,
                            { code: "INR" }
                          ) : currencyFormatter(
                            Math.round(0 * 100) / 100,
                            { code: "INR" }
                          )}
                        </td>
                        <td>{list?.pay_mode ? list?.pay_mode : "-"}</td>
                        <td>
                          <a
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
                            {list?.status ? textCapitalize(list?.status) : ""}
                          </a>
                        </td>
                  
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
                      </tr>
                    );
                  })) : ( <tr>
                    <td className="text-center" colSpan="11">
                      No Records Found
                    </td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          
          </div>
</div> 

      <TransactionDetail {...memoizedValue} closeModal={closeModal} />
    </div>
  );
};

export default memo(Home);
