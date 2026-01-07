import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useToasts } from "react-toast-notifications";
import { userConstants } from "../../constants/ActionTypes";
import ApiGateway from "../../DataServices/DataServices";
import { validate } from "../../DataServices/Utils";
import ResellerSelect from "./components/ResellerSelect";

export default function NodalCreation() {
  const { nodal_account } = useSelector((state) => state);
  const dispatch = useDispatch();
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  const [reseller, setReseller] = useState({
    id: "",
    name: "",
  });

  const handleChangeSelect = (selected, name) => {
    setReseller((prevState) => ({
      ...prevState,
      id: selected ? selected.value : "",
      name:
        selected && selected.label
          ? selected.label.replace(/^Reseller\s*/, "")
          : "",
    }));
    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        reseller: { [name]: selected ? selected.value : "" },
      })
    );
    // console.log("Selected Reseller ID:", name, selected ? selected.value : "");
  };

  useEffect(() => {
    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        name: "",
        bank_name: "",
        account_number: "",
        ifsc: "",
        corp_code: "",
        bank_code: "",
      })
    );
  }, []);

  const addNodalAccount = () => {
    let regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!nodal_account.name) {
      addToast("Please Enter Nodal Name");
    } else if (!nodal_account.bank_name) {
      addToast("Please Enter Bank Name");
    } else if (!nodal_account.account_number) {
      addToast("Please Enter Bank Account Name");
    } else if (!nodal_account.ifsc.match(regex)) {
      addToast("Please Enter Valid IFSC");
    } else if (!nodal_account.ifsc) {
      addToast("Please Enter IFSC");
    } else if (!nodal_account.corp_code) {
      addToast("Please Enter Corporate Code");
    } else if (nodal_account.isConnectedBankingEnabled == null) {
      addToast("Please Select Enable Connected Banking");
    } else if (nodal_account.enable_upi == null) {
      addToast("Please Select Enable UPI");
    } else if (
      nodal_account.enable_fund_transfer.imps === false &&
      nodal_account.enable_fund_transfer.neft === false &&
      nodal_account.enable_fund_transfer.rtgs === false
    ) {
      addToast("Please Select any one to Enable Fund Transfer");
    } else if (nodal_account.isBankVerificationEnabled?.direct == null) {
      addToast("Please Select Enable Pennyless Bank Verification");
    } else if (nodal_account.isBankVerificationEnabled?.indirect == null) {
      addToast("Please Select Enable Pennydrop Bank Verification");
    } else if (nodal_account.isVpaValidationEnabled?.direct == null) {
      addToast("Please Select Enable Pennyless VPA Validation");
    } else if (nodal_account.isVpaValidationEnabled?.indirect == null) {
      addToast("Please Select Enable Pennydrop VPA Validation");
    } else if (nodal_account.isBankBeneCreateEnabled == null) {
      addToast("Please Select Option Create Beneficiary Account from Bank");
    } else if (nodal_account.isUpiBeneCreateEnabled == null) {
      addToast("Please Select Option to Create UPI Beneficiary from Bank:");
    } else {
      const data = {
        bank_name: nodal_account.bank_name,
        account_number: nodal_account.account_number,
        ifsc: nodal_account.ifsc,
        corp_code: nodal_account.corp_code,
        name: nodal_account.name,
        // reseller: {
        //   id: nodal_account?.reseller?.id ,
        // },
        isUpiEnabled: nodal_account.enable_upi,
        isFtEnabled: {
          imps: nodal_account?.enable_fund_transfer?.imps,
          neft: nodal_account?.enable_fund_transfer?.neft,
          rtgs: nodal_account?.enable_fund_transfer?.rtgs,
        },
        isVpaValidationEnabled: {
          direct: nodal_account?.isVpaValidationEnabled?.direct,
          indirect: nodal_account?.isVpaValidationEnabled?.indirect,
        },
        isBankVerificationEnabled: {
          direct: nodal_account?.isBankVerificationEnabled?.direct,
          indirect: nodal_account?.isBankVerificationEnabled?.indirect,
        },
        isConnectedBankingEnabled: nodal_account.isConnectedBankingEnabled,
        isBankBeneCreateEnabled: nodal_account.isBankBeneCreateEnabled,
        isUpiBeneCreateEnabled: nodal_account.isUpiBeneCreateEnabled,
      };
      if (nodal_account?.reseller?.id) {
        data.reseller = {
          id: nodal_account.reseller.id,
        };
      }
             

      ApiGateway.post(`/payout/admin/nodal/create`, data, function (response) {
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

  const handleChangeIfsc = (e) => {
    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        [e.target.name]: e.target.value.toUpperCase(),
      })
    );
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
      updateState(userConstants.NODAL_ACCOUNT, {
        [e.target.name]: e.target.value == "yes" ? true : false,
      })
    );
  };

  const handleValidatedirectBank = (e) => {
    const value = e.target.value === "yes";

    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        isBankVerificationEnabled: {
          direct: value,
          indirect: value
            ? false
            : nodal_account.isBankVerificationEnabled.indirect,
        },
      })
    );
  };

  const handleValidateindirectBank = (e) => {
    const value = e.target.value === "yes";

    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        isBankVerificationEnabled: {
          indirect: value,
          direct: value
            ? false
            : nodal_account.isBankVerificationEnabled.direct,
        },
      })
    );
  };

  const handleValidatedirectVPA = (e) => {
    const value = e.target.value === "yes" ? true : false;

    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        isVpaValidationEnabled: {
          ...nodal_account.isVpaValidationEnabled,
          direct: value,
          indirect: value
            ? false
            : nodal_account.isVpaValidationEnabled.indirect,
        },
      })
    );
  };
  const handleValidateindirectVPA = (e) => {
    const value = e.target.value === "yes" ? true : false;

    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        isVpaValidationEnabled: {
          ...nodal_account.isVpaValidationEnabled,
          indirect: value,
          direct: value ? false : nodal_account.isVpaValidationEnabled.direct,
        },
      })
    );
  };
  const handleFundTransferChange = (e) => {
    const { id, checked } = e.target;

    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        enable_fund_transfer: {
          ...nodal_account.enable_fund_transfer,
          [id]: checked,
        },
      })
    );
  };
  return (
    <div className="content_wrapper dash_wrapper">
      <div className="dash_merchent_welcome">
        <div className="merchent_wlcome_content add-user">
          Add Escrow / Pool Account{" "}
          <div className="bread_crumb">
            <ul className="breadcrumb">
              <li>
                <Link to="/dashboard" className="inactive_breadcrumb">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/escrow-pool-accounts"
                  className="inactive_breadcrumb"
                >
                  Escrow - Pool Accounts
                </Link>
              </li>
              <li className="active_breadcrumb">Add Escrow - Pool Accounts</li>
            </ul>
          </div>
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
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Enter Name"
                    value={nodal_account.name}
                    onChange={handleChange}
                    maxLength={50}
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
                    name="bank_name"
                    className="form-control"
                    id="bank_name"
                    placeholder="Enter Bank Name"
                    value={nodal_account.bank_name}
                    onChange={handleChange}
                    maxLength={50}
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
                    name="account_number"
                    className="form-control"
                    id="account_number"
                    placeholder="Enter Account Number"
                    value={nodal_account.account_number}
                    onChange={handleChange}
                    onKeyPress={validate}
                    maxLength={20}
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
                    name="ifsc"
                    className="form-control"
                    id="ifsc"
                    placeholder="Enter IFSC"
                    value={nodal_account.ifsc}
                    onChange={handleChangeIfsc}
                    maxLength={11}
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
                    name="corp_code"
                    className="form-control"
                    id="corp_code"
                    placeholder="Enter Corp Code"
                    value={nodal_account.corp_code}
                    onChange={handleChange}
                    maxLength={20}
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
                      reseller.id
                        ? { value: reseller.id, label: reseller.name }
                        : null
                    }
                    onChange={(e) => handleChangeSelect(e, "id")}
                  />
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
                      name="isConnectedBankingEnabled"
                      className="form-check-input"
                      id="isConnectedBankingEnabled"
                      value="yes"
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">Yes</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="isConnectedBankingEnabled"
                      className="form-check-input"
                      id="isConnectedBankingEnabled"
                      placeholder="Enter Request Method"
                      value="no"
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">No</span>
                  </div>
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
                      name="enable_upi"
                      className="form-check-input"
                      id="enable_upi"
                      value="yes"
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">Yes</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="enable_upi"
                      className="form-check-input"
                      id="enable_upi"
                      placeholder="Enter Request Method"
                      value="no"
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">No</span>
                  </div>
                </div>
              </div>

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
                      checked={nodal_account.enable_fund_transfer.imps}
                      onChange={handleFundTransferChange}
                    />
                    <span className="control-label m-r-5">IMPS</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="neft"
                      checked={nodal_account.enable_fund_transfer.neft}
                      onChange={handleFundTransferChange}
                    />
                    <span className="control-label m-r-5">NEFT</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rtgs"
                      checked={nodal_account.enable_fund_transfer.rtgs}
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
                        nodal_account.isBankVerificationEnabled?.direct == true
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
                        nodal_account.isBankVerificationEnabled?.direct == false
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
                        nodal_account.isBankVerificationEnabled?.indirect ==
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
                        nodal_account.isBankVerificationEnabled?.indirect ==
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
                        nodal_account.isVpaValidationEnabled?.direct == true
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
                        nodal_account.isVpaValidationEnabled?.direct == false
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
                        nodal_account.isVpaValidationEnabled?.indirect == true
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
                        nodal_account.isVpaValidationEnabled?.indirect == false
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
                      name="isBankBeneCreateEnabled"
                      className="form-check-input"
                      id="isBankBeneCreateEnabled"
                      value="yes"
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">Yes</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="isBankBeneCreateEnabled"
                      className="form-check-input"
                      id="isBankBeneCreateEnabled"
                      value="no"
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
                      name="isUpiBeneCreateEnabled"
                      className="form-check-input"
                      id="isUpiBeneCreateEnabled"
                      value="yes"
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">Yes</span>
                  </div>
                  <div className="col-sm-1">
                    <input
                      type="radio"
                      name="isUpiBeneCreateEnabled"
                      className="form-check-input"
                      id="isUpiBeneCreateEnabled"
                      value="no"
                      onChange={handleRadioChange}
                    />
                    <span className="control-label m-r-5">No</span>
                  </div>
                </div>
              </div>

              <div className="col-md-12 text-center">
                <div className="row col-md-8">
                  <button className="submitBtn" onClick={addNodalAccount}>
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
