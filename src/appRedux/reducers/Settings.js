import { userConstants } from "../../constants/ActionTypes";

const initialState = {
    commission_details : {},
    cancelSetting : false,
    reRender : false,
    vpa_creation_type:true,
    vpa_collection_type:true,
    van_creation_type:true,
    van_collection_type:true,
    settings_neft:0,
    settings_imps:0,
    settings_rtgs:0,
    settings_upi:0,
    settings_great1_neft:0,
    settings_great1_imps:0,
    settings_great1_rtgs:0,
    settings_great1_upi:0,
    settings_great10_neft:0,
    settings_great10_imps:0,
    settings_great10_rtgs:0,
    settings_great10_upi:0,
    settings_great25_neft:0,
    settings_great25_imps:0,
    settings_great25_rtgs:0,
    settings_great25_upi:0,
    percent_neft:0,
    percent_imps:0,
    percent_rtgs:0,
    percent_upi:0,
    percent_great1_neft:0,
    percent_great1_imps:0,
    percent_great1_rtgs:0,
    percent_great1_upi:0,
    percent_great10_neft:0,
    percent_great10_imps:0,
    percent_great10_rtgs:0,
    percent_great10_upi:0,
    percent_great25_neft:0,
    percent_great25_imps:0,
    percent_great25_rtgs:0,
    percent_great25_upi:0,
    van_collection:0,
    vpa_collection:0,
    van_creation:0,
    vpa_creation:0,
    van_verification:0,
    vpa_verification:0,
    daily_trans_count:0,
    daily_trans_volume:0,
    per_trans_volume:0,
    max_beneficiary:0,
    banking_service:false,
    upi_service:false,
    virtual_account:false,
    settings_section:false,
    partial_invoice:false,
};

export function settings(state = initialState, action) {
    switch (action.type) {
        case userConstants.SETTINGS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}