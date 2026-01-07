import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    mainToggle : "virtual_account",
    subToggle : "list",
    upi_subToggle : "collections",
    page : 1,
    limit : 10,
    accountList : [],
    totalPage : 0,
    startDate : new Date(),
    endDate : new Date(),
    fromDate: "",    
    toDate: "",  
    from:"",
    to:"",
    open_picker : false,
    selectedMerchant : {},
    merchantList : [],
    isOpenMenu : false,
    merchant_id : "",
    merchantList:[],
    filter:"",
    accountDetail:{},
    openAccountDetailModal:false,
};

export function account(state = initialState, action) {
    switch (action.type) {  
        case userConstants.ACCOUNT:
            return {
                ...state,
                ...action.payload
            };
        case userConstants.FORCE_UPDATE:
            return {
                ...action.payload
            };
        default:
            return state
    }
}