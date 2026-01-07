import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useToasts } from "react-toast-notifications";
import { userConstants } from "../../constants/ActionTypes";
import ApiGateway from "../../DataServices/DataServices";
import ResellerSelect from "./components/ResellerSelect";

export default function EditNodal() {
  const { nodal_account } = useSelector((state) => state);
  const { id } = useParams();
  const dispatch = useDispatch();
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  useEffect(() => {
    nodalAccountDetail(id);
  }, []);

  const nodalAccountDetail = (id) => {
    ApiGateway.get(
      `/payout/admin/nodal/detail?account_id=${id}`,
      function (response) {
        if (response.success) {
          dispatch(
            updateState(userConstants.NODAL_ACCOUNT, {
              nodalDetail: response.data.account,
              edit_name: response.data.account?.name,
              edit_bank_name: response.data.account?.bank_name,
              edit_account_number: response.data.account?.account_number,
              edit_ifsc: response.data.account?.ifsc,
              edit_corp_code: response.data.account?.corp_code,
              edit_bank_code: response.data.account?.bank_code,
              edit_enable_upi: response.data.account?.isUpiEnabled,
              edit_enable_fund_transfer: {
                imps: response.data.account?.isFtEnabled?.imps,
                neft: response.data.account?.isFtEnabled?.neft,
                rtgs: response.data.account?.isFtEnabled?.rtgs,
              },
              reseller: {
                id: response.data?.account?.reseller?.id,
                name: response.data?.account?.reseller?.name ?? "",
              },
              edit_enable_bank_verify:
                response.data.account?.isBankVerificationEnabled?.direct ||
                response.data.account?.isBankVerificationEnabled?.indirect
                  ? true
                  : false,
              edit_enable_vap_validation:
                response.data.account?.isVpaValidationEnabled?.direct ||
                response.data.account?.isVpaValidationEnabled?.indirect
                  ? true
                  : false,
              editisConnectedBankingEnabled:
                response.data.account?.isConnectedBankingEnabled,
              editisBankBeneCreateEnabled:
                response.data.account?.isBankBeneCreateEnabled,
              editisUpiBeneCreateEnabled:
                response.data.account?.isUpiBeneCreateEnabled,
              editisVpaValidationEnabled: {
                direct: response.data.account?.isVpaValidationEnabled?.direct,
                indirect:
                  response.data.account?.isVpaValidationEnabled?.indirect,
              },
              editisBankVerificationEnabled: {
                direct:
                  response.data.account?.isBankVerificationEnabled?.direct,
                indirect:
                  response.data.account?.isBankVerificationEnabled?.indirect,
              },
            })
          );
        } else {
          applyToast(response.message, "error");
        }
      }
    );
  };

  const editNodalAccount = () => {
    const isFundTransferSelected =
      nodal_account.edit_enable_fund_transfer?.imps ||
      nodal_account.edit_enable_fund_transfer?.neft ||
      nodal_account.edit_enable_fund_transfer?.rtgs;

    let regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!nodal_account.edit_name) {
      addToast("Please Enter Nodal Name");
    } else if (!nodal_account.edit_bank_name) {
      addToast("Please Enter Bank Name");
    } else if (!nodal_account.edit_account_number) {
      addToast("Please Enter Bank Account Name");
    } else if (!nodal_account.edit_ifsc.match(regex)) {
      addToast("Please Enter Valid IFSC");
    } else if (!nodal_account.edit_ifsc) {
      addToast("Please Enter IFSC");
    } else if (!nodal_account.edit_corp_code) {
      addToast("Please Enter Corporate Code");
    } else if (nodal_account.edit_enable_upi == null) {
      addToast("Please Select Enable UPI");
    } else if (!isFundTransferSelected) {
      addToast(
        "Please select at least one Fund Transfer option (IMPS, NEFT, or RTGS)",
        "error"
      );
    } else if (nodal_account.edit_enable_bank_verify == null) {
      addToast("Please Select Enable Verify Bank");
    } else if (nodal_account.edit_enable_vap_validation == null) {
      addToast("Please Select Enable VPA Validation");
    } else if (nodal_account.editisConnectedBankingEnabled == null) {
      addToast("Please Select Connected Banking");
    } else {
      const data = {
        account_id: id,
        bank_name: nodal_account.edit_bank_name,
        account_number: nodal_account.edit_account_number,
        ifsc: nodal_account.edit_ifsc,
        corp_code: nodal_account.edit_corp_code,
        name: nodal_account.edit_name,
        isBankBeneCreateEnabled: nodal_account?.editisBankBeneCreateEnabled,
        isUpiBeneCreateEnabled: nodal_account?.editisUpiBeneCreateEnabled,
        isUpiEnabled: nodal_account.edit_enable_upi,
        isFtEnabled: {
          imps: nodal_account?.edit_enable_fund_transfer?.imps,
          neft: nodal_account?.edit_enable_fund_transfer?.neft,
          rtgs: nodal_account?.edit_enable_fund_transfer?.rtgs,
        },

        isConnectedBankingEnabled: nodal_account.editisConnectedBankingEnabled,
        isVpaValidationEnabled: {
          direct: nodal_account?.editisVpaValidationEnabled?.direct,
          indirect: nodal_account?.editisVpaValidationEnabled?.indirect,
        },
        isBankVerificationEnabled: {
          direct: nodal_account?.editisBankVerificationEnabled?.direct,
          indirect: nodal_account?.editisBankVerificationEnabled?.indirect,
        },
      };

      ApiGateway.patch(`/payout/admin/nodal/update`, data, function (response) {
        if (response.success) {
          applyToast(response.message, "success");
          setTimeout(() => {
            window.location.href = "/escrow-pool-accounts";
          }, 1000);
        } else {
          applyToast(response.message, "error");
        }
      });
    }
  };

  const handleChange = (e) => {
    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        [e.target.name]: e.target.value,
      })
    );
  };
  const handleRadioChange = (e) => {
    dispatch(
      // updateState(userConstants.NODAL_ACCOUNT, { [id] : e.target.value === "true" })
      updateState(userConstants.NODAL_ACCOUNT, {
        [e.target.name]: e.target.value == "yes" ? true : false,
      })
    );
  };

  const handleValidatedirectBank = (e) => {
    const value = e.target.value === "yes" ? true : false;

    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        editisBankVerificationEnabled: {
          ...nodal_account.editisBankVerificationEnabled,
          direct: value,
          indirect: value
            ? false
            : nodal_account.editisBankVerificationEnabled.indirect,
        },
      })
    );
  };
  const handleValidateindirectBank = (e) => {
    const value = e.target.value === "yes" ? true : false;

    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        editisBankVerificationEnabled: {
          ...nodal_account.editisBankVerificationEnabled,
          indirect: value,
          direct: value
            ? false
            : nodal_account.editisBankVerificationEnabled.direct,
        },
      })
    );
  };
  const handleValidatedirectVPA = (e) => {
    const value = e.target.value === "yes" ? true : false;

    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        editisVpaValidationEnabled: {
          ...nodal_account.editisVpaValidationEnabled,
          direct: value,
          indirect: value
            ? false
            : nodal_account.editisVpaValidationEnabled.indirect,
        },
      })
    );
  };
  const handleValidateindirectVPA = (e) => {
    const value = e.target.value === "yes" ? true : false;

    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        editisVpaValidationEnabled: {
          ...nodal_account.editisVpaValidationEnabled,
          indirect: value,
          direct: value
            ? false
            : nodal_account.editisVpaValidationEnabled.direct,
        },
      })
    );
  };

  const handleFundTransferChange = (e) => {
    const { id, checked } = e.target;

    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        edit_enable_fund_transfer: {
          ...nodal_account.edit_enable_fund_transfer,
          [id]: checked,
        },
      })
    );
  };
  return (
    <div className="content_wrapper dash_wrapper">
      <div className="dash_merchent_welcome">
        <div className="merchent_wlcome_content add-user">
          Edit Escrow / Pool Account
        </div>
      </div>
      <div className="col-xs-12 bg-white">
        <div className="white_tab_wrap">
          <div className="white_tab_box">
            <div className="clearfix">
              <ul className="nav nav-tabs customized_tab m-b-20">
                <li className="page_title">Account Details</li>
              </ul>
              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Name:
                </div>
                <div className="col-sm-5">
                  <input
                    type="text"
                    name="edit_name"
                    className={`form-control ${nodal_account.edit_name ? "disabled_input" : ""}`}
                    id="edit_name"
                    placeholder="Enter Name"
                    value={nodal_account.edit_name}
                    onChange={handleChange}
                    maxLength={50}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Bank Name:
                </div>
                <div className="col-sm-5">
                  <input
                    type="text"
                    name="edit_bank_name"
                    className={`form-control ${nodal_account.edit_bank_name ? "disabled_input" : ""}`}

                    id="edit_bank_name"
                    placeholder="Enter Bank Name"
                    value={nodal_account.edit_bank_name}
                    onChange={handleChange}
                    maxLength={50}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Account Number:
                </div>
                <div className="col-sm-5">
                  <input
                    type="text"
                    name="edit_account_number"
                    className={`form-control ${nodal_account.edit_account_number? "disabled_input" : ""}`}
                    id="edit_account_number"
                    placeholder="Enter Account Number"
                    value={nodal_account.edit_account_number}
                    onChange={handleChange}
                    maxLength={20}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  IFSC:
                </div>
                <div className="col-sm-5">
                  <input
                    type="text"
                    name="edit_ifsc"
                    className={`form-control ${nodal_account.edit_ifsc ? "disabled_input" : ""}`}
                    id="edit_ifsc"
                    placeholder="Enter IFSC"
                    value={nodal_account.edit_ifsc}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Corp Code:
                </div>
                <div className="col-sm-5">
                  <input
                    type="text"
                    name="edit_corp_code"
                    className="form-control"
                    id="edit_corp_code"
                    placeholder="Enter Corp Code"
                    value={nodal_account.edit_corp_code}
                    onChange={handleChange}
                    
                  />
                </div>
              </div>
              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Reseller Name:
                </div>
                <div className="col-sm-5">
                  <ResellerSelect
                    value={
                      nodal_account?.reseller?.id
                        ? {
                            value: nodal_account?.reseller?.id,
                            label: nodal_account?.reseller?.name,
                          }
                        : null
                    }
                    placeholder="Select Reseller Name"
                    isDisabled={true}
                    onChange={null}
                  />
                </div>
              </div>
              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Bank Code:
                </div>
                <div className="col-sm-5">
                  <input
                    type="text"
                    name="edit_bank_code"
                    className="form-control"
                    id="edit_bank_code"
                    placeholder="Enter Bank Code"
                    value={nodal_account.edit_bank_code}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Enable UPI:
                </div>
                <div className="row">
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="edit_enable_upi"
                      className="form-check-input"
                      id="edit_enable_upi"
                      value="yes"
                      checked={nodal_account.edit_enable_upi === true}
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">Yes</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="edit_enable_upi"
                      className="form-check-input"
                      id="edit_enable_upi"
                      value="no"
                      checked={nodal_account.edit_enable_upi === false}
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">No</span>
                  </div>
                </div>
              </div>
              {/*       <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                Enable Fund Transfer:
                            </div>
                           <div className='row'>
                       
                           <div className="col-sm-1">
                     
                                <input
                                    type="radio"
                                    name="edit_enable_fund_transfer"
                                    className="form-check-input"
                                    id="edit_enable_fund_transfer"
                                    value="yes"
                                    checked={nodal_account.edit_enable_fund_transfer === true}
                                    onChange={handleRadioChange}
                                />
                                      <span className='control-label m-r-5'>Yes</span>
                            </div>
                            <div className="col-sm-1">
                          
                                <input
                                    type="radio"
                                    name="edit_enable_fund_transfer"
                                    className="form-check-input"
                                    id="edit_enable_fund_transfer"
                                    value="no"
                                    checked={nodal_account.edit_enable_fund_transfer === false}
                                    onChange={handleRadioChange}
                                />
                                  <span className='control-label m-r-5'>No</span>
                            </div>
                           </div>
                        </div> */}
              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Enable Fund Transfer:
                </div>
                <div className="row">
                  <div className="col-sm-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="imps"
                      checked={nodal_account.edit_enable_fund_transfer.imps}
                      onChange={handleFundTransferChange}
                    />
                    <span className="control-label m-r-5">IMPS</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="neft"
                      checked={nodal_account.edit_enable_fund_transfer.neft}
                      onChange={handleFundTransferChange}
                    />
                    <span className="control-label m-r-5">NEFT</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rtgs"
                      checked={nodal_account.edit_enable_fund_transfer.rtgs}
                      onChange={handleFundTransferChange}
                    />
                    <span className="control-label m-r-5">RTGS</span>
                  </div>
                </div>
              </div>
              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Enable Pennyless Bank verification:
                </div>
                <div className="row">
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="directBank"
                      className="form-check-input"
                      value="yes"
                      checked={
                        nodal_account.editisBankVerificationEnabled?.direct ==
                        true
                      }
                      onChange={handleValidatedirectBank}
                    />
                    <span className="control-label m-r-5">Yes</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="directBank"
                      className="form-check-input"
                      value="no"
                      checked={
                        nodal_account.editisBankVerificationEnabled?.direct ==
                        false
                      }
                      onChange={handleValidatedirectBank}
                    />
                    <span className="control-label m-r-5">No</span>
                  </div>
                </div>
              </div>
              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Enable Pennydrop Bank verification:
                </div>
                <div className="row">
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="indirectBank"
                      className="form-check-input"
                      value="yes"
                      checked={
                        nodal_account.editisBankVerificationEnabled?.indirect ==
                        true
                      }
                      onChange={handleValidateindirectBank}
                    />
                    <span className="control-label m-r-5">Yes</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="indirectBank"
                      className="form-check-input"
                      value="no"
                      checked={
                        nodal_account.editisBankVerificationEnabled?.indirect ==
                        false
                      }
                      onChange={handleValidateindirectBank}
                    />
                    <span className="control-label m-r-5">No</span>
                  </div>
                </div>
              </div>
              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label">
                  Enable Pennyless VPA Validation:
                </div>
                <div className="row">
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="directVPA"
                      className="form-check-input"
                      value="yes"
                      checked={
                        nodal_account.editisVpaValidationEnabled?.direct == true
                      }
                      onChange={handleValidatedirectVPA}
                    />
                    <span className="control-label m-r-5">Yes</span>
                  </div>

                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="directVPA"
                      className="form-check-input"
                      value="no"
                      checked={
                        nodal_account.editisVpaValidationEnabled?.direct ==
                        false
                      }
                      onChange={handleValidatedirectVPA}
                    />
                    <span className="control-label m-r-5">No</span>
                  </div>
                </div>
              </div>

              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Enable Pennydrop Vpa Validation:
                </div>
                <div className="row">
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="indirectVPA"
                      className="form-check-input"
                      value="yes"
                      checked={
                        nodal_account.editisVpaValidationEnabled?.indirect ==
                        true
                      }
                      onChange={handleValidateindirectVPA}
                    />
                    <span className="control-label m-r-5">Yes</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="indirectVPA"
                      className="form-check-input"
                      value="no"
                      checked={
                        nodal_account.editisVpaValidationEnabled?.indirect ==
                        false
                      }
                      onChange={handleValidateindirectVPA}
                    />
                    <span className="control-label m-r-5">No</span>
                  </div>
                </div>
              </div>
              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Create Beneficiary Account from Bank:
                </div>
                <div className="row">
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="editisBankBeneCreateEnabled"
                      className="form-check-input"
                      checked={
                        nodal_account.editisBankBeneCreateEnabled === true
                      }
                      value="yes"
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">Yes</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="editisBankBeneCreateEnabled"
                      className="form-check-input"
                      value="no"
                      checked={
                        nodal_account.editisBankBeneCreateEnabled === false
                      }
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">No</span>
                  </div>
                </div>
              </div>
              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Create UPI Beneficiary from Bank:
                </div>
                <div className="row">
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="editisUpiBeneCreateEnabled"
                      className="form-check-input"
                      id="editisUpiBeneCreateEnabled"
                      value="yes"
                      checked={
                        nodal_account.editisUpiBeneCreateEnabled === true
                      }
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">Yes</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="editisUpiBeneCreateEnabled"
                      className="form-check-input"
                      id="editisUpiBeneCreateEnabled"
                      value="no"
                      checked={
                        nodal_account.editisUpiBeneCreateEnabled === false
                      }
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">No</span>
                  </div>
                </div>
              </div>
              <div className="form-group clearfix form-refrance-cls">
                <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                  Enable Connected Banking:
                </div>
                <div className="row">
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="editisConnectedBankingEnabled"
                      className="form-check-input"
                      id="editisConnectedBankingEnabled"
                      value="yes"
                      checked={
                        nodal_account.editisConnectedBankingEnabled === true
                      }
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">Yes</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="editisConnectedBankingEnabled"
                      className="form-check-input"
                      id="editisConnectedBankingEnabled"
                      value="no"
                      checked={
                        nodal_account.editisConnectedBankingEnabled === false
                      }
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">No</span>
                  </div>
                </div>
              </div>

              <div className="col-md-12 text-center">
                <div className="row col-md-8">
                  <button className="submitBtn" onClick={editNodalAccount}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
