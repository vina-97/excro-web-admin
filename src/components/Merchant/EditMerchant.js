import React, { useEffect, useState, useRef, useCallback } from "react";
import { imagePath } from "../../assets/ImagePath";
import ApexChart from "../Chart";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import { ToastProvider, useToasts } from "react-toast-notifications";
import ApiGateway from "../../DataServices/DataServices";
import Select from "react-select";
import {
  returnTimeZoneDate,
  validate,
  validateIPAddress,
} from "../../DataServices/Utils";
import Modal from "react-modal";
import Zoom from "react-medium-image-zoom";
import IPut from "iput";
import Loader from "../Loader";
import { CopyToClipboard } from "react-copy-to-clipboard";
import useRouteExist from "../../DataServices/useRouteExist";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import MerchantBankDetails from "./MerchantBankDetails";
import useRouteAllExist from "../../DataServices/useRouteAllExist";
import MerchantDebitBankDetails from "./DebitBankDetails";
import SplitDetails from "./SplitDetails/SplitDetails";

const EditMerchant = (props) => {
  const { payout_merchant, loading } = useSelector((state) => state);
  const dispatch = useDispatch();
  const latestValue = useRef({});
  const history = useHistory();
  latestValue.current = payout_merchant;

  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  const [selectMCC, setSelectMcc] = useState([]);
  const [selectClientType, setSelectClientType] = useState([]);
  const [selectEntityType, setSelectEntityType] = useState([]);
  const [state, setState] = useState({
    viewBalance: false,
    balance: {},
  });
  const [connectedBanking, setConnectedBanking] = useState(false);
  const accountBalanceRoute = useRouteExist(["admin-merchant-account-balance"]);
  const merchantProfileRoute = useRouteExist(["admin-merchant-detail"]);
  const addIpRoute = useRouteExist(["admin-merchant-get-key-list"]);
  const deleteIpRoute = useRouteExist(["admin-merchant-delete-ip"]);
  const addUpdateIpRoute = useRouteExist(["admin-merchant-update-ip"]);
  const keysListRoute = useRouteExist(["admin-merchant-get-key-list"]);
  const webhookRoute = useRouteExist(["admin-merchant-get-webhook"]);

  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };
  const stateChanges = (actionType, payload) => {
    return { type: actionType, payload };
  };
  const stateWebhookChanges = (payload) => {
    return { type: userConstants.PAYOUT_MERCHANT, payload };
  };

  const [whitelistedIps, setWhitelistedIps] = useState([]);
  const [newIp, setNewIp] = useState([""]);
  const [deleteIp, setDeleteIp] = useState([""]);

  useEffect(() => {
    dispatch(updateState(userConstants.LOADER, { loading: true }));
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        openMerchantTypeModal: false,
        mcc_name: "",
        mcc_code: "",
        mcc_id: "",
        client_type: "",
        client_id: "",
        entity_type: "",
        entity_id: "",
        type: "profile",
        showBankDetailsForm: false,
      })
    );
  }, []);
  useEffect(() => {
    payout_merchant?.type !== "splitDetails" && getMerchantDetail();
    if (payout_merchant?.type === "settings") {
      showKeysMerchant();
      getWebHookDetail();
    }
  }, [payout_merchant?.type]);

  useEffect(() => {
    if (payout_merchant.openMerchantTypeModal) {
      clientType();
      mccType();
      entityType();
    }
  }, [payout_merchant.openMerchantTypeModal]);

  useEffect(() => {
    setSelectMcc(
      payout_merchant.mcclist?.map((mcc, i) => {
        return { value: mcc.code, label: mcc.description, id: mcc.id };
      })
    );
  }, [payout_merchant.mcclist]);

  useEffect(() => {
    setSelectClientType(
      payout_merchant.clientList?.map((client, i) => {
        return { value: client.id, label: client.name };
      })
    );
  }, [payout_merchant.clientList]);

  useEffect(() => {
    setSelectEntityType(
      payout_merchant.entityList?.map((entity, i) => {
        return { value: entity.entity_id, label: entity.entity_name };
      })
    );
  }, [payout_merchant.entityList]);

  const getMerchantDetail = () => {
    dispatch(updateState(userConstants.LOADER, { loading: true }));
    ApiGateway.get(
      `/payout/admin/merchant/detail?merchant_id=${props.match.params.merchant_id}`,

      function (response) {
        if (response.success) {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          setConnectedBanking(response?.data?.merchant?.isConnectedBanking);
          dispatch(
            updateState(userConstants.PAYOUT_MERCHANT, {
              merchantDetail: response.data.merchant,
              accountDetail: response.data.account,
              mcc_name: response.data.merchant?.mcc?.name,
              mcc_code: response.data.merchant?.mcc?.code,
              mcc_id: response.data.merchant?.mcc?.id,
              client_type: response.data.merchant?.client_type?.name,
              client_id: response.data.merchant?.client_type?.code,
              entity_type: response.data.merchant?.entity?.name,
              entity_id: response.data.merchant?.entity?.code,
              /*      get_bank_details:response.data?.merchant?.whitelisted_account ? response.data.merchant?.whitelisted_account : "",
              get_account_number:response.data?.merchant?.whitelisted_account ? response.data?.merchant?.whitelisted_account?.account_no  : "",
              get_ifsc:response.data?.merchant?.whitelisted_account? response.data.merchant?.whitelisted_account?.ifsc : "",
              get_bank_account_name:response.data?.merchant.whitelisted_account ? response.data.merchant?.whitelisted_account?.name : "", */
            })
          ).then(() => {
            const payout_merchant = latestValue.current;
            getMainAccount(payout_merchant.accountDetail);
          });
        } else {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
        }
      }
    );
  };

  const getWebHookDetail = () => {
    ApiGateway.get(
      `/payout/admin/merchant/get/webhook?merchant_id=${props.match.params.merchant_id}`,
      function (response) {
        if (response.success) {
          {
            dispatch(
              updateState(userConstants.PAYOUT_MERCHANT, {
                webhookDetail: response?.data?.webhookDetails,
              })
            );
          }
        } else {
          applyToast(response.message, "error");
        }
      }
    );
  };
  const getMainAccount = (accountDetail) => {
    if (accountDetail) {
      Object.keys(accountDetail.van_accounts).map(function (key) {
        if (
          Object.values(accountDetail.van_accounts[key]).every(
            (x) => x !== null && x !== ""
          )
        ) {
          dispatch(
            stateChanges(userConstants.PAYOUT_MERCHANT, {
              mainAccount: payout_merchant.accountDetail.van_accounts[key],
            })
          );
        }
      });
    }
  };

  const getValue = (obj, val, nested_val) => {
    if (Object.keys(payout_merchant.merchantDetail).length !== 0) {
      if (payout_merchant.merchantDetail[obj] !== undefined) {
        if (nested_val === undefined) {
          return payout_merchant.merchantDetail[obj][val];
        } else if (payout_merchant.merchantDetail[obj][val] !== undefined) {
          return payout_merchant.merchantDetail[obj][val][nested_val];
        }
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  const currying_multiple = function (a) {
    return function (b) {
      if (a !== undefined && b !== undefined) {
        return currying_multiple(
          typeof a !== "string"
            ? a[b] || ""
            : payout_merchant.merchantDetail[a] !== undefined
            ? payout_merchant.merchantDetail[a][b] || ""
            : ""
        );
      }
      return a !== undefined ? a : "";
    };
  };

  const showToggle = (type) => {
    dispatch(updateState(userConstants.PAYOUT_MERCHANT, { type })).then(() => {
      // console.log("payout_merchant promise promise 123", latestValue.current);
    });
  };

  const setImage = (viewImage) => {
    dispatch(
      stateChanges(userConstants.PAYOUT_MERCHANT, {
        modalIsOpen: !payout_merchant.modalIsOpen,
        viewImage,
      })
    );
  };

  const showKeysMerchant = (merchant_id, idx) => {
    ApiGateway.get(
      `/payout/admin/merchant/get-keys-list?merchant_id=${props.match.params.merchant_id}`,
      function (response) {
        if (response.success) {
          var data = response.data.merchantKeys[0];
          dispatch(
            updateState(userConstants.PAYOUT_MERCHANT, {
              apiDetails: data,
              public_key: data.public_key,
              secret_key: data.private_key,
              webhook_url: data.webhooks?.core,
              whitelisted_ips: data.whitelisted_ips,
            })
          );
          setWhitelistedIps(data.whitelisted_ips);
        }
      }
    );
  };
  const updateWebHooks = () => {
    var data = {
      merchant_id: props.match.params.merchant_id,
      webhooks: {
        core: payout_merchant.webhook_url,
      },
    };
    ApiGateway.patch(
      `/payout/admin/properties/keys/webhook`,
      data,
      function (response) {
        if (response.success) {
          applyToast(response.message, "success");
        }
      }
    );
  };
  const handleWebhookChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      stateWebhookChanges(userConstants.PAYOUT_MERCHANT, { [name]: value })
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(stateChanges(userConstants.PAYOUT_MERCHANT, { [name]: value }));
  };

  // const iPchange = (i, e) => {
  //   console.log(i,"index")
  //   document.querySelectorAll(".error_msg")[i].style.display = "none";
  //   let newFormValues = [...newIp];
  //   newFormValues[i] = e.target.value;
  //   setNewIp(newFormValues);

  // };
  const handleIpChange = (i, e) => {
    // document.querySelectorAll(".error_msg")[i].style.display = "none";
    let newFormValues = [...whitelistedIps];
    newFormValues[i] = e.target.value;
    setWhitelistedIps(newFormValues);
  };

  const addIp = () => {
    let newFormValues = [...whitelistedIps];
    newFormValues.push("");
    setWhitelistedIps(newFormValues);

    // let newFormValues = [...newIp];
    // newFormValues.push("");
    // setNewIp(newFormValues);
  };
  const removeaddIp = (i) => {
    let newFormValues = [...newIp];
    newFormValues.splice(i, 1);
    setNewIp(newFormValues);
  };
  const removeIp = (i) => {
    let newFormValues = [...whitelistedIps];
    newFormValues.splice(i, 1);
    setWhitelistedIps(newFormValues);
    let data = {
      merchantId: props.match.params.merchant_id,
      ipAddress: newFormValues,
    };
    ApiGateway.patch(
      `/payout/admin/merchant/merchant-updateip`,
      data,
      (response) => {
        if (response.success) {
          applyToast("IP address Deleted", "success");
          showKeysMerchant();
        } else {
          applyToast(response.message, "error");
        }
      }
    );
  };

  const submitSettings = () => {
    let getValidIp = whitelistedIps.some((ip) => validateIPAddress(ip));
    if (getValidIp) {
      applyToast("Please enter Valid IP Address");
    } else {
      const uniqueElements = newIp.filter(
        (item) => item && !whitelistedIps.includes(item)
      );
      var data = {
        merchantId: props.match.params.merchant_id,
        ipAddress: whitelistedIps,
      };

      ApiGateway.patch(
        `/payout/admin/merchant/merchant-updateip`,
        data,
        function (response) {
          if (response.success) {
            setNewIp([""]);
            showKeysMerchant();
            applyToast(response.message, "success");
          } else {
            applyToast(response.message, "error");
          }
        }
      );
    }
  };

  const [copyFn, setCopyFn] = useState({
    publicKey: false,
    secretKey: false,
    webhook: false,
  });

  const copyTxt = (id) => {
    if (id == "publicKey") {
      setCopyFn({
        publicKey: true,
        secretKey: false,
        webhook: false,
      });
    } else if (id == "secretKey") {
      setCopyFn({
        publicKey: false,
        secretKey: true,
        webhook: false,
      });
    } else {
      setCopyFn({
        publicKey: false,
        secretKey: false,
        webhook: true,
      });
    }
  };

  const editMerchantType = () => {
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        openMerchantTypeModal: !payout_merchant.openMerchantTypeModal,
      })
    );
  };

  const closeMerchantTypeModal = () => {
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        openMerchantTypeModal: !payout_merchant.openMerchantTypeModal,
      })
    );
    getMerchantDetail();
  };

  const clientType = () => {
    ApiGateway.get("/payout/admin/merchant/get/client-types", (response) => {
      if (response.success) {
        dispatch(
          updateState(userConstants.PAYOUT_MERCHANT, {
            clientList: response.data.clientTypes,
          })
        );
      }
    });
  };
  const mccType = () => {
    ApiGateway.get("/payout/admin/merchant/get/mcc", (response) => {
      if (response.success) {
        dispatch(
          updateState(userConstants.PAYOUT_MERCHANT, {
            mcclist: response.data.mcc,
          })
        );
      }
    });
  };
  const entityType = () => {
    ApiGateway.get("/payout/admin/merchant/get/entities", (response) => {
      if (response.success) {
        dispatch(
          updateState(userConstants.PAYOUT_MERCHANT, {
            entityList: response.data.entities,
          })
        );
      }
    });
  };

  const handleSelect = (e, id) => {
    if (id == "mcc") {
      dispatch(
        updateState(userConstants.PAYOUT_MERCHANT, {
          mcc_code: e.value,
          mcc_name: e.label,
          mcc_id: e.id,
        })
      );
    } else if (id == "entity") {
      dispatch(
        updateState(userConstants.PAYOUT_MERCHANT, {
          entity_id: e.value,
          entity_type: e.label,
        })
      );
    } else {
      dispatch(
        updateState(userConstants.PAYOUT_MERCHANT, {
          client_id: e.value,
          client_type: e.label,
        })
      );
    }
  };

  const updateMerchantType = () => {
    if (!payout_merchant.entity_type) {
      applyToast("Please Select Entity Type", "error");
    } else if (!payout_merchant.client_type) {
      applyToast("Please Select Client Type", "error");
    } else if (!payout_merchant.mcc_name) {
      applyToast("Please Select MCC", "error");
    } else {
      dispatch(updateState(userConstants.LOADER, { loading: false }));
      const data = {
        merchantId: props.match.params.merchant_id,
        entity: {
          name: payout_merchant.entity_type,
          code: payout_merchant.entity_id,
        },
        client_type: {
          name: payout_merchant.client_type,
          code: payout_merchant.client_id,
        },
        mcc: {
          id: payout_merchant.mcc_id,
          mcc_code: payout_merchant.mcc_code,
          mcc_desc: payout_merchant.mcc_name,
        },
      };

      ApiGateway.patch(
        `/payout/admin/merchant/update/merchantType`,
        data,
        (response) => {
          if (response.success) {
            applyToast(response.message, "success");
            dispatch(updateState(userConstants.LOADER, { loading: true }));
            closeMerchantTypeModal();
          } else {
            applyToast(response.message, "error");

            setTimeout(() => {
              dispatch(updateState(userConstants.LOADER, { loading: true }));
              closeMerchantTypeModal();
            }, 5000);
          }
        }
      );
    }
  };

  const accountBalance = () => {
    ApiGateway.get(
      "/payout/admin/account/balance?merchantId=" +
        props.match.params.merchant_id,
      function (response) {
        if (response.success) {
          setState((prevState) => ({
            ...prevState,
            viewBalance: true,
            balance: response.data.account.available_balance,
          }));
        } else {
          applyToast(response.message, "error");
        }
      }
    );
  };

  const hidebalance = () => {
    setState((prevState) => ({
      ...prevState,
      viewBalance: false,
    }));
  };

  const cancelEditBankDetails = () => {
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        showBankDetailsForm: false,
      })
    );
  };

  const editbankDetails = () => {
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        showBankDetailsForm: true,
      })
    );
  };

  const previousPage = () => {
    history.push("/merchant");
  };
  return (
    <>
      <div className="content_wrapper dash_wrapper">
        {loading.loading && <Loader />}
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">
            Merchant -{" "}
            {payout_merchant?.merchantDetail?.businessName
              ? payout_merchant?.merchantDetail?.businessName
              : "-"}
            <div className="bread_crumb">
              <ul className="breadcrumb">
                <li>
                  <Link to="/dashboard" className="inactive_breadcrumb">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/merchant" className="inactive_breadcrumb">
                    Merchant
                  </Link>
                </li>
                <li className="active_breadcrumb">Edit Merchant</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="white_tab_wrap">
          <div className="white_tab_box">
            <ul className="nav nav-tabs customized_tab m-b-15">
              {merchantProfileRoute && (
                <li
                  className={payout_merchant.type === "profile" ? "active" : ""}
                >
                  <a onClick={() => showToggle("profile")}>Profile</a>
                </li>
              )}

              {/* <li className={payout_merchant.type === "kyc" ? "active" : ""}><a onClick={()=>showToggle("kyc")}>KYC</a></li> */}
              <li
                className={payout_merchant.type === "settings" ? "active" : ""}
              >
                <a onClick={() => showToggle("settings")}>Settings</a>
              </li>

              {connectedBanking ? (
                <>
                  <li
                    className={
                      payout_merchant.type === "debitbankdetails"
                        ? "active"
                        : ""
                    }
                  >
                    <a onClick={() => showToggle("debitbankdetails")}>
                      Debit Whitelist Bank{" "}
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li
                    className={
                      payout_merchant.type === "creditbankdetails"
                        ? "active"
                        : ""
                    }
                  >
                    <a onClick={() => showToggle("creditbankdetails")}>
                      Credit Whitelist Bank{" "}
                    </a>
                  </li>
                  <li
                    className={
                      payout_merchant.type === "debitbankdetails"
                        ? "active"
                        : ""
                    }
                  >
                    <a onClick={() => showToggle("debitbankdetails")}>
                      Debit Whitelist Bank{" "}
                    </a>
                  </li>
                </>
              )}
              <li
                className={
                  payout_merchant.type === "splitDetails" ? "active" : ""
                }
              >
                <a onClick={() => showToggle("splitDetails")}>Split Details</a>
              </li>
            </ul>

            <div className="tab-content">
              {payout_merchant.type === "profile" ? (
                merchantProfileRoute && (
                  <>
                    <div
                      className={
                        payout_merchant.type === "profile"
                          ? "tab-pane fade active in"
                          : "tab-pane fade"
                      }
                    >
                      <div className="form-group clearfix form-refrance-cls">
                        <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                          Display Name
                        </div>
                        <div className=" col-md-3 col-sm-3 col-xs-12">
                          <input
                            type="text"
                            className="form-control"
                            // value={currying_multiple("name")("full")()}
                            value={
                              payout_merchant.merchantDetail?.fullName
                                ? payout_merchant.merchantDetail?.fullName
                                : ""
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group clearfix form-refrance-cls">
                        <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                          Reseller Name
                        </div>
                        <div className=" col-md-3 col-sm-3 col-xs-12">
                          <input
                            type="text"
                            className="form-control"
                            // value={currying_multiple("name")("full")()}
                            value={
                              payout_merchant.merchantDetail?.reseller?.name
                                ? payout_merchant.merchantDetail?.reseller?.name
                                : ""
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group clearfix form-refrance-cls">
                        <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                          Business Name
                        </div>
                        <div className=" col-md-3 col-sm-3 col-xs-12">
                          <input
                            type="text"
                            className="form-control"
                            value={
                              payout_merchant.merchantDetail?.businessName
                                ? payout_merchant.merchantDetail?.businessName
                                : ""
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group clearfix form-refrance-cls">
                        <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                          PAN
                        </div>
                        <div className=" col-md-3 col-sm-3 col-xs-12">
                          <input
                            type="text"
                            className="form-control"
                            value={
                              payout_merchant.merchantDetail?.business?.panNo
                                ? payout_merchant.merchantDetail?.business
                                    ?.panNo
                                : ""
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group clearfix form-refrance-cls">
                        <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                          Phone Number
                        </div>
                        <div className=" col-md-3 col-sm-3 col-xs-12">
                          <input
                            type="text"
                            className="form-control"
                            value={
                              payout_merchant.merchantDetail?.phone?.number
                                ? payout_merchant.merchantDetail?.phone?.number
                                : ""
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group clearfix form-refrance-cls">
                        <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                          Business Email
                        </div>
                        <div className=" col-md-3 col-sm-3 col-xs-12">
                          <input
                            type="text"
                            className="form-control"
                            value={
                              payout_merchant.merchantDetail.email
                                ? payout_merchant.merchantDetail.email
                                : ""
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group clearfix form-refrance-cls">
                        <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                          Bank Id
                        </div>
                        <div className=" col-md-3 col-sm-3 col-xs-12">
                          <input
                            type="text"
                            className="form-control"
                            value={
                              payout_merchant.merchantDetail?.nodalAccount
                                ?.bankId
                                ? payout_merchant.merchantDetail?.nodalAccount
                                    ?.bankId
                                : ""
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      {accountBalanceRoute && (
                        <div className="form-group clearfix form-refrance-cls">
                          <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                            Account Balance
                          </div>
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            {!state.viewBalance ? (
                              <span
                                className="btn btn-xs submitBtn"
                                onClick={accountBalance}
                              >
                                View
                              </span>
                            ) : (
                              <>
                                <div className="input-group">
                                  <span className="input-group-addon">
                                    <i className="fa fa-rupee"></i>
                                  </span>
                                  <i
                                    className="fa fa-close close-balance"
                                    onClick={hidebalance}
                                  ></i>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={state.balance ? state.balance : ""}
                                    readOnly
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="sub_heading">
                          Merchant Type{" "}
                          <span
                            className="fa fa-edit edit_icon"
                            onClick={editMerchantType}
                          ></span>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                          <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                            Entity Type
                          </div>
                          <div className=" col-md-3 col-sm-3 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={
                                payout_merchant.merchantDetail?.entity?.name
                                  ? payout_merchant.merchantDetail?.entity?.name
                                  : ""
                              }
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                          <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                            Client Type
                          </div>
                          <div className=" col-md-3 col-sm-3 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={
                                payout_merchant.merchantDetail?.client_type
                                  ?.name
                                  ? payout_merchant.merchantDetail?.client_type
                                      ?.name
                                  : ""
                              }
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                          <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                            MCC
                          </div>
                          <div className=" col-md-3 col-sm-3 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={
                                payout_merchant.merchantDetail?.mcc?.name
                                  ? payout_merchant.merchantDetail?.mcc?.name
                                  : ""
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {/*  <div className="form-group clearfix form-refrance-cls">
                                    <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">Website URL</div>
                                    <div className=" col-md-5 col-sm-5 col-xs-12">
                                        <input type="text" className="form-control" value={currying_multiple("business")("website")()}  readOnly />
                                    </div>	 
                                </div>
                                <div className="form-group clearfix form-refrance-cls">
                                    <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">Master VAN</div>
                                    <div className=" col-md-5 col-sm-5 col-xs-12">
                                        <input type="text" className="form-control " value={payout_merchant.mainAccount.account_no}  readOnly />
                                    </div>	 
                                </div>
                            
                                <div className="form-group clearfix form-refrance-cls">
                                    <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">IFSC</div>
                                    <div className=" col-md-5 col-sm-5 col-xs-12">
                                        <input type="text" className="form-control " value={payout_merchant.mainAccount.ifsc}  readOnly />
                                    </div>	 
                                </div> */}
                    </div>
                  </>
                )
              ) : payout_merchant.type === "kyc" ? (
                <div
                  className={
                    payout_merchant.type === "kyc"
                      ? "tab-pane fade active in"
                      : "tab-pane fade"
                  }
                >
                  <div className="form-group clearfix form-refrance-cls">
                    <div className=" col-md-2 col-sm-3 col-xs-12 control-label">
                      Certificate of incorporation{" "}
                    </div>
                    <a
                      className=" col-md-4 col-sm-5 col-xs-12"
                      onClick={() =>
                        currying_multiple("documents")("status")() ===
                          "submitted" &&
                        currying_multiple("documents")("corporation")("image")(
                          "front"
                        )() !== "" &&
                        setImage(
                          currying_multiple("documents")("corporation")(
                            "image"
                          )("front")()
                        )
                      }
                    >
                      <img
                        className="img-thumbnail img_thumnail_height"
                        src={
                          currying_multiple("documents")("status")() ===
                          "submitted"
                            ? currying_multiple("documents")("corporation")(
                                "image"
                              )("front")()
                            : ""
                        }
                        onError={(e) => {
                          e.target.src = imagePath("./no_image.jpg").default;
                        }}
                        alt=""
                      />
                    </a>
                  </div>
                  <div className="form-group clearfix form-refrance-cls">
                    <div className=" col-md-2 col-sm-3 col-xs-12 control-label">
                      Company PAN card{" "}
                    </div>
                    <a
                      className=" col-md-4 col-sm-5 col-xs-12"
                      onClick={() =>
                        currying_multiple("documents")("status")() ===
                          "submitted" &&
                        currying_multiple("documents")("pan")("company")(
                          "image"
                        )("front")() !== "" &&
                        setImage(
                          currying_multiple("documents")("pan")("company")(
                            "image"
                          )("front")()
                        )
                      }
                    >
                      <img
                        className="img-thumbnail img_thumnail_height"
                        src={
                          currying_multiple("documents")("status")() ===
                          "submitted"
                            ? currying_multiple("documents")("pan")("company")(
                                "image"
                              )("front")()
                            : ""
                        }
                        onError={(e) => {
                          e.target.src = imagePath("./no_image.jpg").default;
                        }}
                        alt=""
                      />
                    </a>
                  </div>
                  <div className="form-group clearfix form-refrance-cls">
                    <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                      Company PAN card No.
                    </div>
                    <div className=" col-md-4 col-sm-5 col-xs-12">
                      <input
                        type="text"
                        className="form-control"
                        value={
                          currying_multiple("documents")("status")() ===
                          "submitted"
                            ? currying_multiple("documents")("pan")("company")(
                                "number"
                              )()
                            : ""
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="form-group clearfix form-refrance-cls">
                    <div className=" col-md-2 col-sm-3 col-xs-12 control-label">
                      GST Certificate (Optional)
                    </div>
                    <a
                      className=" col-md-4 col-sm-5 col-xs-12"
                      onClick={() =>
                        currying_multiple("documents")("status")() ===
                          "submitted" &&
                        currying_multiple("documents")("gst")("image")(
                          "front"
                        )() !== "" &&
                        setImage(
                          currying_multiple("documents")("gst")("image")(
                            "front"
                          )()
                        )
                      }
                    >
                      <img
                        className="img-thumbnail img_thumnail_height"
                        src={
                          currying_multiple("documents")("status")() ===
                          "submitted"
                            ? currying_multiple("documents")("gst")("image")(
                                "front"
                              )()
                            : ""
                        }
                        onError={(e) => {
                          e.target.src = imagePath("./no_image.jpg").default;
                        }}
                        alt=""
                      />
                    </a>
                  </div>
                  <div className="form-group clearfix form-refrance-cls">
                    <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                      GST No. (Optional)
                    </div>
                    <div className=" col-md-5 col-sm-5 col-xs-12">
                      <input
                        type="text"
                        className="form-control"
                        value={
                          currying_multiple("documents")("status")() ===
                          "submitted"
                            ? currying_multiple("documents")("gst")("number")()
                            : ""
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="form-group clearfix form-refrance-cls">
                    <div className=" col-md-2 col-sm-3 col-xs-12 control-label">
                      Authorized signatory PAN card{" "}
                    </div>
                    <a
                      className=" col-md-4 col-sm-5 col-xs-12"
                      onClick={() =>
                        currying_multiple("documents")("status")() ===
                          "submitted" &&
                        currying_multiple("documents")("pan")("individual")(
                          "image"
                        )("front")() !== "" &&
                        setImage(
                          currying_multiple("documents")("pan")("individual")(
                            "image"
                          )("front")()
                        )
                      }
                    >
                      <img
                        className="img-thumbnail img_thumnail_height"
                        src={
                          currying_multiple("documents")("status")() ===
                          "submitted"
                            ? currying_multiple("documents")("pan")(
                                "individual"
                              )("image")("front")()
                            : ""
                        }
                        onError={(e) => {
                          e.target.src = imagePath("./no_image.jpg").default;
                        }}
                        alt=""
                      />
                    </a>
                  </div>
                  <div className="form-group clearfix form-refrance-cls">
                    <div className=" col-md-2 col-sm-3 col-xs-12 control-label ">
                      Authorized signatory PAN No.{" "}
                    </div>
                    <div className=" col-md-4 col-sm-5 col-xs-12">
                      <input
                        type="text"
                        className="form-control"
                        value={
                          currying_multiple("documents")("status")() ===
                          "submitted"
                            ? currying_multiple("documents")("pan")(
                                "individual"
                              )("number")()
                            : ""
                        }
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              ) : payout_merchant.type === "settings" ? (
                <div
                  className={
                    payout_merchant.type === "settings"
                      ? "tab-pane fade active in"
                      : "tab-pane fade"
                  }
                >
                  <div className="white_tab_box">
                    {webhookRoute ? (
                      <div className="col-md-6 col-sm-6 col-xs-12 p-l-0">
                        <div className="sub_heading">Webhook URL</div>

                        {Object.keys(payout_merchant?.webhookDetail).length ? (
                          <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-30">
                            {/*    {payout_merchant?.webhookDetail
                              ?.bankAccountCredit && (
                              <>
                                {" "}
                                <div className="form-group clearfix form-refrance-cls">
                                  <div className="col-xs-4 control-label">
                                    Credit to Bank Account
                                  </div>
                                  <div className="col-md-7 col-sm-7 col-xs-12 input-group ">
                                    <input
                                      type="text"
                                      className="form-control disabled_input"
                                      value={
                                        payout_merchant?.webhookDetail
                                          ? payout_merchant?.webhookDetail
                                              ?.bankAccountCredit
                                          : "-"
                                      }
                                      name="bankAccountCredit"
                                      disabled
                                    />
                                    <CopyToClipboard
                                      text={
                                        payout_merchant?.webhookDetail
                                          ? payout_merchant?.webhookDetail
                                              ?.bankAccountCredit
                                          : "-"
                                      }
                                      onCopy={() =>
                                        applyToast(
                                          "Webhook for Credit to Bank Account copied to clipboard",
                                          "success"
                                        )
                                      }
                                    >
                                      <span className="input-group-addon pointer">
                                        <i className="fa fa-copy"></i>
                                      </span>
                                    </CopyToClipboard>
                                  </div>
                                </div>
                              </>
                            )} */}
                            {payout_merchant?.webhookDetail
                              ?.virtualAccountCredit && (
                              <div className="form-group clearfix form-refrance-cls">
                                <div className="col-xs-4 control-label">
                                  Credit to Virtual Account
                                </div>
                                <div className="col-md-7 col-sm-7 col-xs-12 input-group">
                                  <input
                                    type="text"
                                    className="form-control disabled_input"
                                    value={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.virtualAccountCredit
                                        : "-"
                                    }
                                    name="virtualAccountCredit"
                                    disabled
                                  />
                                  <CopyToClipboard
                                    text={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.virtualAccountCredit
                                        : "-"
                                    }
                                    onCopy={() =>
                                      applyToast(
                                        "Webhook for Credit to Virtual Account copied to clipboard",
                                        "success"
                                      )
                                    }
                                  >
                                    <span className="input-group-addon pointer">
                                      <i className="fa fa-copy"></i>
                                    </span>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            )}
                            {/*  {payout_merchant?.webhookDetail
                              ?.connectedBankingVACredit && (
                              <div className="form-group clearfix form-refrance-cls">
                                <div className="col-xs-4 control-label">
                                  Connected Banking
                                </div>
                                <div className="col-md-7 col-sm-7 col-xs-12 input-group">
                                  <input
                                    type="text"
                                    className="form-control disabled_input"
                                    value={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.connectedBankingVACredit
                                        : "-"
                                    }
                                    name="connectBankVACredit"
                                    disabled
                                  />
                                  <CopyToClipboard
                                    text={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.connectedBankingVACredit
                                        : "-"
                                    }
                                    onCopy={() =>
                                      applyToast(
                                        "Webhook for Connected Banking copied to clipboard",
                                        "success"
                                      )
                                    }
                                  >
                                    <span className="input-group-addon pointer">
                                      <i className="fa fa-copy"></i>
                                    </span>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            )} */}
                            {/*   {payout_merchant?.webhookDetail
                              ?.invalidUPICredit && (
                              <div className="form-group clearfix form-refrance-cls">
                                <div className="col-xs-4 control-label">
                                  Credit to Invalid UPI
                                </div>

                                <div className="col-md-7 col-sm-7 col-xs-12 input-group">
                                  <input
                                    type="text"
                                    className="form-control disabled_input"
                                    value={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.invalidUPICredit
                                        : "-"
                                    }
                                    name="invalidUPICredit"
                                    disabled
                                  />
                                  <CopyToClipboard
                                    text={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.invalidUPICredit
                                        : "-"
                                    }
                                    onCopy={() =>
                                      applyToast(
                                        "Webhook for Credit to Invalid UPI  copied to clipboard",
                                        "success"
                                      )
                                    }
                                  >
                                    <span className="input-group-addon pointer">
                                      <i className="fa fa-copy"></i>
                                    </span>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            )} */}
                            {/*    {payout_merchant?.webhookDetail
                              ?.invalidVACredit && (
                              <div className="form-group clearfix form-refrance-cls">
                                <div className="col-xs-4 control-label">
                                  Credit to Invalid Virtual Account
                                </div>
                                <div className="col-md-7 col-sm-7 col-xs-12 input-group">
                                  <input
                                    type="text"
                                    className="form-control disabled_input"
                                    value={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.invalidVACredit
                                        : "-"
                                    }
                                    name="invalidVACredit"
                                    disabled
                                  />
                                  <CopyToClipboard
                                    text={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.invalidVACredit
                                        : "-"
                                    }
                                    onCopy={() =>
                                      applyToast(
                                        "Webhook for Credit to Invalid Virtual Account copied to clipboard",
                                        "success"
                                      )
                                    }
                                  >
                                    <span className="input-group-addon pointer">
                                      <i className="fa fa-copy"></i>
                                    </span>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            )} */}
                            {payout_merchant?.webhookDetail
                              ?.bankAccountVerification && (
                              <div className="form-group clearfix form-refrance-cls">
                                <div className="col-xs-4 control-label">
                                  Bank Account Verification
                                </div>
                                <div className="col-md-7 col-sm-7 col-xs-12 input-group">
                                  <input
                                    type="text"
                                    className="form-control disabled_input"
                                    value={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.bankAccountVerification
                                        : "-"
                                    }
                                    name="bankAccountVerify"
                                    // onChange={handleWebhook}
                                    disabled
                                  />
                                  <CopyToClipboard
                                    text={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.bankAccountVerification
                                        : "-"
                                    }
                                    onCopy={() =>
                                      applyToast(
                                        "Webhook for Bank Account Verification copied to clipboard",
                                        "success"
                                      )
                                    }
                                  >
                                    <span className="input-group-addon pointer">
                                      <i className="fa fa-copy"></i>
                                    </span>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            )}
                            {payout_merchant?.webhookDetail
                              ?.upiIdVerification && (
                              <div className="form-group clearfix form-refrance-cls">
                                <div className="col-xs-4 control-label">
                                  UPI ID Verification
                                </div>
                                <div className="col-md-7 col-sm-7 col-xs-12 input-group">
                                  <input
                                    type="text"
                                    className="form-control disabled_input"
                                    value={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.upiIdVerification
                                        : "-"
                                    }
                                    name="upiIdVerify"
                                    disabled
                                  />
                                  <CopyToClipboard
                                    text={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.upiIdVerification
                                        : "-"
                                    }
                                    onCopy={() =>
                                      applyToast(
                                        "Webhook for UPI ID Verification copied to clipboard",
                                        "success"
                                      )
                                    }
                                  >
                                    <span className="input-group-addon pointer">
                                      <i className="fa fa-copy"></i>
                                    </span>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            )}
                            {payout_merchant?.webhookDetail?.fundTransfer && (
                              <div className="form-group clearfix form-refrance-cls">
                                <div className="col-xs-4 control-label">
                                  Fund Transfer
                                </div>
                                <div className="col-md-7 col-sm-7 col-xs-12 input-group">
                                  <input
                                    type="text"
                                    className="form-control disabled_input"
                                    value={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.fundTransfer
                                        : "-"
                                    }
                                    name="fundTransfer"
                                    disabled
                                  />
                                  <CopyToClipboard
                                    text={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.fundTransfer
                                        : "-"
                                    }
                                    onCopy={() =>
                                      applyToast(
                                        "Webhook for Fund Transfer copied to clipboard",
                                        "success"
                                      )
                                    }
                                  >
                                    <span className="input-group-addon pointer">
                                      <i className="fa fa-copy"></i>
                                    </span>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            )}
                            {payout_merchant?.webhookDetail
                              ?.fundTransferStatus && (
                              <div className="form-group clearfix form-refrance-cls">
                                <div className="col-xs-4 control-label">
                                  Fund Transfer Status
                                </div>
                                <div className="col-md-7 col-sm-7 col-xs-12 input-group">
                                  <input
                                    type="text"
                                    className="form-control disabled_input"
                                    value={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.fundTransferStatus
                                        : "-"
                                    }
                                    name="fundTransferStatus"
                                    disabled
                                  />
                                  <CopyToClipboard
                                    text={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.fundTransferStatus
                                        : "-"
                                    }
                                    onCopy={() =>
                                      applyToast(
                                        "Webhook for Fund Transfer Status copied to clipboard",
                                        "success"
                                      )
                                    }
                                  >
                                    <span className="input-group-addon pointer">
                                      <i className="fa fa-copy"></i>
                                    </span>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            )}
                            {/*    {payout_merchant?.webhookDetail
                              ?.upiCollectionStatus && (
                              <div className="form-group clearfix form-refrance-cls">
                                <div className="col-xs-4 control-label">
                                  UPI Collection Status
                                </div>
                                <div className="col-md-7 col-sm-7 col-xs-12 input-group">
                                  <input
                                    type="text"
                                    className="form-control disabled_input"
                                    value={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.upiCollectionStatus
                                        : "-"
                                    }
                                    name="upiCollectStatus"
                                    disabled
                                  />
                                  <CopyToClipboard
                                    text={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.upiCollectionStatus
                                        : "-"
                                    }
                                    onCopy={() =>
                                      applyToast(
                                        "Webhook for UPI Collection Status copied to clipboard",
                                        "success"
                                      )
                                    }
                                  >
                                    <span className="input-group-addon pointer">
                                      <i className="fa fa-copy"></i>
                                    </span>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            )} */}
                            {payout_merchant?.webhookDetail
                              ?.lowBalanceAccount && (
                              <div className="form-group clearfix form-refrance-cls">
                                <div className="col-xs-4 control-label">
                                  Account Low Balance
                                </div>
                                <div className="col-md-7 col-sm-7 col-xs-12 input-group">
                                  <input
                                    type="text"
                                    className="form-control disabled_input"
                                    value={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.lowBalanceAccount
                                        : "-"
                                    }
                                    name="lowBalance"
                                    disabled
                                  />
                                  <CopyToClipboard
                                    text={
                                      payout_merchant?.webhookDetail
                                        ? payout_merchant?.webhookDetail
                                            ?.lowBalanceAccount
                                        : "-"
                                    }
                                    onCopy={() =>
                                      applyToast(
                                        "Webhook for Account Low Balance copied to clipboard",
                                        "success"
                                      )
                                    }
                                  >
                                    <span className="input-group-addon pointer">
                                      <i className="fa fa-copy"></i>
                                    </span>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="clearfix light col-xs-12">
                            No Webhook Details Found
                          </div>
                        )}
                        {/*  <div className="col-xs-12 col-md-8 m-t-20 text-center m-b-40">
                          <button
                            className="submitBtn m-r-10"
                            onClick={updateWebHooks}
                          >
                            Save Webhooks
                          </button>
                        </div> */}
                      </div>
                    ) : (
                      <div className="text-center sub_heading">
                        Access Denied
                      </div>
                    )}

                    <div className="col-xs-12 col-sm-6">
                      {keysListRoute && (
                        <>
                          <div className="sub_heading">Whitelisted IP's</div>
                          <p className="col-xs-12 m-b-20 light">
                            Configure which IP addresses can access your
                            account.
                          </p>
                          <div
                            className="col-xs-12 col-md-7"
                            id="whitelisted_ip"
                          >
                            {/* {newIp?.map((value, i) => {
                              return (
                                <div className="whitelisted_ip_section" key={i}>
                                  <div className="whitelisted_ip_section_inner">
                                    <input
                                      placeholder="Enter IP Address"
                                      className="whitelisted_ip_section_address"
                                      value={value}
                                      name="value"
                                      onChange={(e) => iPchange(i, e)}
                                    />
                                    <span
                                      className="whitelisted_ip_section_remove"
                                      onClick={() => removeaddIp(i)}
                                    >
                                      <i className="fa fa-close"></i> Delete
                                    </span>
                                  </div>
                                  <div className={"error_msg ip_" + i}>
                                    Please check the IP is correct or not
                                  </div>
                                </div>
                              );
                            })} */}
                            {whitelistedIps?.map((ip, i) => {
                              return (
                                <div className="whitelisted_ip_section" key={i}>
                                  <div className="whitelisted_ip_section_inner">
                                    <input
                                      placeholder="Enter IP Address"
                                      className="whitelisted_ip_section_address"
                                      value={ip}
                                      onChange={(e) => handleIpChange(i, e)}
                                    />
                                    {deleteIpRoute && (
                                      <span
                                        className="whitelisted_ip_section_remove"
                                        onClick={() => removeIp(i)}
                                      >
                                        <i className="fa fa-close"></i> Delete
                                      </span>
                                    )}
                                  </div>
                                  {/* <div className={"error_msg ip_" + i}>
                                    Please check the IP is correct or not
                                  </div> */}
                                </div>
                              );
                            })}
                          </div>
                          <div className="clearfix"></div>
                          <div className="col-xs-12 col-md-7">
                            <button
                              className="btn btn-default pull-right"
                              onClick={() => addIp()}
                            >
                              Add IP Address
                            </button>
                          </div>
                          <div className="clearfix"></div>
                          {addUpdateIpRoute && (
                            <div className="col-xs-12 col-md-7 m-t-40 text-center">
                              <button
                                className="submitBtn m-r-10"
                                onClick={submitSettings}
                              >
                                Save Whitelisted Ip's
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      <div>
                        <div className="clearfix"></div>
                        {/* {payout_merchant?.showBankDetailsForm || payout_merchant?.bank_details === "" ?  
                       <div>
                    <div className="sub_heading">Bank Detail's</div>
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
                            
                              />
                            </div>
                          </div>
                        </div>
                        <div className="clearfix"></div>
                            <div className="col-xs-12 col-md-7 m-t-40 text-center">
                              <button
                                className="submitBtn m-r-10"
                                onClick={submitBankDetails}
                              >
                                Submit
                              </button>
                              {payout_merchant?.showBankDetailsForm ? <button
                                className="btn btn-default m-r-10"
                                onClick={cancelEditBankDetails}
                              >
                                Cancel
                              </button> : null}
                            </div>
                    </div> :  
                    <div>
                    <div className="sub_heading">Bank Detail's   <span
                            className="fa fa-edit edit_icon"
                            onClick={editbankDetails}
                          ></span></div>
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
                               
                                value={payout_merchant?.bank_account_name}
                              readOnly
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
                                value={payout_merchant?.account_number}
                                
                                readOnly
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
                                value={payout_merchant?.ifsc}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                        
                    </div>} */}
                      </div>
                    </div>
                  </div>
                </div>
              ) : payout_merchant.type === "splitDetails" ? (
                <>
                  <SplitDetails getProps={props} />
                </>
              ) : (
                <>
                  <div
                    className={
                      payout_merchant.type === "creditbankdetails"
                        ? "tab-pane fade active in"
                        : "tab-pane fade"
                    }
                  >
                    <div className="white_tab_box">
                      {payout_merchant.type === "creditbankdetails" && (
                        <MerchantBankDetails props={props} />
                      )}
                    </div>
                  </div>
                  <div
                    className={
                      payout_merchant.type === "debitbankdetails"
                        ? "tab-pane fade active in"
                        : "tab-pane fade"
                    }
                  >
                    <div className="white_tab_box">
                      {payout_merchant.type === "debitbankdetails" && (
                        <MerchantDebitBankDetails props={props} />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <Modal
              className="customized_modal_new"
              isOpen={payout_merchant.modalIsOpen}
              ariaHideApp={false}
            >
              <div className="modal-dialog modal-xs">
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="close"
                      onClick={() => setImage("")}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    <Zoom>
                      <img
                        src={payout_merchant.viewImage}
                        height="300"
                        width="420"
                      />
                    </Zoom>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
      <Modal
        className="customized_modal_new"
        isOpen={payout_merchant.openMerchantTypeModal}
        ariaHideApp={false}
      >
        <div
          className="modal modalbg fade in"
          style={{ display: "block", overflowX: "hidden", overflowY: "auto" }}
        >
          <div className="modal-dialog">
            {!loading.loading && <Loader />}
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close font-28"
                  onClick={closeMerchantTypeModal}
                >
                  ×
                </button>
                <h4 className="modal-title modal-title-sapce">
                  Edit Merchant Type
                </h4>
              </div>
              <div className="modal-body clearfix modal_label_right">
                <div className="row m-b-15">
                  <div className="col-md-3 control-label m-t-8">
                    Entity Type
                  </div>
                  <div className="col-md-3">
                    <Select
                      className=" w-250"
                      options={selectEntityType}
                      onChange={(e) => {
                        handleSelect(e, "entity");
                      }}
                      classNamePrefix={"react-select"}
                      defaultValue={{
                        label: payout_merchant.entity_type,
                        value: payout_merchant.entity_id,
                      }}
                    />
                  </div>
                </div>
                <div className="row m-b-15">
                  <div className="col-md-3 control-label m-t-8">
                    Client Type
                  </div>
                  <div className="col-md-3">
                    <Select
                      className="selectpicker w-250"
                      options={selectClientType}
                      onChange={(e) => {
                        handleSelect(e, "client");
                      }}
                      defaultValue={{
                        label: payout_merchant.client_type,
                        value: payout_merchant.client_id,
                      }}
                      classNamePrefix={"react-select"}
                    />
                  </div>
                </div>
                <div className="row m-b-15">
                  <div className="col-md-3 control-label m-t-8">MCC</div>
                  <div className="col-md-3">
                    <Select
                      className="selectpicker w-250"
                      options={selectMCC}
                      defaultValue={{
                        label: payout_merchant.mcc_name,
                        value: payout_merchant.mcc_code,
                      }}
                      onChange={(e) => {
                        handleSelect(e, "mcc");
                      }}
                      classNamePrefix={"react-select"}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <span className="submitBtn" onClick={updateMerchantType}>
                    Submit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default React.memo(EditMerchant);
