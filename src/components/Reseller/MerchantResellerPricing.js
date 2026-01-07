import React , { useRef , useEffect,useState } from "react";
import { useDispatch, useSelector , shallowEqual  } from 'react-redux';
import { userConstants } from "../../constants/ActionTypes";
import { ToastProvider, useToasts } from 'react-toast-notifications';
import ApiGateway from "../../DataServices/DataServices";
import Switch from "react-switch";
import Loader from "../Loader";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
var _ = require('lodash');

const MerchantResellerPricing = (props) => {
    const {merchant_pricing} = useSelector((state) => state);
    const [isExpanded, setIsExpanded] = useState(false);
    const {id}=useParams();
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    const dispatch = useDispatch(); 

    const latestValue = useRef({});

    latestValue.current = merchant_pricing;
    const [loading,setLoading]=useState(true)
    const { addToast } = useToasts();
    const applyToast = (msg,type) => { return addToast(msg, { appearance: type });}

    const updateState = (actionType, value) => dispatch => {
        dispatch({type : actionType, payload : value});
        return Promise.resolve();
    };
    const stateChanges = (payload) => {
        return { type: userConstants.MERCHANT_PRICING, payload };
    };
    useEffect(() => {
        getSettingDetails();
    }, []);

    const getSettingDetails = () => {
        setLoading(true)
        ApiGateway.get(`/payout/admin/reseller/pricing/detail?reseller_id=${id}`, function(response) {
            if(response.success){ 
                dispatch( updateState(userConstants.MERCHANT_PRICING,
                    { 
                            vpa_creation_type: response.data.resellerSettings?.commission?.creations?.VPA?.pricing_type == 'fixed' ? true : false,
                            vpa_collection_type: response.data.resellerSettings?.commission?.collections?.VPA?.pricing_type == 'fixed' ? true : false,
                            van_creation_type: response.data.resellerSettings?.commission?.creations?.VAN?.pricing_type == 'fixed' ? true : false,
                            van_collection_type: response.data.resellerSettings?.commission?.collections?.VAN?.pricing_type == 'fixed' ? true : false,
                            settings_neft: response.data.resellerSettings?.commission?.NEFT?.value,
                            settings_imps: response.data.resellerSettings?.commission?.IMPS?.value,
                            settings_rtgs: response.data.resellerSettings?.commission?.RTGS?.value,
                            settings_upi: response.data.resellerSettings?.commission?.UPI?.value,
                            settings_great1_neft: response.data.resellerSettings?.commission?.great1?.NEFT?.value,
                            settings_great1_imps: response.data.resellerSettings?.commission.great1?.IMPS?.value,
                            // settings_great1_rtgs: response.data.resellerSettings?.commission.great1?.RTGS?.value,
                            settings_great1_upi: response.data.resellerSettings?.commission?.great1?.UPI?.value,
                            settings_great10_neft: response.data.resellerSettings?.commission?.great10?.NEFT?.value,
                            settings_great10_imps: response.data.resellerSettings?.commission?.great10?.IMPS?.value,
                            // settings_great10_rtgs: response.data.resellerSettings?.commission?.great10?.RTGS?.value,
                            settings_great10_upi: response.data.resellerSettings?.commission?.great10?.UPI?.value,
                            settings_great25_neft: response.data.resellerSettings?.commission?.great25?.NEFT?.value,
                            settings_great25_imps: response.data.resellerSettings?.commission?.great25?.IMPS?.value,
                            // settings_great25_rtgs: response.data.resellerSettings?.commission?.great25?.RTGS?.value,
                            settings_great25_upi: response.data.resellerSettings?.commission?.great25?.UPI?.value,
                            percent_neft: response.data.resellerSettings?.commission?.NEFT?.percentage,
                            percent_imps: response.data.resellerSettings?.commission?.IMPS?.percentage,
                            percent_rtgs: response.data.resellerSettings?.commission?.RTGS?.percentage,
                            percent_upi: response.data.resellerSettings?.commission?.UPI?.percentage,
                            percent_great1_neft: response.data.resellerSettings?.commission?.great1?.NEFT?.percentage,
                            percent_great1_imps: response.data.resellerSettings?.commission.great1?.IMPS?.percentage,
                            // percent_great1_rtgs: response.data.resellerSettings?.commission.great1?.RTGS?.percentage,
                            percent_great1_upi: response.data.resellerSettings?.commission?.great1?.UPI?.percentage,
                            percent_great10_neft: response.data.resellerSettings?.commission?.great10?.NEFT?.percentage,
                            percent_great10_imps: response.data.resellerSettings?.commission?.great10?.IMPS?.percentage,
                            // percent_great10_rtgs: response.data.resellerSettings?.commission?.great10?.RTGS?.percentage,
                            percent_great10_upi: response.data.resellerSettings?.commission?.great10?.UPI?.percentage,
                            percent_great25_neft: response.data.resellerSettings?.commission?.great25?.NEFT?.percentage,
                            percent_great25_imps: response.data.resellerSettings?.commission?.great25?.IMPS?.percentage,
                            // percent_great25_rtgs: response.data.resellerSettings?.commission?.great25?.RTGS?.percentage,
                            percent_great25_upi: response.data.resellerSettings?.commission?.great25?.UPI?.percentage,
                            van_collection: response.data.resellerSettings?.commission?.collections?.VAN?.value,
                            vpa_collection: response.data.resellerSettings?.commission?.collections?.VPA?.value,
                            van_creation: response.data.resellerSettings?.commission?.creations?.VAN?.value,
                            vpa_creation: response.data.resellerSettings?.commission?.creations?.VPA?.value,
                            van_verification: response.data.resellerSettings?.commission?.verifications?.account,
                            vpa_verification: response.data.resellerSettings?.commission?.verifications?.vpa,
                            // daily_trans_count: response.data.resellerSettings?.settings?.daily_trans_count,
                            // daily_trans_volume: response.data.resellerSettings?.settings?.daily_trans_volume,
                            // per_trans_volume: response.data.resellerSettings?.settings?.per_trans_volume,
                            //  max_beneficiary: response.data.resellerSettings?.settings?.max_beneficiary, 
                           reRender:true
                    }
                ))
                setLoading(false)
            } else{
                dispatch( updateState(userConstants.MERCHANT_PRICING,
                    { 
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
                            settings_great10_imps:0,
                            // settings_great10_rtgs: 0,
                            settings_great10_upi: 0,
                            settings_great25_neft: 0,
                            settings_great25_imps: 0,
                            // settings_great25_rtgs: 0,
                            settings_great25_upi: 0,
                            percent_neft:0,
                            percent_imps:0,
                            percent_rtgs:0,
                            percent_upi:0,
                            percent_great1_neft:0,
                            percent_great1_imps:0,
                            // percent_great1_rtgs:0,
                            percent_great1_upi:0,
                            percent_great10_neft:0,
                            percent_great10_imps:0,
                            // percent_great10_rtgs:0,
                            percent_great10_upi:0,
                            percent_great25_neft:0,
                            percent_great25_imps:0,
                            // percent_great25_rtgs:0,
                            percent_great25_upi:0,
                            van_collection:0,
                            vpa_collection: 0,
                            van_creation: 0,
                            vpa_creation: 0,
                            van_verification: 0,
                            vpa_verification: 0,
                            // daily_trans_count: 0,
                            // daily_trans_volume: 0,
                            // per_trans_volume: 0,
                            //  max_beneficiary: 0, 
                           reRender:true
                    }
                ))
                setLoading(false)
            }
        }) 
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(stateChanges({ [name]: value }));
    };

    const updateSetting = () => {

            var data = {
                "reseller" : {
                    "id" : id,
                    "name" : "stack"
                },
                "commission" : {
                    "NEFT" :{
                        "value":parseFloat(merchant_pricing.settings_neft),
                        "percentage":parseFloat(merchant_pricing.percent_neft)
                    }, 
                    "IMPS" :{
                        "value":parseFloat(merchant_pricing.settings_imps),
                        "percentage":parseFloat(merchant_pricing.percent_imps)
                    }, 
                    "RTGS" :{
                        "value":parseFloat(merchant_pricing.settings_rtgs),
                        "percentage":parseFloat(merchant_pricing.percent_rtgs)
                    }, 
                    "UPI" :{
                        "value":parseFloat(merchant_pricing.settings_upi),
                        "percentage":parseFloat(merchant_pricing.percent_upi)
                    }, 
                    "great1" : {
                        "NEFT" :{
                            "value":parseFloat(merchant_pricing.settings_great1_neft),
                            "percentage":parseFloat(merchant_pricing.percent_great1_neft)
                        },  
                        "IMPS" :{
                            "value":parseFloat(merchant_pricing.settings_great1_imps),
                            "percentage":parseFloat(merchant_pricing.percent_great1_imps)
                        },  
                        "UPI" :{
                            "value":parseFloat(merchant_pricing.settings_great1_upi),
                            "percentage":parseFloat(merchant_pricing.percent_great1_upi)
                        },  
                    },
                    "great10" : {
                        "NEFT" :{
                            "value":parseFloat(merchant_pricing.settings_great10_neft),
                            "percentage":parseFloat(merchant_pricing.percent_great10_neft)
                        },  
                        "IMPS" :{
                            "value":parseFloat(merchant_pricing.settings_great10_imps),
                            "percentage":parseFloat(merchant_pricing.percent_great10_imps)
                        },
                        "UPI" :{
                            "value":parseFloat(merchant_pricing.settings_great10_upi),
                            "percentage":parseFloat(merchant_pricing.percent_great10_upi)
                        },  
                    },
                    "great25" : {
                        "NEFT" :{
                            "value":parseFloat(merchant_pricing.settings_great25_neft),
                            "percentage":parseFloat(merchant_pricing.percent_great25_neft)
                        },  
                        "IMPS" :{
                            "value":parseFloat(merchant_pricing.settings_great25_imps),
                            "percentage":parseFloat(merchant_pricing.percent_great25_imps)
                        }, 
                        "UPI" :{
                            "value":parseFloat(merchant_pricing.settings_great25_upi),
                            "percentage":parseFloat(merchant_pricing.percent_great25_upi)
                        },  
                         
                    "RTGS" :{
                        "value":parseFloat(merchant_pricing.settings_rtgs),
                        "percentage":parseFloat(merchant_pricing.percent_rtgs)
                    }, 
                    },
                    "collections" : {
                        "VAN" : {
                            "pricing_type" : merchant_pricing.van_collection_type ? 'fixed' : 'percentage',
                            "value" : parseFloat(merchant_pricing.van_collection)
                        },
                        "VPA" : {
                            "pricing_type" : merchant_pricing.vpa_collection_type ? 'fixed' : 'percentage',
                            "value" : parseFloat(merchant_pricing.vpa_collection)
                        }
                    },
                    "creations" : {
                        "VAN" : {
                            "pricing_type" : merchant_pricing.van_creation_type ? 'fixed' : 'percentage',
                            "value" : parseFloat(merchant_pricing.van_creation)
                        },
                        "VPA" : {
                            "pricing_type" : merchant_pricing.vpa_creation_type ? 'fixed' : 'percentage',
                            "value" : parseFloat(merchant_pricing.vpa_creation)
                        }
                    },
                    "verifications" : {
                        "account" : parseFloat(merchant_pricing.van_verification),
                        "vpa" : parseFloat(merchant_pricing.vpa_verification)
                    },
                },
              /*   "settings" : {
                    "daily_trans_count" : parseFloat(merchant_pricing.daily_trans_count),
                    "daily_trans_volume" : parseFloat(merchant_pricing.daily_trans_volume),
                    "per_trans_volume" : parseFloat(merchant_pricing.per_trans_volume),
                    "max_beneficiary" : parseFloat(merchant_pricing.max_beneficiary),
                    
                }, */
                "is_partial_deduction":merchant_pricing?.partial_invoice
            }
            
        setLoading(true)
        ApiGateway.patch(`/payout/admin/reseller/update/pricing`, data, function (response) {
            if(response.success){
                setLoading(false)
                applyToast(response.message,'success');
            }  else {
                setLoading(false)
                applyToast(response.message,'error');
            }          
        })
    }
  
   
    const calculationTypeChange = (name, e) => {
        dispatch( updateState(userConstants.MERCHANT_PRICING,
            { 
                
                [name] : e
            }
        ))
    };
    const ToggleEvent = (id) => {
        const validKeys = ["banking_service", "upi_service", "virtual_account", "settings_section"];
        if (validKeys.includes(id)) {
            dispatch(updateState(userConstants.MERCHANT_PRICING, {
                [id]: !merchant_pricing[id]
            }));
        }
    };


    const handlePartialChange = (id)=>{
       
        dispatch(updateState(userConstants.MERCHANT_PRICING, {
       partial_invoice: id
        }));
    }
    return (
        <>
        {merchant_pricing.reRender &&
        <div className="content_wrapper dash_wrapper">
            {/* {loading && <Loader />} */}
            <div className="dash_merchent_welcome">
                <div className="merchent_wlcome_content">Reseller Pricing <div className="bread_crumb">
                  <ul className="breadcrumb">
                  <li ><Link to="/dashboard" className="inactive_breadcrumb">Home</Link></li>
                  <li ><Link to="/merchant" className="inactive_breadcrumb">Reseller</Link></li>
                  <li className="active_breadcrumb">Reseller Pricing</li>
              
                  </ul>
                  </div>
                  </div>
            </div>
            <div className="white_tab_wrap">
                <div className="white_tab_box">
                    <div className="tab-content">
                        <div id="commission" className="tab-pane fade in active">



                        <div className="col-xs-12 pricing_head_sec pointer-cursor" onClick={()=>ToggleEvent("banking_service")}><div className="pricing_head">Banking Service</div>
                        <div className="expand_sign">+</div></div>
                            <div className={`col-xs-12 p-0 ${merchant_pricing.banking_service ? "" : "content"}`}>
                                <div className="col-xs-12 col-sm-6 col-md-6 ">
                                    <div className="sub_heading">NEFT Fund Transfer</div>
                                    <div className="col-md-12 col-sm-12 col-xs-12  m-t-10 form-refrance-cls">
                                        <table className="upi_table">
                                            <tr>
                                                <th>Price Range</th>
                                                <th><div className="row commission-row">
                                                                <div className="col-md-4 m-l-30">Fixed Commission</div>
                                                                <div className="col-md-5 m-l-41">Percentage Commission</div>
                                                                </div></th>
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">1 - 1000</span></td>
                                                <td>
                                                           <div className="commission-row">
                                                           <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_neft" value={merchant_pricing.settings_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_neft" 
                                                                value={merchant_pricing.percent_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                           </div>
                                                        </td>
                                              {/*   <td>
                                                    <div className="input-group">
                                                        <input className="form-control" placeholder="" name="settings_neft" value={merchant_pricing.settings_neft}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">1001 - 10000</span></td>
                                                <td>
                                                            <div className="commission-row">
                                                            <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great1_neft" value={merchant_pricing.settings_great1_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great1_neft" value={merchant_pricing.percent_great1_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                            
                                                        </td>
                                                {/* <td>
                                                    <div className="input-group"> 
                                                        <input className="form-control" placeholder="" name="settings_great1_neft" value={merchant_pricing.settings_great1_neft}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">10001 -25000</span></td>
                                                <td>
                                                            <div className="commission-row">
                                                            <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great10_neft" value={merchant_pricing.settings_great10_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great10_neft" value={merchant_pricing.percent_great10_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                           
                                                        </td>
                                               {/*  <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_great10_neft" value={merchant_pricing.settings_great10_neft}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">Above 25000</span></td>
                                                <td>
                                                            <div className="commission-row">
                                                            <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great25_neft" value={merchant_pricing.settings_great25_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great25_neft" value={merchant_pricing.percent_great25_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                            
                                                        </td>
                                                {/* <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_great25_neft" value={merchant_pricing.settings_great25_neft}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6">
                                    <div className="sub_heading">IMPS Fund Transfer</div>
                                    <div className="col-md-12 col-sm-12 col-xs-12  m-t-10 form-refrance-cls">
                                        <table className="upi_table">
                                            <tr>
                                                <th>Price Range</th>
                                                <th><div className="row commission-row">
                                                                <div className="col-md-4 m-l-30">Fixed Commission</div>
                                                                <div className="col-md-5 m-l-41">Percentage Commission</div>
                                                                </div></th>
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">1 - 1000</span></td>
                                                <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_imps" value={merchant_pricing.settings_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                  
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_imps" value={merchant_pricing.percent_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                  
                                                            </div>
                                                        </div>

                                                            
                                                        </td>
                                                {/* <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_imps" value={merchant_pricing.settings_imps}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">1001 - 10000</span></td>
                                                <td>

<div className="commission-row">
<div className="input-group commission-row-input m-l-30">
        <input className="form-control commission-row-input-group" placeholder="" name="settings_great1_imps" value={merchant_pricing.settings_great1_imps}
            onChange={handleChange} type="text" />
        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
    </div>
    <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
    <div className="input-group commission-row-input">
        <input className="form-control commission-row-input-group" placeholder="" name="percent_great1_imps" value={merchant_pricing.percent_great1_imps}
            onChange={handleChange} type="text" />
        <span className="input-group-addon"><i className="fa fa-percent"></i></span>
    </div>
</div>
   
</td>
                                               {/*  <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_great1_imps" value={merchant_pricing.settings_great1_imps}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">10001 -25000</span></td>
                                                <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great10_imps" value={merchant_pricing.settings_great10_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great10_imps" value={merchant_pricing.percent_great10_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                         
                                                        </td>
                                                {/* <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_great10_imps" value={merchant_pricing.settings_great10_imps}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">Above 25000</span></td>
                                                <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great25_imps" value={merchant_pricing.settings_great25_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great25_imps" value={merchant_pricing.percent_great25_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                           
                                                        </td>
                                                {/* <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_great25_imps" value={merchant_pricing.settings_great25_imps}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6">
                                    <div className="sub_heading">UPI Fund Transfer</div>
                                    <div className="col-md-12 col-sm-12 col-xs-12  m-t-10 form-refrance-cls">
                                        <table className="upi_table">
                                            <tr>
                                                <th>Price Range</th>
                                                <th><div className="row commission-row">
                                                                <div className="col-md-4 m-l-30">Fixed Commission</div>
                                                                <div className="col-md-5 m-l-41">Percentage Commission</div>
                                                                </div></th>
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">1 - 1000</span></td>
                                                <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_upi" value={merchant_pricing.settings_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_upi" value={merchant_pricing.percent_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                            
                                                        </td>
                                               {/*  <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_upi" value={merchant_pricing.settings_upi}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">1001 - 10000</span></td>
                                                <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great1_upi" value={merchant_pricing.settings_great1_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great1_upi" value={merchant_pricing.percent_great1_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                            
                                                        </td>
                                               {/*  <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_great1_upi" value={merchant_pricing.settings_great1_upi}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">10001 -25000</span></td>
                                                <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great10_upi" value={merchant_pricing.settings_great10_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great10_upi" value={merchant_pricing.percent_great10_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                            
                                                        </td>
                                               {/*  <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_great10_upi" value={merchant_pricing.settings_great10_upi}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">Above 25000</span></td>
                                                <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great25_upi" value={merchant_pricing.settings_great25_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great25_upi" value={merchant_pricing.percent_great25_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                            
                                                        </td>
                                               {/*  <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_great25_upi" value={merchant_pricing.settings_great25_upi}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6">
                                    <div className="sub_heading">RTGS Fund Transfer</div>
                                    <div className="col-md-12 col-sm-12 col-xs-12  m-t-10 form-refrance-cls">
                                        <table className="upi_table">
                                            <tr>
                                                <th>Price Range</th>
                                                <th><div className="row commission-row">
                                                                <div className="col-md-4 m-l-30">Fixed Commission</div>
                                                                <div className="col-md-5 m-l-41">Percentage Commission</div>
                                                                </div></th>
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">Above 2 Lakhs</span></td>
                                                <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_rtgs" value={merchant_pricing.settings_rtgs}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_rtgs" value={merchant_pricing.percent_rtgs}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                           
                                                        </td>
                                            </tr>
                                            {/* <tr>
                                                <td><span className="heading_table">1001 - 10000</span></td>
                                                <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_great1_rtgs" value={merchant_pricing.settings_great1_rtgs}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">10001 -25000</span></td>
                                                <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_great10_rtgs" value={merchant_pricing.settings_great10_rtgs}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><span className="heading_table">Above 25000</span></td>
                                                <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_great25_rtgs" value={merchant_pricing.settings_great25_rtgs}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td>
                                            </tr> */}
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-12 pricing_head_sec m-t-10 pointer-cursor" onClick={()=>ToggleEvent("upi_service")}><div className="pricing_head">UPI Service</div>
                            <div className="expand_sign">+</div></div>
                            <div className={`col-xs-12 col-sm-6 col-md-4 ${merchant_pricing.upi_service ? "" : "content"}`}>
                                <div className="sub_heading">UPI Services</div>
                                <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                    <div className="form-group clearfix form-refrance-cls">
                                        <div className="col-md-4 col-sm-6 col-xs-12 control-label ">UPI ID Creation</div>
                                        <div className="col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-group">    
                                                <input className="form-control" name="vpa_creation" placeholder="" 
                                                value={merchant_pricing.vpa_creation} 
                                                onChange={handleChange}
                                                type="text"/>
                                                <span className="input-group-addon">
                                                    <Switch 
                                                    checked={merchant_pricing.vpa_creation_type}
                                                    onChange={(e) => calculationTypeChange('vpa_creation_type',e) }
                                                    onColor="#86d3ff"
                                                    onHandleColor="#2693e6"
                                                    handleDiameter={22}
                                                    height={20}
                                                    width={48}
                                                    className="react-switch"
                                                    id="material-switch" 
                                                    uncheckedIcon={
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                height: "100%",
                                                                fontSize: 15,
                                                                color: "orange",
                                                                paddingRight: 2
                                                            }}
                                                        >
                                                            <i className="fa fa-percent"></i>
                                                        </div>
                                                        }
                                                    checkedIcon={
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                height: "100%",
                                                                fontSize: 15,
                                                                color: "orange",
                                                                paddingRight: 2
                                                            }}
                                                        >
                                                            <i className="fa fa-rupee"></i> 
                                                        </div>
                                                    }
                                                />
                                                </span> 
                                            </div>
                                        </div>	 
                                    </div>
                                    <div className="form-group clearfix form-refrance-cls">
                                        <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Collection to UPI ID</div>
                                        <div className=" col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-group">    
                                                <input className="form-control" name="vpa_collection" placeholder="" 
                                                value={merchant_pricing.vpa_collection} 
                                                onChange={handleChange}
                                                type="text"/>
                                                <span className="input-group-addon">
                                                <Switch 
                                                    checked={merchant_pricing.vpa_collection_type}
                                                    onChange={(e) => calculationTypeChange('vpa_collection_type',e) }
                                                    onColor="#86d3ff"
                                                    onHandleColor="#2693e6"
                                                    handleDiameter={22}
                                                    height={20}
                                                    width={48}
                                                    className="react-switch"
                                                    id="material-switch" 
                                                    uncheckedIcon={
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                height: "100%",
                                                                fontSize: 15,
                                                                color: "orange",
                                                                paddingRight: 2
                                                            }}
                                                        >
                                                            <i className="fa fa-percent"></i>
                                                        </div>
                                                        }
                                                    checkedIcon={
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                height: "100%",
                                                                fontSize: 15,
                                                                color: "orange",
                                                                paddingRight: 2
                                                            }}
                                                        >
                                                            <i className="fa fa-rupee"></i> 
                                                        </div>
                                                    }
                                                />
                                                </span>  
                                            </div>
                                        </div>	 
                                    </div>
                                    <div className="form-group clearfix form-refrance-cls">
                                        <div className="col-md-4 col-sm-6 col-xs-12 control-label ">UPI ID Verification</div>
                                        <div className=" col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-group">    
                                                <input className="form-control" name="vpa_verification" placeholder=""
                                                value={merchant_pricing.vpa_verification} 
                                                onChange={handleChange}
                                                type="text"/>
                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>            
                                            </div>
                                        </div>	 
                                    </div>
                                </div>
                                </div>
                                <div className="col-xs-12 pricing_head_sec m-t-10 pointer-cursor" onClick={()=>ToggleEvent("virtual_account")}><div className="pricing_head">Virtual Account</div>
                                <div className="expand_sign">+</div></div>
                                <div className={`col-xs-12 col-sm-6 col-md-4 ${merchant_pricing.virtual_account ? "" : "content"}`}>
                                    <div className="sub_heading">Virtual Account</div>
                                    <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Create VAN</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">   
                                                    <input className="form-control" name="van_creation" placeholder="" 
                                                    value={merchant_pricing.van_creation} 
                                                    onChange={handleChange}
                                                    type="text"/>
                                                    <span className="input-group-addon">
                                                        <Switch 
                                                            checked={merchant_pricing.van_creation_type}
                                                            onChange={(e) => calculationTypeChange('van_creation_type',e) }
                                                            onColor="#86d3ff"
                                                            onHandleColor="#2693e6"
                                                            handleDiameter={22}
                                                            height={20}
                                                            width={48}
                                                            className="react-switch"
                                                            id="material-switch" 
                                                            uncheckedIcon={
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        height: "100%",
                                                                        fontSize: 15,
                                                                        color: "orange",
                                                                        paddingRight: 2
                                                                    }}
                                                                >
                                                                    <i className="fa fa-percent"></i>
                                                                </div>
                                                                }
                                                            checkedIcon={
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        height: "100%",
                                                                        fontSize: 15,
                                                                        color: "orange",
                                                                        paddingRight: 2
                                                                    }}
                                                                >
                                                                    <i className="fa fa-rupee"></i> 
                                                                </div>
                                                            }
                                                        />    
                                                    </span> 
                                                </div>
                                            </div>	 
                                        </div>
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Collection</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">    
                                                    <input className="form-control" name="van_collection" placeholder="" 
                                                    value={merchant_pricing.van_collection} 
                                                    onChange={handleChange}
                                                    type="text"/>
                                                    <span className="input-group-addon">
                                                        <Switch 
                                                            checked={merchant_pricing.van_collection_type}
                                                            onChange={(e) => calculationTypeChange('van_collection_type',e) }
                                                            onColor="#86d3ff"
                                                            onHandleColor="#2693e6"
                                                            handleDiameter={22}
                                                            height={20}
                                                            width={48}
                                                            className="react-switch"
                                                            id="material-switch" 
                                                            uncheckedIcon={
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        height: "100%",
                                                                        fontSize: 15,
                                                                        color: "orange",
                                                                        paddingRight: 2
                                                                    }}
                                                                >
                                                                    <i className="fa fa-percent"></i>
                                                                </div>
                                                                }
                                                            checkedIcon={
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        height: "100%",
                                                                        fontSize: 15,
                                                                        color: "orange",
                                                                        paddingRight: 2
                                                                    }}
                                                                >
                                                                    <i className="fa fa-rupee"></i> 
                                                                </div>
                                                            }
                                                        />
                                                    </span>    
                                                </div>
                                            </div>	 
                                        </div>
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Bank Verification</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">    
                                                    <input className="form-control" name="van_verification" placeholder="" 
                                                    value={merchant_pricing.van_verification}
                                                    onChange={handleChange}
                                                    type="text"/>
                                                    <span className="input-group-addon"><i className="fa fa-rupee"></i></span>   
                                                </div>
                                            </div>	 
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="col-xs-12 pricing_head_sec m-t-10 pointer-cursor" onClick={()=>ToggleEvent("settings_section")}><div className="pricing_head">Settings</div>
                                <div className="expand_sign">+</div></div> */}

                                    <div className={`col-xs-12 col-sm-6 col-md-4 ${merchant_pricing.settings_section ? "" : "content"}`}>
                                     <div className="sub_heading">Settings</div>
                                    <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Daily Transaction Count</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">   
                                                    <input className="form-control" name="daily_trans_count" placeholder="" 
                                                    value={merchant_pricing.daily_trans_count} 
                                                    onChange={handleChange}
                                                    type="text"/>
                                                  
                                                </div>
                                            </div>	 
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Daily Transaction Volume</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">   
                                                    <input className="form-control" name="daily_trans_volume" placeholder="" 
                                                    value={merchant_pricing.daily_trans_volume} 
                                                    onChange={handleChange}
                                                    type="text"/>
                                                    <span className="input-group-addon"><i className="fa fa-rupee"></i></span> 
                                                </div>
                                            </div>	 
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Amount per Transaction</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">   
                                                    <input className="form-control" name="per_trans_volume" placeholder="" 
                                                    value={merchant_pricing.per_trans_volume} 
                                                    onChange={handleChange}
                                                    type="text"/>
                                                    <span className="input-group-addon"><i className="fa fa-rupee"></i></span> 
                                                </div>
                                            </div>	 
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Max. Beneficiary</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">   
                                                    <input className="form-control" name="max_beneficiary" placeholder="" 
                                                    value={merchant_pricing.max_beneficiary} 
                                                    onChange={handleChange}
                                                    type="text"/>
                                                   
                                                </div>
                                            </div>	 
                                        </div>
                                    </div>
                                   {/*  <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Partial Invoice</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                            <Switch
                                checked={
                                    merchant_pricing?.partial_invoice 
                                }
                                onChange={(e) =>handlePartialChange(e)}
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
                                
                              /> <span  className={
                                merchant_pricing?.partial_invoice
                                   ? "label_success"
                                   : "label_danger"
                               }>{merchant_pricing?.partial_invoice ? "Active" : "Inactive"}</span> 
                                            </div>	
                                           
                                        </div>
                                    </div> */}
                                



                                </div>
                            <div className="col-xs-12 p-0">
                               {/*  <div className="col-xs-12 col-sm-6 col-md-4 ">
                                <div className="sub_heading">UPI Services</div>
                                <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                    <div className="form-group clearfix form-refrance-cls">
                                        <div className="col-md-4 col-sm-6 col-xs-12 control-label ">UPI ID Creation</div>
                                        <div className="col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-group">    
                                                <input className="form-control" name="vpa_creation" placeholder="" 
                                                value={merchant_pricing.vpa_creation} 
                                                onChange={handleChange}
                                                type="text"/>
                                                <span className="input-group-addon">
                                                    <Switch 
                                                    checked={merchant_pricing.vpa_creation_type}
                                                    onChange={(e) => calculationTypeChange('vpa_creation_type',e) }
                                                    onColor="#86d3ff"
                                                    onHandleColor="#2693e6"
                                                    handleDiameter={22}
                                                    height={20}
                                                    width={48}
                                                    className="react-switch"
                                                    id="material-switch" 
                                                    uncheckedIcon={
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                height: "100%",
                                                                fontSize: 15,
                                                                color: "orange",
                                                                paddingRight: 2
                                                            }}
                                                        >
                                                            <i className="fa fa-percent"></i>
                                                        </div>
                                                        }
                                                    checkedIcon={
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                height: "100%",
                                                                fontSize: 15,
                                                                color: "orange",
                                                                paddingRight: 2
                                                            }}
                                                        >
                                                            <i className="fa fa-rupee"></i> 
                                                        </div>
                                                    }
                                                />
                                                </span> 
                                            </div>
                                        </div>	 
                                    </div>
                                    <div className="form-group clearfix form-refrance-cls">
                                        <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Collection to UPI ID</div>
                                        <div className=" col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-group">    
                                                <input className="form-control" name="vpa_collection" placeholder="" 
                                                value={merchant_pricing.vpa_collection} 
                                                onChange={handleChange}
                                                type="text"/>
                                                <span className="input-group-addon">
                                                <Switch 
                                                    checked={merchant_pricing.vpa_collection_type}
                                                    onChange={(e) => calculationTypeChange('vpa_collection_type',e) }
                                                    onColor="#86d3ff"
                                                    onHandleColor="#2693e6"
                                                    handleDiameter={22}
                                                    height={20}
                                                    width={48}
                                                    className="react-switch"
                                                    id="material-switch" 
                                                    uncheckedIcon={
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                height: "100%",
                                                                fontSize: 15,
                                                                color: "orange",
                                                                paddingRight: 2
                                                            }}
                                                        >
                                                            <i className="fa fa-percent"></i>
                                                        </div>
                                                        }
                                                    checkedIcon={
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                height: "100%",
                                                                fontSize: 15,
                                                                color: "orange",
                                                                paddingRight: 2
                                                            }}
                                                        >
                                                            <i className="fa fa-rupee"></i> 
                                                        </div>
                                                    }
                                                />
                                                </span>  
                                            </div>
                                        </div>	 
                                    </div>
                                    <div className="form-group clearfix form-refrance-cls">
                                        <div className="col-md-4 col-sm-6 col-xs-12 control-label ">UPI ID Verification</div>
                                        <div className=" col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-group">    
                                                <input className="form-control" name="vpa_verification" placeholder=""
                                                value={merchant_pricing.vpa_verification} 
                                                onChange={handleChange}
                                                type="text"/>
                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>            
                                            </div>
                                        </div>	 
                                    </div>
                                </div>
                                </div> */}
                               {/*  <div className="col-xs-12 col-sm-6 col-md-4 p-l-0">
                                    <div className="sub_heading">Virtual Account</div>
                                    <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Create VAN</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">   
                                                    <input className="form-control" name="van_creation" placeholder="" 
                                                    value={merchant_pricing.van_creation} 
                                                    onChange={handleChange}
                                                    type="text"/>
                                                    <span className="input-group-addon">
                                                        <Switch 
                                                            checked={merchant_pricing.van_creation_type}
                                                            onChange={(e) => calculationTypeChange('van_creation_type',e) }
                                                            onColor="#86d3ff"
                                                            onHandleColor="#2693e6"
                                                            handleDiameter={22}
                                                            height={20}
                                                            width={48}
                                                            className="react-switch"
                                                            id="material-switch" 
                                                            uncheckedIcon={
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        height: "100%",
                                                                        fontSize: 15,
                                                                        color: "orange",
                                                                        paddingRight: 2
                                                                    }}
                                                                >
                                                                    <i className="fa fa-percent"></i>
                                                                </div>
                                                                }
                                                            checkedIcon={
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        height: "100%",
                                                                        fontSize: 15,
                                                                        color: "orange",
                                                                        paddingRight: 2
                                                                    }}
                                                                >
                                                                    <i className="fa fa-rupee"></i> 
                                                                </div>
                                                            }
                                                        />    
                                                    </span> 
                                                </div>
                                            </div>	 
                                        </div>
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Collection</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">    
                                                    <input className="form-control" name="van_collection" placeholder="" 
                                                    value={merchant_pricing.van_collection} 
                                                    onChange={handleChange}
                                                    type="text"/>
                                                    <span className="input-group-addon">
                                                        <Switch 
                                                            checked={merchant_pricing.van_collection_type}
                                                            onChange={(e) => calculationTypeChange('van_collection_type',e) }
                                                            onColor="#86d3ff"
                                                            onHandleColor="#2693e6"
                                                            handleDiameter={22}
                                                            height={20}
                                                            width={48}
                                                            className="react-switch"
                                                            id="material-switch" 
                                                            uncheckedIcon={
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        height: "100%",
                                                                        fontSize: 15,
                                                                        color: "orange",
                                                                        paddingRight: 2
                                                                    }}
                                                                >
                                                                    <i className="fa fa-percent"></i>
                                                                </div>
                                                                }
                                                            checkedIcon={
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        height: "100%",
                                                                        fontSize: 15,
                                                                        color: "orange",
                                                                        paddingRight: 2
                                                                    }}
                                                                >
                                                                    <i className="fa fa-rupee"></i> 
                                                                </div>
                                                            }
                                                        />
                                                    </span>    
                                                </div>
                                            </div>	 
                                        </div>
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Bank Verification</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">    
                                                    <input className="form-control" name="van_verification" placeholder="" 
                                                    value={merchant_pricing.van_verification}
                                                    onChange={handleChange}
                                                    type="text"/>
                                                    <span className="input-group-addon"><i className="fa fa-rupee"></i></span>   
                                                </div>
                                            </div>	 
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className="col-xs-12 col-sm-6 col-md-4 p-l-0">
                                    <div className="sub_heading">Settings</div>
                                    <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Daily Transaction Count</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">   
                                                    <input className="form-control" name="daily_trans_count" placeholder="" 
                                                    value={merchant_pricing.daily_trans_count} 
                                                    onChange={handleChange}
                                                    type="text"/>
                                                  
                                                </div>
                                            </div>	 
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Daily Transaction Volume</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">   
                                                    <input className="form-control" name="daily_trans_volume" placeholder="" 
                                                    value={merchant_pricing.daily_trans_volume} 
                                                    onChange={handleChange}
                                                    type="text"/>
                                                    <span className="input-group-addon"><i className="fa fa-rupee"></i></span> 
                                                </div>
                                            </div>	 
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Amount per Transaction</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">   
                                                    <input className="form-control" name="per_trans_volume" placeholder="" 
                                                    value={merchant_pricing.per_trans_volume} 
                                                    onChange={handleChange}
                                                    type="text"/>
                                                    <span className="input-group-addon"><i className="fa fa-rupee"></i></span> 
                                                </div>
                                            </div>	 
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Max. Beneficiary</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                                <div className="input-group">   
                                                    <input className="form-control" name="max_beneficiary" placeholder="" 
                                                    value={merchant_pricing.max_beneficiary} 
                                                    onChange={handleChange}
                                                    type="text"/>
                                                   
                                                </div>
                                            </div>	 
                                        </div>
                                    </div>
                                </div> */}
                            </div>  
                            <div className="col-xs-12">
                                <div className="col-xs-12 m-t-40 text-center">
                                    <button className="submitBtn m-r-10" onClick={() => updateSetting()}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        }
        </>
    )
}


export default MerchantResellerPricing;
