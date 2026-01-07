import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    list:[],
    openModal:false,
    reportDetail:{},
    merchant_id:"",
    selection:"",
    startDate : new Date(),
    endDate : new Date(),
    fromDate: "",    
    toDate: "",  
    from:"",
    to:"",
    open_picker : false,
    filter:""
    
};
export function reports(state = initialState, action) {
    switch (action.type) {  
        case userConstants.REPORTS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}