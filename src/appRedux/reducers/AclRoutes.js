import { userConstants } from "../../constants/ActionTypes";
const initialState = {
    selected_acl_routes:[],
    acl_routes:[]
};

export function acl_routes(state = initialState, action) {
    switch (action.type) {  
        case userConstants.ACL_ROUTES:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}