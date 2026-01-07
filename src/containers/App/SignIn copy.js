import React from "react";
import { useHistory , Link  } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { userConstants } from "../../constants/ActionTypes";
import { ToastProvider, useToasts } from 'react-toast-notifications';
import ApiGateway from "../.././DataServices/DataServices";
import {validate,saveUserShowHome} from "../.././DataServices/Utils";
import Condition from './Condition';
import { Redirect, Route, Switch, BrowserRouter } from "react-router-dom";

var isLogin = Condition();

const SignIn = (props) => {
    //Getting state from store
    const {auth} = useSelector(state => state);


    //Dispatch to reducer
    const dispatch = useDispatch();

    //Notification message
    const { addToast } = useToasts();
    const applyToast = (msg,type) => { return addToast(msg, { appearance: type });}

    const stateChanges = (payload) => {

        return { type: userConstants.REGISTER_REQUEST, payload }
    }

    const handleChange = (e) => {
        dispatch(stateChanges( {[e.target.name] : e.target.value }))
    }
    const loginUserWithOtp = () => {
        if(!auth.username){
            applyToast('Please enter user name','error');
        } else if(!auth.password){
            applyToast('Please enter password','error');
        } else {
            const data = {
                "email" : auth.username, 
                "password" : auth.password,
                "otp" : auth.otp
            }


            ApiGateway.post("/admin/auth/login/verify/otp", data, function (response) {
  
                if (response.success) {
                    saveUserShowHome( response, 'from_signin');  
                } else {
                    applyToast(response.message,'error');
                }
            })
        }
    }
    const loginUser = () => {
        if(!auth.username){
            applyToast('Please enter user name','error');
        } else if(!auth.password){
            applyToast('Please enter password','error');
        } else {
            const data = {
                "email" : auth.username , 
                "password" : auth.password
            }

            ApiGateway.post("/admin/auth/login", data, function (response) {

                if (response.success) {
                    saveUserShowHome( response, 'from_signin');  
                } else if ( response.code !== undefined && response.code === "verify_otp" ){
                    dispatch(stateChanges( {showOtpScreen : true }));
                } else {
                    applyToast(response.message,'error');
                }
                
            })
        }
    }
    const {match , location} = props;
    if (location.pathname === '/signin') {
        if (isLogin) {
          return (<Redirect to={'/accountstatement'} />);
        } 
    }
    return (
        <>
            <div className="login_body">
                <div className="login_wrapper">
                    <div className="center_tab ">
                        <div className="center_login p-b-30">
                            <div className="login_title">Login</div>
                            <div className="welcome_back_con">Welcome</div>
                            {auth.showOtpScreen ?
                            <>
                            <div className="from_wrapper">
                                <label>Enter OTP:</label>
                                <input type="text" placeholder="Enter your OTP" className="form-control" name="otp" value={auth.otp} onChange={handleChange}/>
                            </div>
                            <a className="btn_submit" onClick={loginUserWithOtp}>Submit</a>
                            </>
                            :
                            <>
                                <div className="from_wrapper">
                                    <label>Email:</label>
                                    <input type="text" placeholder="Enter user name" className="form-control" name="username" value={auth.username} onChange={handleChange} />
                                </div>
                                <div className="from_wrapper">
                                    <label>Enter Password:</label>
                                    <input type="password" placeholder="Enter your password" className="form-control" name="password" value={auth.password} onChange={handleChange}/>
                                </div>
                                <a className="btn_submit" onClick={loginUser}>Submit</a>
                            </>
                            }
                            
                        </div>                        
                    </div>
                </div>
            </div>
        </>
    )
}


export default SignIn;