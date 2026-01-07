import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    invoice_list:[{
        invoice_id: "#876sdjgf",
        merchant: {
            id: "#jsf9273498",
            name: "Nirmal Pvt Ltd"
        },
        reseller: {
            id: String,
            name: String
        },
        internal: {
                is_transaction_updated: Boolean,
                is_invoice_paid: Boolean,
                payment_type: {type: String, default: "full"},
                transaction: Object,
        },
        transaction: {
            credit: {
                ecollect: {
                    count: Number,
                    volume: Number,
                    commission: Number
                }
            },
            debit: {
                payout: {
                    imps: {
                        count: Number,
                        volume: Number,
                        commission_value: Number,
                        commission_tax: Number,
                        commission_total: Number
                    },
                    rtgs: {
                        count: Number,
                        volume: Number,
                        commission_value: Number,
                        commission_tax: Number,
                        commission_total: Number
                    },
                    neft: {
                        count: Number,
                        volume: Number,
                        commission_value: Number,
                        commission_tax: Number,
                        commission_total: Number
                    },
                    upi: {
                        count: Number,
                        volume: Number,
                        commission_value: Number,
                        commission_tax: Number,
                        commission_total: Number
    
                    }
                },
                acc_veri: {
                    count: Number,
                    volume: Number,
                    commission_value: Number,
                    commission_tax: Number,
                    commission_total: Number
                },
                upi_verification: {
                    count: Number,
                    volume: Number,
                    commission_value: Number,
                    commission_tax: Number,
                    commission_total: Number
                },
                acc_creation: {
                    count: Number,
                    volume: Number,
                    commission_value: Number,
                    commission_tax: Number,
                    commission_total: Number
                }
            }
        },
        slot: "Nov 2024",
        status: "Paid", //pending(or)unpaid, paid, failure,
        invoice_type: {type: String, default: "full"} //partial  
    }],
  startDate : new Date(),
  endDate : new Date(),
  fromDate: "",    
  toDate: "",  
  from:"",
  to:"",
  invoice_detail:{}
};

export function invoice(state = initialState, action) {
    switch (action.type) {
        case userConstants.INVOICE:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}