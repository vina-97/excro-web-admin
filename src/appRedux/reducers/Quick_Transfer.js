import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    showQuickTransfer : false,
    contactList : [],
    page : 1,
    limit : 10
};

export function quick_transfer(state = initialState, action) {
    switch (action.type) {
        case userConstants.QUICK_TRANSFER:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}