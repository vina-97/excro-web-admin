import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import { ToastProvider, useToasts } from "react-toast-notifications";
import ApiGateway from "../../DataServices/DataServices";
import Switch from "react-switch";
import Loader from "../Loader";
import './MerchantCss/velocityCheck.css';
import {
  Link,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { capitalizeWords, removeUnderScore } from "../../DataServices/Utils";
var _ = require("lodash");

const VelocityCheck = (props) => {
  const [status, setStatus] = useState("inactive");
  const { merchant_pricing } = useSelector((state) => state);
  const [isExpanded, setIsExpanded] = useState(false);
   const [state, setState] = useState({ loading: false });

  const { id } = useParams();
  const [details, setDetails] = useState(false);
  const history =useHistory();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const dispatch = useDispatch();

  const latestValue = useRef({});

  latestValue.current = merchant_pricing;
  const [loading, setLoading] = useState(true);
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };

  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };
  const stateChanges = (payload) => {
    return { type: userConstants.MERCHANT_PRICING, payload };
  };
  useEffect(() => {
    getSettingDetails();
    velocityDetails();
  }, []);

  const getSettingDetails = () => {
    setLoading(true);
    ApiGateway.get(
      `/payout/admin/default-setting?merchant_id=${props.match.params.merchant_id}`,
      function (response) {
        if (response.success) {
          dispatch(
            updateState(userConstants.MERCHANT_PRICING, {
              vpa_creation_type:
                response.data.settings?.commission?.creations?.VPA
                  ?.pricing_type == "fixed"
                  ? true
                  : false,
              vpa_collection_type:
                response.data.settings?.commission?.collections?.VPA
                  ?.pricing_type == "fixed"
                  ? true
                  : false,
              van_creation_type:
                response.data.settings?.commission?.creations?.VAN
                  ?.pricing_type == "fixed"
                  ? true
                  : false,
              van_collection_type:
                response.data.settings?.commission?.collections?.VAN
                  ?.pricing_type == "fixed"
                  ? true
                  : false,
              settings_neft: response.data.settings?.commission?.NEFT?.value,
              settings_imps: response.data.settings?.commission?.IMPS?.value,
              settings_rtgs: response.data.settings?.commission?.RTGS?.value,
              settings_upi: response.data.settings?.commission?.UPI?.value,
              settings_great1_neft:
                response.data.settings?.commission?.great1?.NEFT?.value,
              settings_great1_imps:
                response.data.settings?.commission.great1?.IMPS?.value,
              // settings_great1_rtgs: response.data.settings?.commission.great1?.RTGS?.value,
              settings_great1_upi:
                response.data.settings?.commission?.great1?.UPI?.value,
              settings_great10_neft:
                response.data.settings?.commission?.great10?.NEFT?.value,
              settings_great10_imps:
                response.data.settings?.commission?.great10?.IMPS?.value,
              // settings_great10_rtgs: response.data.settings?.commission?.great10?.RTGS?.value,
              settings_great10_upi:
                response.data.settings?.commission?.great10?.UPI?.value,
              settings_great25_neft:
                response.data.settings?.commission?.great25?.NEFT?.value,
              settings_great25_imps:
                response.data.settings?.commission?.great25?.IMPS?.value,
              // settings_great25_rtgs: response.data.settings?.commission?.great25?.RTGS?.value,
              settings_great25_upi:
                response.data.settings?.commission?.great25?.UPI?.value,
              percent_neft:
                response.data.settings?.commission?.NEFT?.percentage,
              percent_imps:
                response.data.settings?.commission?.IMPS?.percentage,
              percent_rtgs:
                response.data.settings?.commission?.RTGS?.percentage,
              percent_upi: response.data.settings?.commission?.UPI?.percentage,
              percent_great1_neft:
                response.data.settings?.commission?.great1?.NEFT?.percentage,
              percent_great1_imps:
                response.data.settings?.commission.great1?.IMPS?.percentage,
              // percent_great1_rtgs: response.data.settings?.commission.great1?.RTGS?.percentage,
              percent_great1_upi:
                response.data.settings?.commission?.great1?.UPI?.percentage,
              percent_great10_neft:
                response.data.settings?.commission?.great10?.NEFT?.percentage,
              percent_great10_imps:
                response.data.settings?.commission?.great10?.IMPS?.percentage,
              // percent_great10_rtgs: response.data.settings?.commission?.great10?.RTGS?.percentage,
              percent_great10_upi:
                response.data.settings?.commission?.great10?.UPI?.percentage,
              percent_great25_neft:
                response.data.settings?.commission?.great25?.NEFT?.percentage,
              percent_great25_imps:
                response.data.settings?.commission?.great25?.IMPS?.percentage,
              // percent_great25_rtgs: response.data.settings?.commission?.great25?.RTGS?.percentage,
              percent_great25_upi:
                response.data.settings?.commission?.great25?.UPI?.percentage,
              van_collection:
                response.data.settings.commission?.collections?.VAN?.value,
              vpa_collection:
                response.data.settings.commission?.collections?.VPA?.value,
              van_creation:
                response.data.settings.commission?.creations?.VAN?.value,
              vpa_creation:
                response.data.settings.commission?.creations?.VPA?.value,
              van_verification:
                response.data.settings.commission?.verifications?.account,
              vpa_verification:
                response.data.settings.commission?.verifications?.vpa,
              daily_trans_count:
                response.data.settings?.settings?.daily_trans_count,
              daily_trans_volume:
                response.data.settings?.settings?.daily_trans_volume,
              per_trans_volume:
                response.data.settings?.settings?.per_trans_volume,
              max_beneficiary:
                response.data.settings?.settings?.max_beneficiary,

              low_balance_range:
                response.data.settings?.settings?.low_balance_range || 1000,
              reRender: true,
            })
          );
          setLoading(false);
        } else {
          dispatch(
            updateState(userConstants.MERCHANT_PRICING, {
              vpa_creation_type: false,
              vpa_collection_type: false,
              van_creation_type: false,
              van_collection_type: false,
              settings_neft: 0,
              settings_imps: 0,
              settings_rtgs: 0,
              settings_upi: 0,
              settings_great1_neft: 0,
              settings_great1_imps: 0,
              // settings_great1_rtgs: 0,
              settings_great1_upi: 0,
              settings_great10_neft: 0,
              settings_great10_imps: 0,
              // settings_great10_rtgs: 0,
              settings_great10_upi: 0,
              settings_great25_neft: 0,
              settings_great25_imps: 0,
              // settings_great25_rtgs: 0,
              settings_great25_upi: 0,
              percent_neft: 0,
              percent_imps: 0,
              percent_rtgs: 0,
              percent_upi: 0,
              percent_great1_neft: 0,
              percent_great1_imps: 0,
              // percent_great1_rtgs:0,
              percent_great1_upi: 0,
              percent_great10_neft: 0,
              percent_great10_imps: 0,
              // percent_great10_rtgs:0,
              percent_great10_upi: 0,
              percent_great25_neft: 0,
              percent_great25_imps: 0,
              // percent_great25_rtgs:0,
              percent_great25_upi: 0,
              van_collection: 0,
              vpa_collection: 0,
              van_creation: 0,
              vpa_creation: 0,
              van_verification: 0,
              vpa_verification: 0,
              daily_trans_count: 0,
              daily_trans_volume: 0,
              per_trans_volume: 0,
              max_beneficiary: 0,
              low_balance_range: 1000,
              reRender: true,
            })
          );
          setLoading(false);
        }
      }
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(stateChanges({ [name]: value }));
  };

  const updateSetting = () => {
    var data = {
      merchant: {
        id: props.match.params.merchant_id,
        acc_type: "stack",
      },
      commission: {
        NEFT: {
          value: parseFloat(merchant_pricing.settings_neft),
          percentage: parseFloat(merchant_pricing.percent_neft),
        },
        IMPS: {
          value: parseFloat(merchant_pricing.settings_imps),
          percentage: parseFloat(merchant_pricing.percent_imps),
        },
        RTGS: {
          value: parseFloat(merchant_pricing.settings_rtgs),
          percentage: parseFloat(merchant_pricing.percent_rtgs),
        },
        UPI: {
          value: parseFloat(merchant_pricing.settings_upi),
          percentage: parseFloat(merchant_pricing.percent_upi),
        },
        great1: {
          NEFT: {
            value: parseFloat(merchant_pricing.settings_great1_neft),
            percentage: parseFloat(merchant_pricing.percent_great1_neft),
          },
          IMPS: {
            value: parseFloat(merchant_pricing.settings_great1_imps),
            percentage: parseFloat(merchant_pricing.percent_great1_imps),
          },
          UPI: {
            value: parseFloat(merchant_pricing.settings_great1_upi),
            percentage: parseFloat(merchant_pricing.percent_great1_upi),
          },
        },
        great10: {
          NEFT: {
            value: parseFloat(merchant_pricing.settings_great10_neft),
            percentage: parseFloat(merchant_pricing.percent_great10_neft),
          },
          IMPS: {
            value: parseFloat(merchant_pricing.settings_great10_imps),
            percentage: parseFloat(merchant_pricing.percent_great10_imps),
          },
          UPI: {
            value: parseFloat(merchant_pricing.settings_great10_upi),
            percentage: parseFloat(merchant_pricing.percent_great10_upi),
          },
        },
        great25: {
          NEFT: {
            value: parseFloat(merchant_pricing.settings_great25_neft),
            percentage: parseFloat(merchant_pricing.percent_great25_neft),
          },
          IMPS: {
            value: parseFloat(merchant_pricing.settings_great25_imps),
            percentage: parseFloat(merchant_pricing.percent_great25_imps),
          },
          UPI: {
            value: parseFloat(merchant_pricing.settings_great25_upi),
            percentage: parseFloat(merchant_pricing.percent_great25_upi),
          },

          RTGS: {
            value: parseFloat(merchant_pricing.settings_rtgs),
            percentage: parseFloat(merchant_pricing.percent_rtgs),
          },
        },
        collections: {
          VAN: {
            pricing_type: merchant_pricing.van_collection_type
              ? "fixed"
              : "percentage",
            value: parseFloat(merchant_pricing.van_collection),
          },
          VPA: {
            pricing_type: merchant_pricing.vpa_collection_type
              ? "fixed"
              : "percentage",
            value: parseFloat(merchant_pricing.vpa_collection),
          },
        },
        creations: {
          VAN: {
            pricing_type: merchant_pricing.van_creation_type
              ? "fixed"
              : "percentage",
            value: parseFloat(merchant_pricing.van_creation),
          },
          VPA: {
            pricing_type: merchant_pricing.vpa_creation_type
              ? "fixed"
              : "percentage",
            value: parseFloat(merchant_pricing.vpa_creation),
          },
        },
        verifications: {
          account: parseFloat(merchant_pricing.van_verification),
          vpa: parseFloat(merchant_pricing.vpa_verification),
        },
      },
      settings: {
        daily_trans_count: parseFloat(merchant_pricing.daily_trans_count),
        daily_trans_volume: parseFloat(merchant_pricing.daily_trans_volume),
        per_trans_volume: parseFloat(merchant_pricing.per_trans_volume),
        max_beneficiary: parseFloat(merchant_pricing.max_beneficiary),
        low_balance_range: parseFloat(merchant_pricing.low_balance_range),
      },
      is_partial_deduction: merchant_pricing?.partial_invoice,
    };

    setLoading(true);
    ApiGateway.post(
      `/payout/admin/merchant/update/pricing-settings`,
      data,
      function (response) {
        if (response.success) {
          setLoading(false);
          applyToast(response.message, "success");
        } else {
          setLoading(false);
          applyToast(response.message, "error");
        }
      }
    );
  };

  const location = useLocation();

  const { merchantId, merchantName } = location.state || {};
 

  const [postData, setPostData] = useState({
    transaction: [
      {
        duration: 3600000,
        name: "1hour",
        transaction_count: 0,
        transaction_amount: 0,
        is_count_enabled: false,
        is_volume_enabled: false,
        is_enabled: false,
      },
      {
        duration: 21600000,
        name: "6hour",
        transaction_count: 0,
        transaction_amount: 0,
        is_count_enabled: false,
        is_volume_enabled: false,
        is_enabled: false,
      },
      {
        duration: 43200000,
        name: "12hour",
        transaction_count: 0,
        transaction_amount: 0,
        is_count_enabled: false,
        is_volume_enabled: false,
        is_enabled: false,
      },
      {
        duration: 86400000,
        name: "24hour",
        transaction_count: 0,
        transaction_amount: 0,
        is_count_enabled: false,
        is_volume_enabled: false,
        is_enabled: false,
      },
    ],
    payment_mode: {
      imps: [
        {
          duration: 3600000,
          name: "1hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
        {
          duration: 21600000,
          name: "6hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
        {
          duration: 43200000,
          name: "12hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
        {
          duration: 86400000,
          name: "24hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
      ],
      rtgs: [
        {
          duration: 3600000,
          name: "1hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
        {
          duration: 21600000,
          name: "6hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
        {
          duration: 43200000,
          name: "12hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
        {
          duration: 86400000,
          name: "24hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
      ],
      neft: [
        {
          duration: 3600000,
          name: "1hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
        {
          duration: 21600000,
          name: "6hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
        {
          duration: 43200000,
          name: "12hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
        {
          duration: 86400000,
          name: "24hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
      ],
      upi: [
        {
          duration: 3600000,
          name: "1hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
        {
          duration: 21600000,
          name: "6hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
        {
          duration: 43200000,
          name: "12hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
        {
          duration: 86400000,
          name: "24hour",
          transaction_count: 0,
          transaction_amount: 0,
          is_count_enabled: false,
          is_volume_enabled: false,
          is_enabled: false,
        },
      ],
    },
  });



  // const handleSwitch = async (checked) => {
  //    const checked = e.target.checked;
  //   const newStatus = checked ? "active" : "inactive";
  //   setStatus(newStatus);
  //   await handleSubmitAll(newStatus);
  // };

  const handleSwitch = async (e) => {
    const checked = e.target.checked;
    const newStatus = checked ? "active" : "inactive";
    setStatus(newStatus);
    //await handleSubmitAll(newStatus);
  };

  const handleInputChange = (primaryIndex, selectedName, value) => {
    const updatedItems = [...postData.transaction];

    updatedItems[primaryIndex] = {
      ...updatedItems[primaryIndex],
      [selectedName]: value,
    };
    setPostData((prevState) => ({ ...prevState, transaction: updatedItems }));
  };

  const handlePaymentCheckbox = (primaryIndex, selectedName, e, mode) => {
    const { checked } = e.target;
    const updatedItems = [...postData.payment_mode[mode]];

    updatedItems[primaryIndex] = {
      ...updatedItems[primaryIndex],
      [selectedName]: checked,
    };

    setPostData((prevState) => ({
      ...prevState,
      payment_mode: {
        ...prevState.payment_mode,
        [mode]: updatedItems,
      },
    }));
  };

  const handleCheckboxChange = (primaryIndex, selectedName, e) => {
    const { checked } = e.target;
    const updatedItems = [...postData.transaction];

    updatedItems[primaryIndex] = {
      ...updatedItems[primaryIndex],
      [selectedName]: checked,
    };
    setPostData((prevState) => ({ ...prevState, transaction: updatedItems }));
  };

  const velocityDetails = () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    setLoading(true);
    ApiGateway.get(
      `/payout/admin/merchant-velocity/details/${id}`,
      function (response) {
        if (response.success) {
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
          //const status = response?.data?.status;
          const status = response?.data?.status ?? "inactive";
          setStatus(status);
          const res = response?.data?.velocity;
          setLoading(false);

          if (res && Object.keys(res).length > 0) {
            setPostData(res);
            setDetails(true);
          }
        } else {
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
          setLoading(false);
          applyToast(response.message, "error");
        }
      }
    );
  };

  // const handleSubmitAll = async (overrideStatus = status) => {
  //   setLoading(true);
  //   const payload = {
  //     status: overrideStatus,
  //     merchant: {
  //       id: merchantId,
  //       name: merchantName,
  //     },
  //     velocity: postData,
  //   };

  //   const url = details
  //     ? `/payout/admin/merchant-velocity/update/${id}`
  //     : `/payout/admin/merchant-velocity/create`;

  //   if (details) {
  //     ApiGateway.patch(url);
  //     if (response.success) {
  //       setLoading(false);
  //     }
  //   } else {
  //     ApiGateway.post(url);
  //     if (response.success) {
  //       setLoading(false);
  //     }
  //   }
  // };

  // const handleSubmitAll = (overrideStatus = status) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     loading: true,
  //   }));
  
  //   const payload = {
  //     status: overrideStatus,
  //     merchant: {
  //       id: merchantId,
  //       name: merchantName,
  //     },
  //     velocity: postData,
  //   };
  
  //   const url = details
  //     ? `/payout/admin/merchant-velocity/update/${id}`
  //     : `/payout/admin/merchant-velocity/create`;
  
  //   const callback = (response) => {
  //     setState((prevState) => ({
  //       ...prevState,
  //       loading: false,
  //     }));
  //     if (response?.success) {
  //       applyToast(response.message, "success");
        
        
  //     } else {
        
  //       console.error("API error", response);
  //       applyToast(response.message, "error");
  //     }
      
  //     setState((prevState) => ({
  //       ...prevState,
  //       loading: false,
  //     }));
  //   };
  
  //   if (details) {
  //     ApiGateway.patch(url, payload, callback);
  //   } else {
  //     ApiGateway.post(url, payload, callback);
  //   }
  // };

  const handleSubmitAll = (overrideStatus = status) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
  
    const payload = {
      status: overrideStatus,
      merchant: {
        id: merchantId,
        name: merchantName,
      },
      velocity: postData,
    };
  
    const isUpdate = details;
    //alert(isUpdate)
    //return
    const url = isUpdate
      ? `/payout/admin/merchant-velocity/update/${id}`
      : `/payout/admin/merchant-velocity/create`;
  
    const callback = (response) => {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
  
      if (response?.success) {
        if (isUpdate) {
          
          applyToast(response.message, "success");
          velocityDetails();
          // setTimeout(()=>{
          //   history.push('/merchant')
          //  },600)
        } else {
          applyToast(response.message, "success");
          velocityDetails();
       
        }
      } else {
        if (isUpdate) {
          applyToast("Failed to update velocity details", "error");
        } else {
          applyToast("Failed to create velocity details", "error");
        }
      }
    };
  
    if (isUpdate) {
      ApiGateway.patch(url, payload, callback);
    } else {
      ApiGateway.post(url, payload, callback);
    }
  };
  
  
  

  const handlePaymentInput = (primaryIndex, selectedName, value, mode) => {
    const updatedItems = [...postData.payment_mode[mode]];

    updatedItems[primaryIndex] = {
      ...updatedItems[primaryIndex],
      [selectedName]: value,
    };
    setPostData((prevState) => ({
      ...prevState,
      payment_mode: {
        ...prevState.payment_mode,
        [mode]: updatedItems,
      },
    }));
  };

  return (
    <>
      {merchant_pricing.reRender && (
        <div className="content_wrapper dash_wrapper">
          {state.loading && <Loader />}
          <div className="dash_merchent_welcome">
            <div className="merchent_wlcome_content">
              Velocity Check
              <div className="bread_crumb">
                <ul className="breadcrumb">
                  <li>
                    <Link to="/dashboard" className="inactive_breadcrumb">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/merchant" className="inactive_breadcrumb">
                      Merchant
                    </Link>
                  </li>
                  <li className="active_breadcrumb">Velocity Check</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="white_tab_wrap ">
            <div className="white_tab_box ">
              <div className="row">
                <div className="col-xs-12">
                  <div className="card ">
                    <div className="clearfix" style={{ marginBottom: "15px" }}>
                      <span className="pull-left">
                        <strong>Transaction</strong>
                      </span>
                      <span className="pull-right">
                        <input
                          type="checkbox"
                          checked={status === "active"}
                          onChange={handleSwitch}
                        />
                      </span>
                    </div>
                    {/* <div className={status === "inactive" ? "dim-effect" : ""}> */}
                    <div >
                      <div className="row" style={{ marginBottom: "15px" }}>
                        {postData?.transaction.map((data, index) => (
                          <div
                            key={index}
                            className="col-xs-12 col-sm-12 col-md-6 col-lg-4 "
                          >
                            <div className="card" style={{ height: "100%" }}>
                              <div style={{ marginBottom: "10px" }}>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={data.is_enabled}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        index,
                                        "is_enabled",
                                        e
                                      )
                                    }
                                  />{" "}
                                  {data?.name}
                                </label>
                              </div>

                              <div
                                className="form-group clearfix"
                                style={{ marginBottom: "10px" }}
                              >
                                <label
                                  className="pull-left"
                                  style={{ marginRight: "10px" }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={data.is_count_enabled}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        index,
                                        "is_count_enabled",
                                        e
                                      )
                                    }
                                  />{" "}
                                  Transaction Count
                                </label>
                                <input
                                  className="form-control pull-right"
                                  style={{ width: "36%" }}
                                  type="number"
                                  min={0}
                                  value={data.transaction_count || ""}
                                  placeholder="Enter transaction count"
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 6) {
                                      handleInputChange(
                                        index,
                                        "transaction_count",
                                        value
                                      );
                                    }
                                  }}
                                />
                              </div>

                              <div
                                className="form-group clearfix"
                                style={{ marginBottom: "10px" }}
                              >
                                <label
                                  className="pull-left"
                                  style={{ marginRight: "10px" }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={data.is_volume_enabled || false}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        index,
                                        "is_volume_enabled",
                                        e
                                      )
                                    }
                                  />{" "}
                                  Transaction Volume
                                </label>
                                <input
                                  className="form-control pull-right"
                                  style={{ width: "36%" }}
                                  type="number"
                                  min={0}
                                  value={data.transaction_amount || ""}
                                  placeholder="Enter transaction amount"
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 6) {
                                      handleInputChange(
                                        index,
                                        "transaction_amount",
                                        value
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <strong>Payment Mode</strong>

                      <div className="row">
                        {Object.keys(postData.payment_mode || {}).map(
                          (mode) => (
                            <div
                              className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                              key={mode}
                            >
                              <div
                                className="card"
                                style={{ marginBottom: "15px" }}
                              >
                                <div className="row">
                                  <div
                                    className="col-xs-12"
                                    style={{ marginBottom: "10px" }}
                                  >
                                    <strong
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {capitalizeWords(removeUnderScore(mode))}
                                    </strong>
                                  </div>

                                  {Array.isArray(postData.payment_mode[mode]) &&
                                    postData.payment_mode[mode].map(
                                      (entry, index) => (
                                        <div
                                          key={index}
                                          className="col-xs-12 col-sm-12 col-md-6 col-lg-4"
                                        >
                                          <div
                                            className="card"
                                            style={{
                                              height: "100%",
                                              marginBottom: "10px",
                                            }}
                                          >
                                            {/* Mode Toggle */}
                                            <div
                                              style={{ marginBottom: "10px" }}
                                            >
                                              <label>
                                                <input
                                                  type="checkbox"
                                                  checked={
                                                    entry.is_enabled || false
                                                  }
                                                  onChange={(e) =>
                                                    handlePaymentCheckbox(
                                                      index,
                                                      "is_enabled",
                                                      e,
                                                      mode
                                                    )
                                                  }
                                                />{" "}
                                                {entry.name}
                                              </label>
                                            </div>

                                            {/* Transaction Count */}
                                            <div
                                              className="form-group clearfix"
                                              style={{ marginBottom: "10px" }}
                                            >
                                              <label
                                                className="pull-left"
                                                style={{ marginRight: "10px" }}
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={
                                                    entry.is_count_enabled ||
                                                    false
                                                  }
                                                  onChange={(e) =>
                                                    handlePaymentCheckbox(
                                                      index,
                                                      "is_count_enabled",
                                                      e,
                                                      mode
                                                    )
                                                  }
                                                />{" "}
                                                Transaction Count
                                              </label>
                                              <input
                                                className="form-control pull-right"
                                                style={{ width: "36%" }}
                                                type="number"
                                                min={0}
                                                value={
                                                  entry.transaction_count || ""
                                                }
                                                placeholder="Enter transaction count"
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (value.length <= 6) {
                                                    handlePaymentInput(
                                                      index,
                                                      "transaction_count",
                                                      value,
                                                      mode
                                                    );
                                                  }
                                                }}
                                              />
                                            </div>

                                            {/* Transaction Volume */}
                                            <div className="form-group clearfix">
                                              <label
                                                className="pull-left"
                                                style={{ marginRight: "10px" }}
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={
                                                    entry.is_volume_enabled ||
                                                    false
                                                  }
                                                  onChange={(e) =>
                                                    handlePaymentCheckbox(
                                                      index,
                                                      "is_volume_enabled",
                                                      e,
                                                      mode
                                                    )
                                                  }
                                                />{" "}
                                                Transaction Volume
                                              </label>
                                              <input
                                                className="form-control pull-right"
                                                style={{ width: "36%" }}
                                                type="number"
                                                min={0}
                                                value={
                                                  entry.transaction_amount || ""
                                                }
                                                placeholder="Enter transaction amount"
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (value.length <= 6) {
                                                    handlePaymentInput(
                                                      index,
                                                      "transaction_amount",
                                                      value,
                                                      mode
                                                    );
                                                  }
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      <div className="text-right" style={{ marginTop: "15px" }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSubmitAll(status)}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VelocityCheck;


