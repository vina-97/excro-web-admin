import { userConstants } from "../../constants/ActionTypes";


const initialState = {
   username : "",
   password : "",
   otp:"",
   showOtpScreen:false,
   showPassword:false,
   useremail:"",
   verifyOtp:"",
   newPassword:"",
   confirmPassword:"",
   showEmailOtp:false,
   shownewPassword:false,
   showconfirmPassword:false,
   userRoleCode:"",

};

export function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.REGISTER_REQUEST:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}