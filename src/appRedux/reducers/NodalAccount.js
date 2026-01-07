import { update } from "lodash";
import { userConstants } from "../../constants/ActionTypes";


const initialState = {
list:[],
bank_name:"",
account_number:"",
ifsc:"",
corp_code:"",
name:"",
bank_code:"",
openDetailModal:false,
nodalDetail:{},
enable_upi:null,
enable_vap_validation:null,
isConnectedBankingEnabled:null,
isBankBeneCreateEnabled:null,
isUpiBeneCreateEnabled:null,
enable_bank_verify:false,
enable_fund_transfer:{
  imps: false,
  neft: false,
  rtgs: false
},
isVpaValidationEnabled:{
  direct:null,
  indirect:null
},
isBankVerificationEnabled:{
  direct:null,
  indirect:null  
},
edit_name:"",
edit_bank_name:"",
edit_account_number:"",
edit_ifsc:"",
edit_corp_code:"",
edit_bank_code:"",
edit_enable_upi:"",
edit_enable_fund_transfer:{
    imps: null,
    neft: null,
    rtgs: null
  },
  editisVpaValidationEnabled:{
    direct:null,
    indirect:null
  },
  editisBankVerificationEnabled:{
    direct:null,
    indirect:null  
  },
edit_enable_bank_verify:"",
edit_enable_vap_validation:"",
editisConnectedBankingEnabled:null,
editisBankBeneCreateEnabled:null,
editisUpiBeneCreateEnabled:null,
edit_enable_imps:"",
edit_enable_rtgs:"",
edit_enable_neft:"",












};


export function nodal_account(state = initialState, action) {
    switch (action.type) {
        case userConstants.NODAL_ACCOUNT:
            return {
                ...state,
                ...action.payload
            };
      
        default:
            return state
    }
}