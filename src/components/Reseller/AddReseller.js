import React, { useEffect, useState } from "react";
import OpenEye from "../../assets/images/eye_icon.svg";
import CloseEye from "../../assets/images/eye_close_icon.svg";
import { useToasts } from "react-toast-notifications";
import { escape, validate } from "../../DataServices/Utils";
import ApiGateway from "../../DataServices/DataServices";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import Loader from "../Loader";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import useRouteExist from "../../DataServices/useRouteExist";
import useRouteAllExist from "../../DataServices/useRouteAllExist";

function AddReseller() {
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
    referralCode: "",
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
  const addReseller = () => {
    var eRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const paswd =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!state.fullname) {
      applyToast("Please Enter Full Name", "info");
    } else if (!state.contactNo) {
      applyToast("Please Enter Contact Number", "info");
    } else if (state.contactNo.length !== 10) {
      applyToast("Please Enter Contact Number", "info");
    } else if (!state.email || !eRegex.test(state.email)) {
      applyToast("Please Enter Valid Email", "info");
    } else if (!state.referralCode) {
      applyToast("Please Enter referral code");
    } else if (state.referralCode.length < 4 || state.referralCode.length > 6) {
      applyToast(
        "Referral code should contain between 4 and 6 digits.",
        "info"
      );
    } else {
      dispatch(updateState(userConstants.LOADER, { loading: false }));

      let data = {
        reseller_name: escape(state.fullname),
        business_name: escape(state.businessName),
        email: state.email,
        phone: {
          national_number: parseInt(state.contactNo),
          code: "+91",
        },
        referral_code: state.referralCode,
      };
      console.log(data);

      // return;

      ApiGateway.post("/payout/admin/reseller/create", data, (response) => {
        if (response.success) {
          dispatch(updateState(userConstants.LOADER, { loading: true }));
          applyToast(response.message, "success");
          setTimeout(() => {
            window.location.href = "/reseller";
          }, 1000);
        } else {
          dispatch(updateState(userConstants.LOADER, { loading: true }));
          applyToast(response.message, "error");
        }
      });
    }
  };
  console.log(state.referralCode);

  return (
    <>
      <div className="content_wrapper dash_wrapper">
        
        {!loading.loading && <Loader />}
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content add-user">
            Add Reseller{" "}
            <div className="bread_crumb">
              <ul className="breadcrumb">
                <li>
                  <Link to="/dashboard" className="inactive_breadcrumb">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/reseller" className="inactive_breadcrumb">
                    Reseller
                  </Link>
                </li>
                <li className="active_breadcrumb">Add Reseller</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-xs-12 bg-white">
          <div className="white_tab_wrap">
            <div className="white_tab_box">
              <div className="clearfix">
                <ul className="nav nav-tabs customized_tab m-b-20">
                  <li className="page_title">Reseller Details</li>
                </ul>
                <div className="form-group clearfix form-refrance-cls">
                  <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
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
                    Business Name :
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
                    Referral Code <span className="text-danger">*</span>:
                  </div>
                  <div className="col-sm-5">
                    <input
                      type="text" // ⚡ use text instead of number to have full control
                      name="referralCode"
                      className="form-control"
                      id="referralCode"
                      placeholder="Enter Referral Code"
                      value={state.referralCode}
                      onChange={(e) => {
                        const value = e.target.value;
                        // allow only digits, max 6
                        if (/^\d{0,6}$/.test(value)) {
                          setState((prev) => ({
                            ...prev,
                            referralCode: value,
                          }));
                        }
                      }}
                      onKeyDown={(e) => {
                        // restrict unwanted keys
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <span className="m-t-5" style={{ display: "block" }}>
                      Referral code should contain between 4 and 6 digits.
                    </span>
                  </div>
                </div>

                <div className="col-md-12 text-center">
                  <div className="col-md-8">
                    <button className="submitBtn" onClick={addReseller}>
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

export default AddReseller;
