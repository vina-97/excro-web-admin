import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import { ToastProvider, useToasts } from "react-toast-notifications";
import ApiGateway from "../.././DataServices/DataServices";
import {
  validate,
  saveUserShowHome,
  setCookie,
  getCookie,
} from "../.././DataServices/Utils";
import Condition from "./Condition";
import { Redirect, Route, Switch, BrowserRouter } from "react-router-dom";
import CloseEye from "../../assets/images/eye_close_icon.svg";
import OpenEye from "../../assets/images/eye_icon.svg";

var isLogin = Condition();

const SignIn = (props) => {
  //Getting state from store
  const { auth } = useSelector((state) => state);
  const resellerLogin = getCookie("UserType");
  //Dispatch to reducer
  const dispatch = useDispatch();

  //Notification message
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };

  const [showScreen, SetShowScreen] = useState("login");

  const stateChanges = (payload) => {
    return { type: userConstants.REGISTER_REQUEST, payload };
  };

  const handleChange = (e) => {
    dispatch(stateChanges({ [e.target.name]: e.target.value }));
  };
  const loginUserWithOtp = () => {
    if (!auth.username) {
      applyToast("Please enter user name", "error");
    } else if (!auth.password) {
      applyToast("Please enter password", "error");
    } else {
      const data = {
        email: auth.username,
        password: auth.password,
        otp: auth.otp,
      };

      ApiGateway.post("/payout/admin/verify-otp", data, function (response) {
        if (response.success) {
          saveUserShowHome(response, "from_signin");
        } else {
          applyToast(response.message, "error");
        }
      });
    }
  };
  const loginUser = () => {
    if (!auth.username) {
      applyToast("Please enter user name", "error");
    } else if (!auth.password) {
      applyToast("Please enter password", "error");
    } else {
      const data = {
        email: auth.username,
        password: auth.password,
      };

      ApiGateway.post("/payout/admin/auth/login", data, function (response) {
        if (response.success) {
          setCookie("UserType", response?.data?.userRoleCode);
          if (response.data.twofaStatus === "active") {
            dispatch(stateChanges({ showOtpScreen: true }));
          } else if (
            response.data?.isPasswordReset === false &&
            response.data?.authorization
          ) {
            applyToast(response.message, "success");
            SetShowScreen("verify_otp");
          } else {
            saveUserShowHome(response, "from_signin");
            applyToast(response.message, "success");
          }
        } else {
          applyToast(response.message, "error");
        }
      });
    }
  };
  const { match, location } = props;
  if (location.pathname === "/signin") {
    if (isLogin) {
      if (resellerLogin === "RESELLER") {
        return <Redirect to={"/merchant"} />;
      } else {
        return <Redirect to={"/dashboard"} />;
      }
    }
  }
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      loginUser();
      // loginUserWithOtp();
    }
  };
  const handleShowPassword = () => {
    dispatch(stateChanges({ showPassword: !auth.showPassword }));
  };
  const handleShowEmailOtp = () => {
    dispatch(stateChanges({ showEmailOtp: !auth.showEmailOtp }));
  };
  const handleShowNewPassword = () => {
    dispatch(stateChanges({ shownewPassword: !auth.shownewPassword }));
  };

  const handleShowConfirmPassword = () => {
    dispatch(stateChanges({ showconfirmPassword: !auth.showconfirmPassword }));
  };

  const sendEmailOtp = () => {
    if (!auth.useremail.match(/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
      applyToast("Please enter valid email", "error");
    } else {
      const data = {
        email: auth.useremail,
      };

      ApiGateway.post(
        "/payout/admin/auth/forget-password",
        data,
        function (response) {
          if (response.success) {
            applyToast(response.message, "success");
            SetShowScreen("verify_otp");
          } else {
            applyToast(response.message, "error");
          }
        }
      );
    }
  };

  const verifyOtp = () => {
    let eRegex = /^[0-9]*$/;
    if (!auth.otp || !eRegex.test(auth.otp)) {
      applyToast("Please enter valid otp", "error");
    } else {
      const data = {
        email: auth.username,
        otp: auth.otp,
      };
      ApiGateway.post(
        "/payout/admin/auth/verify-otp",
        data,
        function (response) {
          if (response.success) {
            applyToast(response.message, "success");
            SetShowScreen("create_password");
            dispatch(stateChanges({ api_token: response?.data?.token }));
          } else {
            applyToast(response.message, "error");
          }
        }
      );
    }
  };

  const createNewPassword = () => {
    let eRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!auth.newPassword) {
      applyToast("Please enter password", "error");
    } else if (!eRegex.test(auth.newPassword)) {
      applyToast(
        "Password should contain at least one uppercase letter, one lowercase letter, and one number. ",
        "error"
      );
    } else if (!auth.confirmPassword) {
      applyToast("Confirm Password shoudn't be empty", "error");
    } else if (auth.newPassword !== auth.confirmPassword) {
      applyToast("Password Mismatched", "error");
    } else {
      const data = {
        email: auth.username,
        token: auth.api_token,
        newPassword: auth.newPassword,
        confirmPassword: auth.confirmPassword,
      };
      ApiGateway.post(
        "/payout/admin/auth/reset-password",
        data,
        function (response) {
          if (response.success) {
            applyToast(response.message, "success");
            dispatch(
              stateChanges({
                username: "",
                password: "",
                newPassword: "",
                confirmPassword: "",
                api_token: "",
              })
            );
            SetShowScreen("login");
          } else {
            applyToast(response.message, "error");
          }
        }
      );
    }
  };

  const handleForgetPassword = (id) => {
    if (id == "verify_email") {
    }
    // else if (id == "verify_email") {
    //   SetShowScreen("verify_email");
    /*  if (!auth.username.match(/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
        applyToast("Please enter valid email", "error");
      } else {
        const data = {
          email: auth.useremail,
        };
        console.log(data, "Datatat")
  
        ApiGateway.post("/payout/admin/auth/forget-password", data, function (response) {
          if (response.success) {
            applyToast(response.message, "success");
            SetShowScreen("verify_otp");
          } else {
            applyToast(response.message, "error");
          }
        });
        console.log("useremail", auth)
      } */

    /*    else if (id == "verify_otp") {
      console.log(id, "verify_otp");
      SetShowScreen("verify_otp");
    } else if (id == "create_password") {
      console.log(id, "create_password");
      SetShowScreen("create_password");
    }  */
  };

  const handleBackLogin = () => {
    dispatch(
      stateChanges({
        username: "",
        password: "",
        otp: "",
        useremail: "",
        newPassword: "",
        confirmPassword: "",
        api_token: "",
      })
    );

    SetShowScreen("login");
  };
  return (
    <>
      <div className="login_body">
        <div className="login_wrapper">
          <div className="center_tab ">
            <div className="center_login p-b-30">
              {showScreen == "login" ? (
                <>
                  <div className="login_title">Admin Login</div>
                  <div className="welcome_back_con">Welcome</div>
                  <>
                    <div className="from_wrapper">
                      <label>Email:</label>
                      <input
                        type="text"
                        placeholder="Enter user name"
                        className="form-control"
                        name="username"
                        value={auth.username}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                    <div className="from_wrapper eyeimage">
                      <label>Enter Password:</label>
                      <input
                        type={auth.showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="form-control"
                        name="password"
                        value={auth.password}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                    <div className="eye" onClick={handleShowPassword}>
                      {auth.showPassword === false ? (
                        <img src={CloseEye} alt="eye" />
                      ) : (
                        <img src={OpenEye} alt="eye" />
                      )}
                    </div>

                    <a
                      className="btn_submit"
                      onClick={loginUser}
                      onKeyDown={handleKeyPress}
                    >
                      Submit
                    </a>
                    {/* <div className="forgot-password">
                        <a className="pink_clr" onClick={() => handleForgetPassword("verify_email")}>
                          Forgot Password
                        </a>
                      </div> */}
                  </>
                </>
              ) : showScreen == "verify_email" ? (
                <>
                  <div className="forgot-title">FORGOT PASSWORD</div>
                  <div className="welcome_back_con">Welcome</div>
                  <div className="from_wrapper">
                    <label>Email:</label>
                    <input
                      type="text"
                      placeholder="Enter user name"
                      className="form-control"
                      name="useremail"
                      onChange={handleChange}
                      onKeyDown={handleKeyPress}
                      value={auth.useremail}
                    />
                  </div>
                  <a
                    className="btn_submit"
                    // onClick={() => handleForgetPassword("verify_otp")}
                    onClick={sendEmailOtp}
                    onKeyDown={handleKeyPress}
                    style={{ marginTop: "20px" }}
                  >
                    Send OTP
                  </a>
                </>
              ) : showScreen == "verify_otp" ? (
                <>
                  <div className="forgot-title">RESET PASSWORD</div>
                  <div className="welcome_back_con">Welcome</div>
                  <div className="from_wrapper eyeimage">
                    <label style={{ marginTop: "10px" }}>OTP:</label>
                    <input
                      type={auth.showEmailOtp ? "text" : "password"}
                      placeholder="Enter OTP"
                      className="form-control eyeimage"
                      onChange={handleChange}
                      onKeyDown={handleKeyPress}
                      value={auth.otp}
                      name="otp"
                      onKeyPress={validate}
                      maxLength={6}
                    />
                  </div>
                  <div className="otp_eye" onClick={handleShowEmailOtp}>
                    {auth.showEmailOtp === false ? (
                      <img src={CloseEye} alt="eye" />
                    ) : (
                      <img src={OpenEye} alt="eye" />
                    )}
                  </div>
                  <div className="otp_flex">
                    <div
                      className="back_to_login"
                      onClick={() => handleBackLogin()}
                    >
                      Back to Login?
                    </div>
                    <div className="resend-otp" onClick={() => loginUser()}>
                      Resend OTP?
                    </div>
                  </div>
                  <a
                    className="btn_submit"
                    // onClick={() => handleForgetPassword("create_password")}
                    onClick={verifyOtp}
                    onKeyDown={handleKeyPress}
                    style={{ marginTop: "20px" }}
                  >
                    Verify OTP
                  </a>
                </>
              ) : showScreen == "create_password" ? (
                <>
                  <div className="forgot-title">RESET PASSWORD</div>
                  <div className="welcome_back_con">Welcome</div>
                  <div className="from_wrapper eyeimage1">
                    <label>Enter New Password:</label>
                    <input
                      type={auth.shownewPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="form-control"
                      name="newPassword"
                      value={auth.newPassword}
                      onChange={handleChange}
                      onKeyDown={handleKeyPress}
                    />
                    <div
                      className="eye-create-password"
                      onClick={handleShowNewPassword}
                    >
                      {auth.shownewPassword === false ? (
                        <img src={CloseEye} alt="eye" />
                      ) : (
                        <img src={OpenEye} alt="eye" />
                      )}
                    </div>
                  </div>

                  <div className="from_wrapper eyeimage2">
                    <label>Confirm Password:</label>
                    <input
                      type={!auth.showconfirmPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="form-control"
                      name="confirmPassword"
                      value={auth.confirmPassword}
                      onChange={handleChange}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                  <div
                    className="eye-confirm-password"
                    onClick={handleShowConfirmPassword}
                  >
                    {auth.showconfirmPassword === false ? (
                      <img src={OpenEye} alt="eye" />
                    ) : (
                      <img src={CloseEye} alt="eye" />
                    )}
                  </div>
                  <div className="otp_flex">
                    <div
                      className="back_to_login"
                      onClick={() => handleBackLogin()}
                    >
                      Back to Login?
                    </div>
                  </div>
                  <a
                    className="btn_submit"
                    // onClick={() => handleForgetPassword("login")}
                    onClick={createNewPassword}
                    onKeyDown={handleKeyPress}
                    style={{ marginTop: "20px" }}
                  >
                    Submit
                  </a>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
