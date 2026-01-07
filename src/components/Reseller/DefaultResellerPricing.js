import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { ToastProvider, useToasts } from 'react-toast-notifications';
import ApiGateway from "../../DataServices/DataServices";
import Switch from "react-switch";


import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { userConstants } from "../../constants/ActionTypes";
import useRouteExist from "../../DataServices/useRouteExist";
import Loader from "../Loader";

var _ = require('lodash');

const DefaultResellerPricing = () => {
    const {id}=useParams();
    const { resellerPricing } = useSelector((state) => state);
    const setDefaultPricing = useRouteExist(["admin-add-setting"])
    const dispatch = useDispatch();

    const latestValue = useRef({});
    const [loading,setLoading]=useState(true)
    latestValue.current = resellerPricing;

    const { addToast } = useToasts();
    const applyToast = (msg, type) => { return addToast(msg, { appearance: type }); }

    const updateState = (actionType, value) => dispatch => {
        dispatch({ type: actionType, payload: value });
        return Promise.resolve();
    };
    const stateChanges = (payload) => {
        return { type: userConstants.RESELLER_PRICING, payload };
    };
    useEffect(() => {
        getSettingDetails();
    }, []);
    const [open,setOpen]=useState(false);
    const getSettingDetails = () => {
        setLoading(true)
        ApiGateway.get(`/payout/admin/default-setting`, function (response) {
            if (response.success) {
                dispatch(updateState(userConstants.RESELLER_PRICING,
                    {
                        vpa_creation_type: response.data.settings.commission.creations.VPA.pricing_type == 'fixed' ? true : false,
                        vpa_collection_type: response.data.settings.commission.collections.VPA.pricing_type == 'fixed' ? true : false,
                        van_creation_type: response.data.settings.commission.creations.VAN.pricing_type == 'fixed' ? true : false,
                        van_collection_type: response.data.settings.commission.collections.VAN.pricing_type == 'fixed' ? true : false,
                        settings_neft: response.data.settings?.commission?.NEFT?.value,
                        settings_imps: response.data.settings?.commission?.IMPS?.value,
                        settings_rtgs: response.data.settings?.commission?.RTGS?.value,
                        settings_upi: response.data.settings?.commission?.UPI?.value,
                        settings_great1_neft: response.data.settings?.commission?.great1?.NEFT?.value,
                        settings_great1_imps: response.data.settings?.commission.great1?.IMPS?.value,
                        settings_great1_rtgs: response.data.settings?.commission.great1?.RTGS?.value,
                        settings_great1_upi: response.data.settings?.commission?.great1?.UPI?.value,
                        settings_great10_neft: response.data.settings?.commission?.great10?.NEFT?.value,
                        settings_great10_imps: response.data.settings?.commission?.great10?.IMPS?.value,
                        settings_great10_rtgs: response.data.settings?.commission?.great10?.RTGS?.value,
                        settings_great10_upi: response.data.settings?.commission?.great10?.UPI?.value,
                        settings_great25_neft: response.data.settings?.commission?.great25?.NEFT?.value,
                        settings_great25_imps: response.data.settings?.commission?.great25?.IMPS?.value,
                        settings_great25_rtgs: response.data.settings?.commission?.great25?.RTGS?.value,
                        settings_great25_upi: response.data.settings?.commission?.great25?.UPI?.value,
                        percent_neft: response.data.settings?.commission?.NEFT?.percentage,
                        percent_imps: response.data.settings?.commission?.IMPS?.percentage,
                        percent_rtgs: response.data.settings?.commission?.RTGS?.percentage,
                        percent_upi: response.data.settings?.commission?.UPI?.percentage,
                        percent_great1_neft: response.data.settings?.commission?.great1?.NEFT?.percentage,
                        percent_great1_imps: response.data.settings?.commission.great1?.IMPS?.percentage,
                        percent_great1_rtgs: response.data.settings?.commission.great1?.RTGS?.percentage,
                        percent_great1_upi: response.data.settings?.commission?.great1?.UPI?.percentage,
                        percent_great10_neft: response.data.settings?.commission?.great10?.NEFT?.percentage,
                        percent_great10_imps: response.data.settings?.commission?.great10?.IMPS?.percentage,
                        percent_great10_rtgs: response.data.settings?.commission?.great10?.RTGS?.percentage,
                        percent_great10_upi: response.data.settings?.commission?.great10?.UPI?.percentage,
                        percent_great25_neft: response.data.settings?.commission?.great25?.NEFT?.percentage,
                        percent_great25_imps: response.data.settings?.commission?.great25?.IMPS?.percentage,
                        percent_great25_rtgs: response.data.settings?.commission?.great25?.RTGS?.percentage,
                        percent_great25_upi: response.data.settings?.commission?.great25?.UPI?.percentage,
                        van_collection: response.data.settings.commission?.collections?.VAN?.value,
                        vpa_collection: response.data.settings.commission?.collections?.VPA?.value,
                        van_creation: response.data.settings.commission?.creations?.VAN?.value,
                        vpa_creation: response.data.settings.commission?.creations?.VPA?.value,
                        van_verification: response.data.settings.commission?.verifications?.account,
                        vpa_verification: response.data.settings.commission?.verifications?.vpa,
                        daily_trans_count: response.data.settings?.settings?.daily_trans_count,
                        daily_trans_volume: response.data.settings?.settings?.daily_trans_volume,
                        per_trans_volume: response.data.settings?.settings?.per_trans_volume,
                        max_beneficiary: response.data.settings?.settings?.max_beneficiary,
                        reRender: true
                    }
                ))
                setLoading(false)
            } else {
                dispatch(updateState(userConstants.RESELLER_PRICING, {
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
                    reRender: true
                }))
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
                "commission": {
                    "NEFT":{
                        "value":parseFloat(resellerPricing.settings_neft),
                        "percentage":parseFloat(resellerPricing.percent_neft)
                    },
                    "IMPS":{
                        "value":parseFloat(resellerPricing.settings_imps),
                        "percentage":parseFloat(resellerPricing.percent_imps)
                    },
                    "RTGS":{
                        "value":parseFloat(resellerPricing.settings_rtgs),
                        "percentage":parseFloat(resellerPricing.percent_rtgs)
                    }, 
                    "UPI":{
                        "value":parseFloat(resellerPricing.settings_upi),
                        "percentage":parseFloat(resellerPricing.percent_upi)
                    },
                    "great1": {
                        "NEFT":{
                            "value":parseFloat(resellerPricing.settings_great1_neft),
                            "percentage":parseFloat(resellerPricing.percent_great1_neft)
                        }, 
                        "IMPS":{
                            "value":parseFloat(resellerPricing.settings_great1_imps),
                            "percentage":parseFloat(resellerPricing.percent_great1_imps)
                        },
                        "UPI":{
                            "value":parseFloat(resellerPricing.settings_great1_upi),
                            "percentage":parseFloat(resellerPricing.percent_great1_upi)
                        }, 
                    },
                    "great10": {
                        "NEFT":{
                            "value":parseFloat(resellerPricing.settings_great10_neft),
                            "percentage":parseFloat(resellerPricing.percent_great10_neft)
                        },  
                        "IMPS":{
                            "value":parseFloat(resellerPricing.settings_great10_imps),
                            "percentage":parseFloat(resellerPricing.percent_great10_imps)
                        },  
                      
                        "UPI":{
                            "value":parseFloat(resellerPricing.settings_great10_upi),
                            "percentage":parseFloat(resellerPricing.percent_great10_upi)
                        },  
                    },
                    "great25": {
                        "NEFT":{
                            "value":parseFloat(resellerPricing.settings_great25_neft),
                            "percentage":resellerPricing.percent_great25_neft
                        }, 
                        "IMPS":{
                            "value":parseFloat(resellerPricing.settings_great25_imps),
                            "percentage":parseFloat(resellerPricing.percent_great25_imps)
                        },
                        "UPI":{
                            "value":parseFloat(resellerPricing.settings_great25_upi),
                            "percentage":parseFloat(resellerPricing.percent_great25_upi)
                        }, 
                         "RTGS":{
                        "value":parseFloat(resellerPricing.settings_rtgs),
                        "percentage":parseFloat(resellerPricing.percent_rtgs)
                         }, 
                    },
                    "collections": {
                        "VAN": {
                            "pricing_type": resellerPricing.van_collection_type ? 'fixed' : 'percentage',
                            "value": parseFloat(resellerPricing.van_collection)
                        },
                        "VPA": {
                            "pricing_type": resellerPricing.vpa_collection_type ? 'fixed' : 'percentage',
                            "value": parseFloat(resellerPricing.vpa_collection)
                        }
                    },
                    "creations": {
                        "VAN": {
                            "pricing_type": resellerPricing.van_creation_type ? 'fixed' : 'percentage',
                            "value": parseFloat(resellerPricing.van_creation)
                        },
                        "VPA": {
                            "pricing_type": resellerPricing.vpa_creation_type ? 'fixed' : 'percentage',
                            "value": parseFloat(resellerPricing.vpa_creation)
                        }
                    },
                    "verifications": {
                        "account": parseFloat(resellerPricing.van_verification),
                        "vpa": parseFloat(resellerPricing.vpa_verification)
                    },
                },
                "settings": {
                    "daily_trans_count": parseFloat(resellerPricing.daily_trans_count),
                    "daily_trans_volume": parseFloat(resellerPricing.daily_trans_volume),
                    "per_trans_volume": parseFloat(resellerPricing.per_trans_volume),
                    "max_beneficiary": parseFloat(resellerPricing.max_beneficiary)
                }
            }
        setLoading(true)
        ApiGateway.post(`/payout/admin/add-setting`, data, function (response) {
            if (response.success) {
                setLoading(false)
                applyToast(response.message, 'success');
                
            } else {
                setLoading(false)
                applyToast(response.message, 'error');

            }
        })
    }

    const calculationTypeChange = (name, e) => {
        dispatch(updateState(userConstants.RESELLER_PRICING,
            {
                [name]: e
            }
        ))
    }
    const ToggleEvent = (id) => {
        const validKeys = ["banking_service", "upi_service", "virtual_account", "settings_section"];
        if (validKeys.includes(id)) {
            dispatch(updateState(userConstants.RESELLER_PRICING, {
                [id]: !resellerPricing[id]
            }));
        }
    };
    const handlePartialChange = (id)=>{
       
        dispatch(updateState(userConstants.RESELLER_PRICING, {
       partial_invoice: id
        }));
    }
    return (
        <>
            {resellerPricing.reRender &&
                <div className="content_wrapper dash_wrapper">
                    {loading && <Loader/>}
                    <div className="dash_merchent_welcome">
                        <div className="merchent_wlcome_content">Reseller Pricing <div className="bread_crumb">
                  <ul className="breadcrumb">
                  <li ><Link to="/dashboard" className="inactive_breadcrumb">Home</Link></li>
                  <li className="inactive_breadcrumb">Reseller</li>
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

                                    <div className={`col-xs-12 p-0 ${resellerPricing.banking_service ? "" : "content"}`}>
                                        <div className="col-xs-12 col-sm-6 col-md-6 ">
                                            <div className="sub_heading">NEFT Fund Transfer</div>
                                            <div className="col-md-12 col-sm-12 col-xs-12 m-t-10 form-refrance-cls">
                                                <table className="upi_table">
                                                    <thead>
                                                        <tr>
                                                            <th>Price Range</th>
                                                            <th><div className="row commission-row">
                                                                <div className="col-md-4 m-l-30">Fixed Commission</div>
                                                                <div className="col-md-5 m-l-41">Percentage Commission</div>
                                                                </div></th>
                                                        </tr>
                                                    </thead>
                                                    <tr>
                                                        <td><span className="heading_table">1 - 1000</span></td>
                                                        <td>
                                                           <div className="commission-row">
                                                           <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_neft" value={resellerPricing.settings_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_neft" value={resellerPricing.percent_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                           </div>
                                                        </td>
                                                       {/*  <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_neft" value={resellerPricing.settings_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                    <tr>
                                                        <td><span className="heading_table">1001 - 10000</span></td>
                                                        <td>
                                                            <div className="commission-row">
                                                            <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great1_neft" value={resellerPricing.settings_great1_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great1_neft" value={resellerPricing.percent_great1_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                            
                                                        </td>
                                                       {/*  <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_great1_neft" value={resellerPricing.settings_great1_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                    <tr>
                                                        <td><span className="heading_table">10001 -25000</span></td>
                                                        <td>
                                                            <div className="commission-row">
                                                            <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great10_neft" value={resellerPricing.settings_great10_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great10_neft" value={resellerPricing.percent_great10_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                           
                                                        </td>
                                                       {/*  <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_great10_neft" value={resellerPricing.settings_great10_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                    <tr>
                                                        <td><span className="heading_table">Above 25000</span></td>
                                                        <td>
                                                            <div className="commission-row">
                                                            <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great25_neft" value={resellerPricing.settings_great25_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great25_neft" value={resellerPricing.percent_great25_neft}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                            
                                                        </td>
                                                       {/*  <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_great25_neft" value={resellerPricing.settings_great25_neft}
                                                                    onChange={handleChange} type="text" />
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
                                                    <thead>
                                                        <tr>
                                                            <th>Price Range</th>
                                                            <th><div className="row commission-row">
                                                                <div className="col-md-4 m-l-30">Fixed Commission</div>
                                                                <div className="col-md-5 m-l-41">Percentage Commission</div>
                                                                </div></th>
                                                        </tr>
                                                    </thead>
                                                    <tr>
                                                        <td><span className="heading_table">1 - 1000</span></td>
                                                        <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_imps" value={resellerPricing.settings_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                  
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_imps" value={resellerPricing.percent_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                  
                                                            </div>
                                                        </div>

                                                            
                                                        </td>
                                                       {/*  <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_imps" value={resellerPricing.settings_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                    <tr>
                                                        <td><span className="heading_table">1001 - 10000</span></td>
                                                        <td>

                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great1_imps" value={resellerPricing.settings_great1_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great1_imps" value={resellerPricing.percent_great1_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                        </div>
                                                           
                                                        </td>
    {/*                                                     <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_great1_imps" value={resellerPricing.settings_great1_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                    <tr>
                                                        <td><span className="heading_table">10001 -25000</span></td>
                                                        <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great10_imps" value={resellerPricing.settings_great10_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great10_imps" value={resellerPricing.percent_great10_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                         
                                                        </td>
                                                        {/* <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_great10_imps" value={resellerPricing.settings_great10_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                    <tr>
                                                        <td><span className="heading_table">Above 25000</span></td>
                                                        <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great25_imps" value={resellerPricing.settings_great25_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great25_imps" value={resellerPricing.percent_great25_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                           
                                                        </td>
                                                        {/* <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_great25_imps" value={resellerPricing.settings_great25_imps}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-sm-6 col-md-6 ">
                                            <div className="sub_heading">UPI Fund Transfer</div>
                                            <div className="col-md-12 col-sm-12 col-xs-12  m-t-10 form-refrance-cls">
                                                <table className="upi_table">
                                                    <thead>
                                                        <tr>
                                                            <th>Price Range</th>
                                                            <th><div className="row commission-row">
                                                            <div className="col-md-4 m-l-30">Fixed Commission</div>
                                                                <div className="col-md-5 m-l-41">Percentage Commission</div>
                                                                </div></th>
                                                        </tr>
                                                    </thead>
                                                    <tr>
                                                        <td><span className="heading_table">1 - 1000</span></td>
                                                        <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_upi" value={resellerPricing.settings_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_upi" value={resellerPricing.percent_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                            
                                                        </td>
                                                       {/*  <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_upi" value={resellerPricing.settings_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                    <tr>
                                                        <td><span className="heading_table">1001 - 10000</span></td>
                                                        <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great1_upi" value={resellerPricing.settings_great1_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great1_upi" value={resellerPricing.percent_great1_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                            
                                                        </td>
                                                       {/*  <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_great1_upi" value={resellerPricing.settings_great1_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                    <tr>
                                                        <td><span className="heading_table">10001 -25000</span></td>
                                                        <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great10_upi" value={resellerPricing.settings_great10_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great10_upi" value={resellerPricing.percent_great10_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                            
                                                        </td>
                                                       {/*  <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_great10_upi" value={resellerPricing.settings_great10_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                    <tr>
                                                        <td><span className="heading_table">Above 25000</span></td>
                                                        <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_great25_upi" value={resellerPricing.settings_great25_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_great25_upi" value={resellerPricing.percent_great25_upi}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                            
                                                        </td>
                                                       {/*  <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_great25_upi" value={resellerPricing.settings_great25_upi}
                                                                    onChange={handleChange} type="text" />
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
                                                    <thead>
                                                        <tr>
                                                            <th>Price Range</th>
                                                            <th><div className="row commission-row">
                                                                <div className="col-md-4 m-l-30">Fixed Commission</div>
                                                                <div className="col-md-5 m-l-41">Percentage Commission</div>
                                                                </div></th>
                                                        </tr>
                                                    </thead>
                                                    <tr>
                                                        <td><span className="heading_table">Above 2 Lakhs</span></td>
                                                        <td>
                                                        <div className="commission-row">
                                                        <div className="input-group commission-row-input m-l-30">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="settings_rtgs" value={resellerPricing.settings_rtgs}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                            <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                                                            <div className="input-group commission-row-input">
                                                                <input className="form-control commission-row-input-group" placeholder="" name="percent_rtgs" value={resellerPricing.percent_rtgs}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                                                            </div>
                                                            </div>
                                                           
                                                        </td>
                                                        {/* <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_rtgs" value={resellerPricing.settings_rtgs}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                    {/* <tr>
                                                        <td><span className="heading_table">1001 - 10000</span></td>
                                                        <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_great1_rtgs" value={resellerPricing.settings_great1_rtgs}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><span className="heading_table">10001 -25000</span></td>
                                                        <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_great10_rtgs" value={resellerPricing.settings_great10_rtgs}
                                                                    onChange={handleChange} type="text" />
                                                                <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><span className="heading_table">Above 25000</span></td>
                                                        <td>
                                                            <div className="input-group">
                                                                <input className="form-control" placeholder="" name="settings_great25_rtgs" value={resellerPricing.settings_great25_rtgs}
                                                                    onChange={handleChange} type="text" />
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
                                    <div className={`col-xs-12 col-sm-6 col-md-4  ${resellerPricing.upi_service ? "" : "content"}`}>
                                            <div className="sub_heading">UPI Services</div>
                                            <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                                <div className="form-group clearfix form-refrance-cls">
                                                    <div className="col-md-4 col-sm-6 col-xs-12 control-label ">UPI ID Creation</div>
                                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-group">
                                                            <input className="form-control" name="vpa_creation" placeholder=""
                                                                value={resellerPricing.vpa_creation}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon">
                                                                <Switch
                                                                    checked={resellerPricing.vpa_creation_type}
                                                                    onChange={(e) => calculationTypeChange('vpa_creation_type', e)}
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
                                                                value={resellerPricing.vpa_collection}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon">
                                                                <Switch
                                                                    checked={resellerPricing.vpa_collection_type}
                                                                    onChange={(e) => calculationTypeChange('vpa_collection_type', e)}
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
                                                                value={resellerPricing.vpa_verification}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="col-xs-12 pricing_head_sec m-t-10 pointer-cursor" onClick={()=>ToggleEvent("virtual_account")}><div className="pricing_head">Virtual Account</div>
                                        <div className="expand_sign">+</div></div>
                                        <div className={`col-xs-12 col-sm-6 col-md-4 ${resellerPricing.virtual_account ? "" : "content"}`}>
                                            <div className="sub_heading">Virtual Account</div>
                                            <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                                <div className="form-group clearfix form-refrance-cls">
                                                    <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Create VAN</div>
                                                    <div className=" col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-group">
                                                            <input className="form-control" name="van_creation" placeholder=""
                                                                value={resellerPricing.van_creation}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon">
                                                                <Switch
                                                                    checked={resellerPricing.van_creation_type}
                                                                    onChange={(e) => calculationTypeChange('van_creation_type', e)}
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
                                                                value={resellerPricing.van_collection}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon">
                                                                <Switch
                                                                    checked={resellerPricing.van_collection_type}
                                                                    onChange={(e) => calculationTypeChange('van_collection_type', e)}
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
                                                                value={resellerPricing.van_verification}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xs-12 pricing_head_sec m-t-10 pointer-cursor" onClick={()=>ToggleEvent("settings_section")}><div className="pricing_head">Settings</div>
                                        <div className="expand_sign">+</div></div>
                                        <div className={`col-xs-12 col-sm-6 col-md-4 ${resellerPricing.settings_section ? "" : "content"}`}>
                                            <div className="sub_heading">Settings</div>
                                            <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                                <div className="form-group clearfix form-refrance-cls">
                                                    <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Daily Transaction Count</div>
                                                    <div className=" col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-group">
                                                            <input className="form-control" name="daily_trans_count" placeholder=""
                                                                value={resellerPricing.daily_trans_count}
                                                                onChange={handleChange}
                                                                type="text" />

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
                                                                value={resellerPricing.daily_trans_volume}
                                                                onChange={handleChange}
                                                                type="text" />
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
                                                                value={resellerPricing.per_trans_volume}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                                <div className="form-group clearfix form-refrance-cls">
                                                    <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Max. Beneficiary</div>
                                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-group">
                                                            <input className="form-control" name="max_beneficiary" placeholder=""
                                                                value={resellerPricing.max_beneficiary}
                                                                onChange={handleChange}
                                                                type="text" />

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                         {/*    <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                        <div className="form-group clearfix form-refrance-cls">
                                            <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Partial Invoice</div>
                                            <div className=" col-md-6 col-sm-6 col-xs-12">
                                            <Switch
                                checked={
                                    admin_pricing?.partial_invoice 
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
                                
                              /> 
                                            </div>	
                                           
                                        </div>
                                    </div> */}
                                        </div>
                                    <div className="col-xs-12 p-0">
                                     {/*    <div className="col-xs-12 col-sm-6 col-md-4 ">
                                            <div className="sub_heading">UPI Services</div>
                                            <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                                <div className="form-group clearfix form-refrance-cls">
                                                    <div className="col-md-4 col-sm-6 col-xs-12 control-label ">UPI ID Creation</div>
                                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-group">
                                                            <input className="form-control" name="vpa_creation" placeholder=""
                                                                value={resellerPricing.vpa_creation}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon">
                                                                <Switch
                                                                    checked={resellerPricing.vpa_creation_type}
                                                                    onChange={(e) => calculationTypeChange('vpa_creation_type', e)}
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
                                                                value={resellerPricing.vpa_collection}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon">
                                                                <Switch
                                                                    checked={resellerPricing.vpa_collection_type}
                                                                    onChange={(e) => calculationTypeChange('vpa_collection_type', e)}
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
                                                                value={resellerPricing.vpa_verification}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                      {/*   <div className="col-xs-12 col-sm-6 col-md-4 p-l-0">
                                            <div className="sub_heading">Virtual Account</div>
                                            <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                                <div className="form-group clearfix form-refrance-cls">
                                                    <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Create VAN</div>
                                                    <div className=" col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-group">
                                                            <input className="form-control" name="van_creation" placeholder=""
                                                                value={resellerPricing.van_creation}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon">
                                                                <Switch
                                                                    checked={resellerPricing.van_creation_type}
                                                                    onChange={(e) => calculationTypeChange('van_creation_type', e)}
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
                                                                value={resellerPricing.van_collection}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon">
                                                                <Switch
                                                                    checked={resellerPricing.van_collection_type}
                                                                    onChange={(e) => calculationTypeChange('van_collection_type', e)}
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
                                                                value={resellerPricing.van_verification}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                     {/*    <div className="col-xs-12 col-sm-6 col-md-4 p-l-0">
                                            <div className="sub_heading">Settings</div>
                                            <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                                <div className="form-group clearfix form-refrance-cls">
                                                    <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Daily Transaction Count</div>
                                                    <div className=" col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-group">
                                                            <input className="form-control" name="daily_trans_count" placeholder=""
                                                                value={resellerPricing.daily_trans_count}
                                                                onChange={handleChange}
                                                                type="text" />

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
                                                                value={resellerPricing.daily_trans_volume}
                                                                onChange={handleChange}
                                                                type="text" />
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
                                                                value={resellerPricing.per_trans_volume}
                                                                onChange={handleChange}
                                                                type="text" />
                                                            <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                                                <div className="form-group clearfix form-refrance-cls">
                                                    <div className="col-md-4 col-sm-6 col-xs-12 control-label ">Max. Beneficiary</div>
                                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-group">
                                                            <input className="form-control" name="max_beneficiary" placeholder=""
                                                                value={resellerPricing.max_beneficiary}
                                                                onChange={handleChange}
                                                                type="text" />

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                    {setDefaultPricing && <div className="col-xs-12">
                                        <div className="col-xs-12 m-t-40 text-center">
                                            <button className="submitBtn m-r-10" onClick={() => updateSetting()}>Submit</button>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}


export default DefaultResellerPricing;
