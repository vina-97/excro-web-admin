import { userConstants } from "../../constants/ActionTypes";
import moment from "moment";

const initialState = {
    transDetail : {}
};

export function transaction(state = initialState, action) {
    switch (action.type) {
        case userConstants.TRANSACTION:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}