import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    more_filters : false,
    isExport : false,
    page : 1,
    limit : 10,
    TransactionList : [],
    transactionDetail : false,
    trans_id : "",    
    isTransDetail: false,
    TransactionDetail: {},
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
    searchTerm : "",
    search_type:"",
    loadRecords:false,
    today:"",
    todayFromDate:"",
    accountList:[],
    filterList:false,
    productType:"",
    productType_value:"",
    reseller_id:"",
    reseller_name:"",
    statusModal:false,
    statusTransId:"",
    statusResponse:{},
    isScheduled:null,
    isScheduled_label:"",
    nodal_name:""
  
};

export function account_statement(state = initialState, action) {
    switch (action.type) {
        case userConstants.SHOW_TOGGLE:
            return {
                ...state,
                ...action.payload
            };
        case userConstants.TRANSACTION:
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