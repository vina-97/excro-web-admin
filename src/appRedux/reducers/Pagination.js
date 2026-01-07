import { userConstants } from "../../constants/ActionTypes";
const initialState = {
    page : 1,
    disabled_page:true,
    limit: 10
};

export function pagination(state = initialState, action) {
    switch (action.type) {  
        case userConstants.PAGINATION:
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