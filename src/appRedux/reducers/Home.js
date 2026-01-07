import { userConstants } from "../../constants/ActionTypes";
import moment from "moment";

const initialState = {
    transactionList : [],
    totalPage : 0,
    page : 1,
    limit : 10,
    total_contact : 0,
    total_collection : 0,
    number_of_payout : 0,
    total_payout_volume : 0,
    open_picker : false,
    startDate : new Date(),
    endDate : new Date(),
    // from: moment(new Date()).format('DD/MM/YYYY'),
    // to: moment(new Date()).format('DD/MM/YYYY'),
    // fromDate:  moment(new Date()).startOf("day").utc().toISOString(),
    // toDate: moment(new Date()).startOf("day").utc().toISOString()
    from: "",
    to: "",
    fromDate:  "",
    toDate: "",
    transactionDetail : false,
    trans_id : "",
    isTransDetail: false,
    TransactionDetail: {}
};

export function home(state = initialState, action) {
    switch (action.type) {
        case userConstants.HOME:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}