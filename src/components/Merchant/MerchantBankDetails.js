import React, { useEffect, useState } from "react";
import OpenEye from "../../assets/images/eye_icon.svg";
import CloseEye from "../../assets/images/eye_close_icon.svg";
import { useToasts } from "react-toast-notifications";
import { escape, textCapitalize, validate } from "../../DataServices/Utils";
import ApiGateway from "../../DataServices/DataServices";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import Loader from "../Loader";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Modal from "react-modal";
import useRouteExist from "../../DataServices/useRouteExist";
import Pagination from "../Pagination";
import { use } from "react";
const customDetailStyles = {
  overlay: {
    backgroundColor: null,
    position: null,
    inset: null,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    zIndex: 100,
    padding: 0,
    border: 0,
    width: 600,
    inset: null,
  },
};
function MerchantBankDetails(props) {
  const { loading, payout_merchant } = useSelector((state) => state);
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };  
  const bankupiCountRoute =useRouteExist(["admin-get-bank-upi-count"]);
  const editBankRoute = useRouteExist(["admin-merchant-edit-whitelistBank"]);
  const bankListRoute = useRouteExist(["admin-merchant-whitelist-bank"]);
  const addBankRoute=useRouteExist(["admin-merchant-add-whitelistBank"]);
  const [pageno, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [recordsLength, setrecordLength] = useState([]);
  const dispatch = useDispatch();

  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateState(userConstants.PAYOUT_MERCHANT, { [name]: value }));
  };

  const handleIfscChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        [name]: value.toUpperCase(),
      })
    );
  };
  useEffect(() => {
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        bank_account_name: "",
        account_number: "",
        confirm_account_number: "",
        ifsc: "",
      })
    );
  }, []);
  useEffect(() => {
    getBankAccount(pageno);
  }, []);

    useEffect(() => {
      if(props.props.match.params.merchant_id || payout_merchant.checkWhitelist || payout_merchant.WhitelistType){
      getSettingDetails();}
    }, [props.props.match.params.merchant_id, payout_merchant.checkWhitelist,payout_merchant.WhitelistType]);

    const getSettingDetails = () => {
      ApiGateway.get(
        `/payout/admin/default-setting?merchant_id=${props?.props.match.params.merchant_id}`,
        function (response) {
          if (response.success) {
            dispatch(
              updateState(userConstants.PAYOUT_MERCHANT, {
          
                credit_whitelisting_count:
                  response?.data?.settings?.settings?.beneficiary_whitelist
                    ?.credit?.limit || 0,
            
              })
            );
          }
        }
      );
    };
  const getBankAccount = (page) => {
    setPageNo(page);
    dispatch(updateState(userConstants.LOADER, { loading: true }));
    ApiGateway.get(
      `/payout/admin/merchant/whitelistedBank/list?merchant.id=${props.props.match.params.merchant_id}&page=${page}&limit=${limit}`,
      (response) => {
        if (response.success) {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          dispatch(
            updateState(userConstants.PAYOUT_MERCHANT, {
              bankAccountList: response?.data ? response?.data : [],
            })

          );
          setrecordLength(response?.data?.length);
        } else {
          applyToast(response.message, "error");
          dispatch(updateState(userConstants.LOADER, { loading: false }));
        }
      }
    );
  };
  const submitBankDetails = () => {
    if (!payout_merchant.bank_account_name) {
      applyToast("Please enter Name", "error");
    } else if (!payout_merchant.account_number) {
      applyToast("Please Enter Account Number", "error");
    } else if (
      payout_merchant.account_number != payout_merchant.confirm_account_number
    ) {
      applyToast(
        "Account Number and Confirm Account Number does not match",
        "error"
      );
    } else if (!payout_merchant.ifsc) {
      applyToast("Please Enter Valid IFSC", "error");
    } else {
      let data = {
        merchant: {
          id: props.props.match.params.merchant_id,
        },
        account: {
          number: payout_merchant.account_number,
          ifsc: payout_merchant.ifsc,
          name: payout_merchant.bank_account_name,
        },
      };

      dispatch(updateState(userConstants.LOADER, { loading: true }));
      ApiGateway.post(
        `/payout/admin/merchant/whitelist/bank`,
        data,
        (response) => {
          if (response.success) {
            applyToast(response.message, "success");
            dispatch(updateState(userConstants.LOADER, { loading: false }));
            getBankAccount(pageno);
            dispatch(
              updateState(userConstants.PAYOUT_MERCHANT, {
                account_number: "",
                ifsc: "",
                bank_account_name: "",
                confirm_account_number: "",
              })
            );
          } else {
            applyToast(response.message, "error");
            dispatch(updateState(userConstants.LOADER, { loading: false }));
            dispatch(
              updateState(userConstants.PAYOUT_MERCHANT, {
                account_number: "",
                ifsc: "",
                bank_account_name: "",
                confirm_account_number: "",
              })
            );
          }
        }
      );
    }
  };

  const changeStatus = (id) => {

    
    const data = {
      account_id: id.account_id,
      status:
        id.status == "active"
          ? "inactive"
          : id.status == "inactive"
          ? "active"
          : "active",
          merchant:{
            id:id.merchant.id
          }
    };
   
    dispatch(updateState(userConstants.LOADER, { loading: true }));
    ApiGateway.patch(
      `/payout/admin/merchant/whitelistedBank/edit`,
      data,
      (response) => {
        if (response.success) {
          applyToast(response.message, "success");
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          getBankAccount(pageno);
        } else {
          applyToast(response.message, "error");
          dispatch(updateState(userConstants.LOADER, { loading: false }));
        }
      }
    );
  };

  const editOpenBankModal = (id) => {
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        editBankModal: !payout_merchant.editBankModal,
        edit_account_number: id?.account?.number,
        edit_confirm_account_number: "",
        edit_ifsc: id?.account?.ifsc,
        edit_bank_account_name: id?.account?.name,
        account_id: id?.account_id,
      })
    );
  };

  const editBank = () => {
    if (!payout_merchant.edit_bank_account_name) {
      applyToast("Please enter Name", "error");
    } else if (!payout_merchant.edit_account_number) {
      applyToast("Please Enter Account Number", "error");
    } else if (
      payout_merchant.edit_account_number !=
      payout_merchant.edit_confirm_account_number
    ) {
      applyToast(
        "Account Number and Confirm Account Number does not match",
        "error"
      );
    } else if (!payout_merchant.edit_ifsc) {
      applyToast("Please Enter Valid IFSC", "error");
    } else {
      let data = {
        account_id: payout_merchant?.account_id,
        account: {
          number: payout_merchant.edit_account_number,
          ifsc: payout_merchant.edit_ifsc,
          name: payout_merchant.edit_bank_account_name,
        },
      };
      dispatch(updateState(userConstants.LOADER, { loading: true }));
      ApiGateway.patch(
        `/payout/admin/merchant/whitelistedBank/edit`,
        data,
        (response) => {
          if (response.success) {
            applyToast(response.message, "success");
            dispatch(updateState(userConstants.LOADER, { loading: false }));
            dispatch(
              updateState(userConstants.PAYOUT_MERCHANT, {
                editBankModal: false,
              })
            );
            getBankAccount();
          } else {
            applyToast(response.message, "error");
            dispatch(updateState(userConstants.LOADER, { loading: false }));
            dispatch(
              updateState(userConstants.PAYOUT_MERCHANT, {
                editBankModal: false,
              })
            );
          }
        }
      );
    }
  };

  const closeEditBankModal = () => {
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        editBankModal: !payout_merchant.editBankModal,
      })
    );
  };

  const cancelBankDetails = () => {
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        bank_account_name: "",
        account_number: "",
        confirm_account_number: "",
        ifsc: "",
      })
    );
  };
   
  return (
    <>
      <div className="tab-content">
        {loading.loading && <Loader />}
        <div className="row">
          <div className="col-xs-5">
          <div className="sub_heading">Add Bank Detail's</div>
            { addBankRoute ? <>
             
            <div className="row m-t-40">
              <div className="col-xs-12">
                <div className="col-xs-3">
                  <div className="control-label ">Name:</div>
                </div>
                <div className="col-xs-6">
                  <input
                    type="text"
                    name="bank_account_name"
                    className="form-control"
                    id="bank_account_name"
                    placeholder="Enter Name"
                    value={payout_merchant?.bank_account_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="row m-t-10">
              <div className="col-xs-12">
                <div className="col-xs-3">
                  <div className="control-label ">Account Number:</div>
                </div>
                <div className="col-xs-6">
                  <input
                    type="text"
                    name="account_number"
                    className="form-control"
                    id="account_number"
                    placeholder="Enter Account Number"
                    value={payout_merchant?.account_number}
                    onChange={handleInputChange}
                    onKeyPress={validate}
                  />
                </div>
              </div>
            </div>
            <div className="row m-t-10">
              <div className="col-xs-12">
                <div className="col-xs-3">
                  <div className="control-label ">Confirm Account Number:</div>
                </div>
                <div className="col-xs-6">
                  <input
                    type="text"
                    name="confirm_account_number"
                    className="form-control"
                    id="confirm_account_number"
                    placeholder="Confirm Account Number"
                    value={payout_merchant?.confirm_account_number}
                    onChange={handleInputChange}
                    onKeyPress={validate}
                  />
                </div>
              </div>
            </div>
            <div className="row m-t-10">
              <div className="col-xs-12">
                <div className="col-xs-3">
                  <div className="control-label ">IFSC:</div>
                </div>
                <div className="col-xs-6">
                  <input
                    type="text"
                    name="ifsc"
                    className="form-control"
                    id="ifsc"
                    placeholder="Enter IFSC"
                    value={payout_merchant?.ifsc}
                    onChange={handleIfscChange}
                  />
                </div>
              </div>
            </div>
            <div className="clearfix"></div>
            <div className="col-xs-12 col-md-7 m-t-40 text-center">
              <button className="submitBtn m-r-10" onClick={submitBankDetails}>
                Submit
              </button>
              <button
                className="btn btn-default m-r-10"
                onClick={cancelBankDetails}
              >
                Cancel
              </button>
            </div></> : <div className="sub_heading text-center">Access Denied</div>}
          
          </div>
        
          <div className="col-xs-7">
         {bankupiCountRoute && <span className="whitelist_info m-t-5">
         
         Maximum Credit Whitelist Count : {payout_merchant?.credit_whitelisting_count || 0}
            
            </span>}
         
      <div className="sub_heading">Bank List</div>
          
          <div className="table-responsive m-t-25">
            <table className="table table_customization">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Account Number</th>
                  <th>IFSC</th>
                  <th>Status</th>

                  {editBankRoute && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {bankListRoute ? (
                  <>
                    {payout_merchant?.bankAccountList.length > 0 ? (
                      payout_merchant?.bankAccountList?.map((lists, i) => {
                        return (
                          <tr key={i}>
                       <td>{(pageno - 1) * limit + (i + 1)}</td>
                            <td>{lists?.account?.name}</td>
                            <td>{lists?.account?.number}</td>
                            <td>{lists?.account?.ifsc}</td>
                            <td>
                              <span
                                className={
                                  lists.status == "active"
                                    ? "label_success pointer"
                                    : "label_warning pointer"
                                }
                                onClick={() => changeStatus(lists)}
                              >
                                {textCapitalize(lists?.status == "active"
                                  ? "WhiteListed"
                                  : lists?.status == "inactive"
                                  ? "Non Whitelisted"
                                  : "Non Whitelisted")}
                              </span>
                            </td>
              

                            <td>
                              {editBankRoute && (
                                <span
                                  onClick={() => editOpenBankModal(lists)}
                                  className="edit_text"
                                >
                                  Edit
                                </span>
                              )}
                            
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="text-center" colSpan="11">
                          No Records Found
                        </td>
                      </tr>
                    )}{" "}
                  </>
                ) : (
                  <tr>
                    <td className="text-center" colSpan="6">
                      Access Denied
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="table-bottom-content">
              <Pagination
                      handle={getBankAccount}
                      list={recordsLength}
                      currentpage={pageno}
                    /> 
                </div>
          </div>
           
          </div>
        </div>
      </div>
      <div>
        <Modal
          className="customized_modal_new"
          isOpen={payout_merchant.editBankModal}
          ariaHideApp={false}
        >
          <div
            className="modal modalbg fade in"
            style={{ display: "block", overflowX: "hidden", overflowY: "auto" }}
          >
            <div className="add_bank_modal">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="close font-28"
                      onClick={closeEditBankModal}
                    >
                      ×
                    </button>
                    <h4 className="modal-title modal-title-sapce">
                      Edit Bank Account
                    </h4>
                  </div>
                </div>
                <div className="modal-body clearfix modal_label_right">
                  <div className="modal-body clearfix">
                    <div className="form-group clearfix">
                      <label className="bank_detail_form col-md-4 m-t-7">
                        Name
                      </label>
                      <div className="col-xs-12 col-md-8 p-0">
                        <input
                          type="text"
                          name="edit_bank_account_name"
                          className="form-control"
                          id="edit_bank_account_name"
                          placeholder="Enter Name"
                          value={payout_merchant.edit_bank_account_name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group clearfix">
                      <label className="bank_detail_form col-md-4 m-t-7">
                        Account Number
                      </label>
                      <div className="col-xs-12 col-md-8 p-0">
                        <input
                          type="text"
                          name="edit_account_number"
                          className="form-control"
                          id="edit_account_number"
                          placeholder="Enter Account Number"
                          value={payout_merchant.edit_account_number}
                          onChange={handleInputChange}
                          onKeyPress={validate}
                        />
                      </div>
                    </div>
                    <div className="form-group clearfix">
                      <label className="bank_detail_form col-md-4">
                        Confirm Account Number
                      </label>
                      <div className="col-xs-12 col-md-8 p-0">
                        <input
                          type="text"
                          name="edit_confirm_account_number"
                          className="form-control"
                          id="edit_confirm_account_number"
                          placeholder="Confirm Account Number"
                          value={payout_merchant.edit_confirm_account_number}
                          onChange={handleInputChange}
                          onKeyPress={validate}
                        />
                      </div>
                    </div>
                    <div className="form-group clearfix">
                      <label className="bank_detail_form col-md-4 m-t-7">
                        IFSC
                      </label>
                      <div className="col-xs-12 col-md-8 p-0">
                        <input
                          type="text"
                          name="edit_ifsc"
                          className="form-control"
                          id="edit_ifsc"
                          placeholder="Enter IFSC"
                          value={payout_merchant.edit_ifsc}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="">
                      <div className="">
                        <div></div>
                        <div className="m-t-15">
                          <button
                            type="button"
                            className="submitBtn"
                            onClick={editBank}
                          >
                            Submit
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary m-l-10"
                            onClick={closeEditBankModal}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default MerchantBankDetails;
