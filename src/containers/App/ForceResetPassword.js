import React, { useState } from "react";
import { API_ENDPOINTS_KEYS } from "../../Services/globalvariables";
import useApiCall from "../../Services/ApiService";
import { logo } from "../../utils/ImageExport";
import { Cookies, useCookies } from "react-cookie";
import Eye from "../../assets/images/eye_close.png";
import CommonLoader from "../../utils/CommonLoader";
import { toast } from "react-toastify";
import { showFailure } from "../../utils";
import { useSelector } from "react-redux";
import Loading from "../../Components/Global/LottieLoader";
import CloseEye from "../../assets/images/eye_close_icon.svg";
import OpenEye from "../../assets/images/eye_icon.svg";

const ForceResetPassword = () => {
  const merchantState = useSelector((state) => state?.merchantState);
  const { auth } = useSelector((state) => state);

  const ApiGateway = useApiCall();
  const [isLoading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies([
    "CsrfToken",
    "MerchantAuthJWT",
  ]);
  const [state, setState] = useState({
    current_password: "",
    confirm_password: "",
    new_password: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    removeCookie("CsrfToken", { path: "/" });
    removeCookie("MerchantAuthJWT", { path: "/" });
    window.location.reload();
  };
  const resetPassword = () => {
    const { current_password, new_password, confirm_password } = state;
    const lowerUpperRegex = /^(?=.*[a-z])(?=.*[A-Z])/;
    const numberRegex = /^(?=.*[0-9])/;
    const specialRegex = /^(?=.*[!@#$%^&*])/;

    if (!current_password) {
      toast.error("Please enter a Current Password");
      return;
    }
    if (!new_password) {
      toast.error("Please enter a New Password");
      return;
    }
    if (!confirm_password) {
      toast.error("Please enter a Confirm Password");
      return;
    }
    if (new_password !== confirm_password) {
      toast.error("New Password and Confirm Password do not match");
      return;
    }
    if (new_password.length < 8) {
      toast.error("Password should be at least 8 characters");
      return;
    }
    if (!lowerUpperRegex.test(new_password)) {
      toast.error(
        "Password should have at least one lowercase and one uppercase letter"
      );
      return;
    }
    if (!numberRegex.test(new_password)) {
      toast.error("Password should have at least one number");
      return;
    }
    if (!specialRegex.test(new_password)) {
      toast.error(
        "Password should have at least one special character (!@#$%^&*)"
      );
      return;
    }

    const data = {
      current_password,
      new_password,
      email: merchantState?.profile?.merchant?.email,
    };
    setLoading(true);

    ApiGateway.patch(
      API_ENDPOINTS_KEYS.MERCHANT_CHANGE_PASSWORD,
      data,
      (response) => {
        setLoading(false);
        if (response.success) {
          toast.success("Password changed successfully!");

          setState((prevState) => ({
            ...prevState,
            current_password: "",
            new_password: "",
            confirm_password: "",
          }));
          setTimeout(() => {
            handleLogout();
            window.location.reload();
          }, 1000);
        } else {
          showFailure(response);
        }
      }
    );
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return isLoading ? (
    <Loading lottieKey="LoaderIcon" />
  ) : (
    <div className="login-container">
      <div className="login-box text-center">
        <div className="m-t-24"></div>
        <div className="text-center">Reset Password</div>
        <div className="m-t-24"></div>

        <div className="from_wrapper eyeimage">
          <label>Enter Current Password:</label>
          <input
            type={auth.showPassword ? "text" : "password"}
            placeholder="Enter your current password"
            className="form-control"
            name="password"
            value={auth.password}
            onChange={handleChange}
            // onKeyDown={handleKeyPress}
          />
        </div>
        <div className="eye" 
        // onClick={handleShowPassword}
        >
          {auth.showPassword === false ? (
            <img src={CloseEye} alt="eye" />
          ) : (
            <img src={OpenEye} alt="eye" />
          )}
        </div>
        <div className="m-t-24"></div>
        <div className="reset_password_label">
          <label class="text-start d-block"> Enter New Password </label>
          <input
            type={showPassword.new ? "text" : "password"}
            name="new_password"
            value={state.new_password}
            id="new_password"
            onChange={handleChange}
            className="form-control m-t-10"
            placeholder="Enter New Password"
            maxLength={18}
          />
          <div
            className="reset_password_eye"
            onClick={() => togglePasswordVisibility("new")}
          >
            <img src={showPassword.new ? Eye : Eye} alt="eye" />
          </div>
        </div>
        <div className="m-t-24"></div>
        <div className="reset_password_label">
          <label class="text-start d-block">Confirm Password</label>
          <input
            type={showPassword.confirm ? "text" : "password"}
            name="confirm_password"
            value={state.confirm_password}
            id="confirm_password"
            onChange={handleChange}
            className="form-control m-t-10"
            placeholder="Enter Confirm Password"
            maxLength={18}
          />
          <div
            className="reset_password_eye"
            onClick={() => togglePasswordVisibility("confirm")}
          >
            <img src={showPassword.confirm ? Eye : Eye} alt="eye" />
          </div>
        </div>
        <button
          type="button"
          className="submit-btn m-t-15"
          onClick={resetPassword}
        >
          Submit
        </button>
        <div className="m-t-24 reset-back" onClick={handleLogout}>
          Back
        </div>
      </div>
    </div>
  );
};
export default ForceResetPassword;
