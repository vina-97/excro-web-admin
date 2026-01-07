import { userConstants } from "../../constants/ActionTypes";

const initialState = {
   contactList : [],
   page : 1,
   limit : 10,
   totalPage : 0,
   conatctDetail : {},
   merchantDetail : {},
   accountDetail : {},
   openDetail : false,
   merchantList : [],
   isOpenMenu : false,
   merchant_id : "",
   selectedMerchant : {},
   showFilter : false,
   startDate : new Date(),
   endDate : new Date(),
   fromDate: "",    
   toDate: "",  
   from:"",
   to:"",
   open_picker : false,
   searchTerm : "",
   filterList:false,
   filter:""
};

export function contact(state = initialState, action) {
    switch (action.type) {
        case userConstants.CONTACT_REQUEST:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}