import React from "react";
import { imagePath } from '../.././assets/ImagePath';
import { useDispatch, useSelector } from 'react-redux';
import { userConstants } from "../../constants/ActionTypes";
import { ToastProvider, useToasts } from 'react-toast-notifications';
import ApiGateway from "../.././DataServices/DataServices";
import {validate} from "../.././DataServices/Utils";
import { useHistory , Link  } from "react-router-dom";

const SignUp = () => {
    let history = useHistory();

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

    //OnChange method
    const handleChange = (e) => {
        const { name, value } = e.target;
        const payload = {[name] : value}
        dispatch(stateChanges(payload));  
    }

    const handleOnChange = () => {
        var payload = {terms_condition : !auth.terms_condition}
        dispatch(stateChanges(payload ))
    }
    

    const createUser = () => {
        var eRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!auth.full_name){
            applyToast('Please enter full name','error');
        } else if(!auth.business_name){
            applyToast('Please enter business name','error');
        } else if(!auth.phone){
            applyToast('Please enter phone number','error');
        } else if(auth.phone.length !== 10){
            applyToast('Please enter valid phone number','error');
        } else if(!auth.email || !eRegex.test(auth.email)){
            applyToast('Please enter valid email','error');
        } else if(!auth.terms_condition){
            applyToast('Please accept terms and condition','error');
        } else {
            createUserApi();
        }
    }

    const createUserApi = () => {
        const data = {
            "email" : auth.email,
            "phone" :{
                "national_number" : auth.phone
            },
            "business" : {
                "name" : auth.business_name
            },
            "name": {
                "full" : auth.full_name
            }
        }
        ApiGateway.post("/merchant/auth/register", data, function (response) {
            if (response.success) {
                applyToast(response.message,'success');
                dispatch(stateChanges({signup_screen : !auth.signup_screen}));  
            } else {
                applyToast(response.message,'error');
            }
        })
    }

    const setpassword = () => {
        var lowerUpperRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])");
        var numberRegex = new RegExp("^(?=.*[0-9])");
        var specialRegex = new RegExp("^(?=.*[!@#$%^&*])");
        if(!auth.password){
            applyToast('Please enter password','error');
        } else if (auth.password.length < 8) {
            applyToast("password should be atleast 8 characters",'error');
        } else if (!lowerUpperRegex.test(auth.password)) {
            applyToast( "password should have atleast one lowercase and one uppercase","error" );
        } else if (!numberRegex.test(auth.password)) {
            applyToast("password should have atleast one number","error");
        } else if (!specialRegex.test(auth.password)) {
            applyToast( "password should atleast one of these special characters (!@#$%^&*)","error");
        } else if(!auth.confirm_password){
            applyToast('Please enter confirm password','error');
        } else if(auth.password !== auth.confirm_password){
            applyToast('password does not match','error');
        } else {
            var data = {
                "email" : auth.email,
                "password" : auth.password
            }
            ApiGateway.post("/merchant/auth/setpassword", data, function (response) {
                if (response.success) {
                    applyToast(response.message,'success');
                    history.push("/signin");
                } else {
                    applyToast(response.message,'error');
                }
            })
        }
    }

    return (
        <body className="signup_bg">
            <section className="login_sec">
                <div className="container">
                    <div className="row">            
                        <div className="col-xs-12 col-sm-6 col-md-5 col-md-offset-1">
                            <div className="blue_wrap">
                                <div className="center_palcemrnt">
           
                                    <div className="login_left_title">Banking API for</div>
                                    <ul className="our_features">
                                        <li><img src={imagePath("./banking_api.png").default} alt="" />Fund Transfer</li>
                                        <li><img src={imagePath("./upi-new.png").default} alt="" />UPI</li>
                                        <li><img src={imagePath("./payment_api.png").default} alt="" />Payouts</li>
                                        <li><img src={imagePath("./vpa_api.png").default} alt="" />Virtual Account</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-5">
                            <div className="gray_login_right_part">
                                <div className="login_title text-left">Create New Account</div>
                                {
                                    auth.signup_screen ?
                                    <>
                                        <div className="col-xs-12 p-0" id="login_wrapper">
                                            <div className="form_wrapper_login">
                                                <label for="">Full Name</label>
                                                <input type="text" className="form_control" name="full_name" value={auth.full_name} onChange={handleChange}/>
                                            </div>
                                            <div className="form_wrapper_login">
                                                <label for="">Startup / Business Name</label>
                                                <input type="text" className="form_control" name="business_name" value={auth.business_name} onChange={handleChange} />
                                            </div>
                                            <div className="form_wrapper_login">
                                                <label for="">Phone</label>
                                                <input type="text" className="form_control" name="phone" value={auth.phone} 
                                                onKeyPress={(e) => validate(e)}  onChange={handleChange} onPaste={e=>e.preventDefault()}/>
                                            </div>
                                            <div className="form_wrapper_login">
                                                <label for="">Email</label>
                                                <input type="text" className="form_control" name="email" value={auth.email} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="password_remb_part">
                                            <input id="rember" type="checkbox" className="hide rember_check" checked={auth.terms_condition}  onChange={handleOnChange} />
                                            <label for="rember" className="check_label" >Terms and Conditions</label>
                                        </div>
                                        <div className="col-xs-12 p-0">
                                            <a className="login_now_btn" onClick={createUser}>Submit</a>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="col-xs-12 p-0" id="password_wrapper">
                                            <div className="form_wrapper_login">
                                                <label for="">password</label>
                                                <input type="password" className="form_control" name="password" value={auth.password || ""} onChange={handleChange} />
                                            </div>
                                            <div className="form_wrapper_login">
                                                <label for="">Confirm password</label>
                                                <input type="password" className="form_control" name="confirm_password" value={auth.confirm_password || ""} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 p-0">
                                            <a className="login_now_btn" onClick={setpassword}>Submit</a>
                                        </div>
                                    </>
                                }                                 
                                <div className="already_having_account">Already have an account ? <Link to="/signin" className="pink_clr">Sign in</Link></div>
                            </div>
                        </div>
                    </div>
                </div>    
            </section>
        </body>
    )
}


export default SignUp;