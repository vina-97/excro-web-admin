import React, { useEffect, useState } from "react";
import OpenEye from "../../assets/images/eye_icon.svg";
import CloseEye from "../../assets/images/eye_close_icon.svg";
import { useToasts } from "react-toast-notifications";
import { escape, manipulateString, validate } from "../../DataServices/Utils";
import ApiGateway from "../../DataServices/DataServices";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import Loader from "../Loader";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Select from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
function AddMerchant() {
  const { loading } = useSelector((state) => state);
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateState(userConstants.LOADER, { loading: true }));
  }, []);
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  const [state, setState] = useState({
    fullname: "",
    businessName: "",
    contactNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: true,
    reseller_id:"",
    searchTerm:""
  });
  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleShowPassword = (id) => {
    if (id == "showpassword") {
      setState((prevState) => ({
        ...prevState,
        showPassword: !state.showPassword,
      }));
    } else if (id == "confirmPassword") {
      setState((prevState) => ({
        ...prevState,
        showConfirmPassword: !state.showConfirmPassword,
      }));
    }
  };

    const getAllResller = async (searchQuery, loadedOptions, { page }) => {
        return new Promise((resolve, reject) => {
                    let queryParam = "";
                    queryParam += !searchQuery ? ""  : `&search_term=${searchQuery}`;
                    ApiGateway.get(`/payout/admin/reseller/list?page=${page}&limit=10&status=active${queryParam}`, function (response) {
                if (response) {                 
                 
                    resolve({
                        options: response.data.resellers,
                        hasMore: response.data.resellers.length >= 10,
                        additional: {
                            page: searchQuery ? 2 : page + 1,
                        },
                    });
                } else {
                    reject(response);
                }
            });
        });}
        const selectResellerFilter = (e) =>{
          setState((prevState) => ({
            ...prevState,
            reseller_id: e.reseller_id,
            reseller_name: e,
          }));
         
        }
  const addMerchant = () => {
    var eRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const paswd =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!state.fullname) {
      applyToast("Please Enter Full Name", "info");
    } else if (!state.businessName) {
      applyToast("Please Enter Business Name", "info");
    } else if (!state.contactNo) {
      applyToast("Please Enter Contact Number", "info");
    } else if (state.contactNo.length !== 10) {
      applyToast("Please Enter Contact Number", "info");
    } else if (!state.email || !eRegex.test(state.email)) {
      applyToast("Please Enter Valid Email", "info");
    } else if (!paswd.test(state.password)) {
      applyToast(
        "Password must be aleast one lowercase letter, one uppercase letter, one numeric digit, and one special character",
        "error"
      );
    } else {
      // dispatch(updateState(userConstants.LOADER, { loading: false }));
      let data = {
        email: state.email,
        password: state.password,
        phone: {
          number: parseInt(state.contactNo),
          code: "+91",
        },
        fullName: escape(state.fullname),
        businessName: escape(state.businessName),
        
      };
      if (state.reseller_id) {
        data.reseller_id = state.reseller_id;
      }
  
      ApiGateway.post("/payout/admin/add-merchant", data, (response) => {
        if (response.success) {
          dispatch(updateState(userConstants.LOADER, { loading: true }));
          applyToast(response.message, "success");

          setTimeout(()=>{
            window.location.href = "/merchant";
          },1000)
        } else {
          dispatch(updateState(userConstants.LOADER, { loading: true }));
          applyToast(response.message, "error");
        }
      });
    }
  };

  return (

      <>
        <div className="content_wrapper dash_wrapper">
          {!loading.loading && <Loader />}
          <div className="dash_merchent_welcome">
            <div className="merchent_wlcome_content add-user">Add Merchant <div className="bread_crumb">
                  <ul className="breadcrumb">
                  <li ><Link to="/dashboard" className="inactive_breadcrumb">Home</Link></li>
                  <li ><Link to="/merchant" className="inactive_breadcrumb">Merchant</Link></li>
                  <li className="active_breadcrumb">Add Merchant</li>
              
                  </ul>
                  </div>
                  </div>
          </div>
          <div className="col-xs-12 bg-white">
            <div className="white_tab_wrap">
              <div className="white_tab_box">
                <div className="clearfix">
                  <ul className="nav nav-tabs customized_tab m-b-20">
                    <li className="page_title">Merchant Details</li>
                  </ul>
                  <div className="form-group clearfix form-refrance-cls">
                    <div className="col-md-2 col-sm-3 col-xs-12 control-label">
                      Full Name <span className="text-danger">*</span>:
                    </div>
                    <div className="col-sm-5">
                      <input
                        type="text"
                        name="fullname"
                        className="form-control"
                        id="fullname"
                        placeholder="Enter Full Name"
                        value={state.fullname}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group clearfix form-refrance-cls">
                    <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                      Business Name <span className="text-danger">*</span>:
                    </div>
                    <div className="col-sm-5">
                      <input
                        type="text"
                        name="businessName"
                        className="form-control"
                        id="businessName"
                        placeholder="Enter Business Name"
                        value={state.businessName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group clearfix form-refrance-cls">
                    <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                      Contact No <span className="text-danger">*</span>:
                    </div>
                    <div className="col-sm-5">
                      <input
                        type="text"
                        name="contactNo"
                        className="form-control"
                        id="contactNo"
                        placeholder="Enter Contact No"
                        value={state.contactNo}
                        onChange={handleChange}
                        maxLength={10}
                        onKeyPress={validate}
                      />
                    </div>
                  </div>
                  <div className="form-group clearfix form-refrance-cls">
                    <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                      Email <span className="text-danger">*</span>:
                    </div>
                    <div className="col-sm-5">
                      <input
                        type="text"
                        name="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter Email"
                        value={state.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group clearfix form-refrance-cls">
                    <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                      Source From:
                    </div>
                    <div className="col-sm-5">
                    <AsyncPaginate
                                        loadOptions={getAllResller}
                                        getOptionValue={(option) => option?.reseller_id}
                                        getOptionLabel={(option) => option?.reseller_name}
                                        onChange={(e) => selectResellerFilter(e)}   
                                        isSearchable={true}
                                        placeholder="Select Reseller"
                                        additional={{
                                            page: 1,
                                        }}
                                        classNamePrefix={"react-select"}
                                        value={
                                            state.reseller_name !== undefined &&
                                            state.reseller_name
                                          }
                                             
                                    />
                    </div>
                  </div>
                  <div className="form-group clearfix form-refrance-cls">
                    <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                      Password <span className="text-danger">*</span>:
                    </div>
                    <div className="col-sm-5 position-relative">
                      <input
                        type={state.showPassword ? "text" : "password"}
                        name="password"
                        className="form-control password-text"
                        id="password"
                        placeholder="Enter Password"
                        value={state.password}
                        onChange={handleChange}
                      />
                      <div
                        className="show-eye"
                        onClick={() => handleShowPassword("showpassword")}
                      >
                        {state.showPassword === false ? (
                          <img src={CloseEye} className="inner_eye" />
                        ) : (
                          <img src={OpenEye} className="inner_eye" />
                        )}
                      </div>
                      <div className="prefix_hint">
                        Your password must be at least 8 characters long at
                        least with 1 capital letter,1 numeric ,1 special
                        character and 1 small number.
                      </div>
                    </div>
                  </div>
                  <div className="form-group clearfix  form-refrance-cls">
                    <div className="col-md-2 col-sm-3 col-xs-12 control-label">
                      Confirm Password <span className="text-danger">*</span>:
                    </div>
                    <div className="col-sm-5 position-relative">
                      <input
                        type={state.showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="form-control password-text"
                        id="confirmPassword"
                        placeholder="Enter Confirm Password"
                        value={state.confirmPassword}
                        onChange={handleChange}
                      />
                      <div
                        className="show-eye"
                        onClick={() => handleShowPassword("confirmPassword")}
                      >
                        {state.showConfirmPassword === false ? (
                          <img src={CloseEye} className="inner_eye" />
                        ) : (
                          <img src={OpenEye} className="inner_eye" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12 text-center">
                    <div className="col-md-8">
                      <button className="submitBtn" onClick={addMerchant}>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>

  );
}

export default AddMerchant;
