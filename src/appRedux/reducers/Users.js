import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    list:[]
};
const addUser_initialState={
    firstName:"",
    lastname:"",
    email:"",
    password:"",
    confirmPassword:"",
    phone:"",
    role:[],
    role_name:"",
    role_code:"",
    showPassword:false,
    showConfirmPassword:true,
    merchantrouteList:[],
    privileges:[],
  
    
}
const editUser_state = {
    subUserdetailList:[],
    edit_fullname:"",
    edit_lastname:"",
    edit_email:"",
    edit_phone:"",
    edit_privilages:[],
    roleId:"",
    accType:""

 };


export function user_list(state = initialState, action) {
    switch (action.type) {  
        case userConstants.USERS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}

export function addUser( state = addUser_initialState,action){
    switch (action.type) {  
        case userConstants.ADDUSERS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}

export function editUser( state = editUser_state,action){
    switch (action.type) {  
        case userConstants.EDITUSERS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}