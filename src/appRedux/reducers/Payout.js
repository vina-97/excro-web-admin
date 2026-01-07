import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    more_filters : false,
    isExport : false
};

export function payout(state = initialState, action) {
    switch (action.type) {
        case userConstants.SHOW_TOGGLE:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}

