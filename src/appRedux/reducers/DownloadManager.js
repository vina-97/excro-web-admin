import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    selectedReport:null
};

export function downloadManager(state = initialState, action) {
    switch (action.type) {  
        case userConstants.DOWNLOADMANAGER:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}