import { userConstants } from "../../constants/ActionTypes";
const initialState = {
    loading : true,
    loadRecords:false
};

export function loading(state = initialState, action) {
    switch (action.type) {  
        case userConstants.LOADER:
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