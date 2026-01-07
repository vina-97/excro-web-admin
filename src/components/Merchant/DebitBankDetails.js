import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { textCapitalize } from "../../DataServices/Utils";
import ApiGateway from "../../DataServices/DataServices";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import Loader from "../Loader";
import Pagination from "../Pagination";
import useRouteExist from "../../DataServices/useRouteExist";

function MerchantDebitBankDetails(props) {
  const { loading, payout_merchant } = useSelector((state) => state);
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };

  const debitBankRoute =useRouteExist(["admin-merchant-debit-bank-list"]);
  const debitUPIRoute =useRouteExist(["admin-merchant-debit-upi-list"]);
  const debitWhitelistBankRoute =useRouteExist(["admin-merchant-debit-bank-Whitelist"]);
  const debitWhitelistUPIRoute =useRouteExist(["admin-merchant-debit-upi-whitelist"]);
  const bankupiCountRoute =useRouteExist(["admin-get-bank-upi-count"]);

  
  const [pageno, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [recordsLength, setrecordLength] = useState([]);
  const dispatch = useDispatch();

  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };

  useEffect(() => {
    if (
      payout_merchant.WhitelistType ||
      props?.props.match.params.merchant_id
    ) {
      getBankAccount(pageno);
      setPageNo(1)
    }
  }, [payout_merchant.WhitelistType, props?.props.match.params.merchant_id]);

  useEffect(() => {
    if (
      props.props.match.params.merchant_id ||
      payout_merchant.checkWhitelist ||
      payout_merchant.WhitelistType
    ) {
      getSettingDetails();
    }
  }, [
    props.props.match.params.merchant_id,
    payout_merchant.checkWhitelist,
    payout_merchant.WhitelistType,
  ]);

  const getSettingDetails = () => {
    ApiGateway.get(
      `/payout/admin/default-setting?merchant_id=${props?.props.match.params.merchant_id}`,
      function (response) {
        if (response.success) {
          dispatch(
            updateState(userConstants.PAYOUT_MERCHANT, {
              debit_whitelisting_count:
                response?.data?.settings?.settings?.beneficiary_whitelist?.debit
                  ?.limit || 0,
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
      `/payout/admin/beneficiary/${payout_merchant.WhitelistType}/list?merchant_id=${props.props.match.params.merchant_id}&page=${page}&limit=${limit}`,
      (response) => {
        if (response.success) {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          if (payout_merchant.WhitelistType === "bank") {
            dispatch(
              updateState(userConstants.PAYOUT_MERCHANT, {
                debitBankWhiteList: response?.data?.beneficiariesList
                  ? response?.data?.beneficiariesList
                  : [],
              })
            );
            setrecordLength(response?.data?.beneficiariesList?.length);
          } 
          else if (payout_merchant.WhitelistType === "upi") {
            dispatch(
              updateState(userConstants.PAYOUT_MERCHANT, {
                debitUpiWhiteList: response?.data?.upis
                  ? response?.data?.upis
                  : [],
              })
            );
            setrecordLength(response?.data?.upis?.length);
          }

        } 
        else {
          applyToast(response.message, "error");
          dispatch(updateState(userConstants.LOADER, { loading: false }));
        }
      }
    );
  };

  const enableDisbaleBeneficiary = (id) => {
    const data = {
      is_whitelisted:
        id.is_whitelisted === true
          ? false
          : id.is_whitelisted === false
          ? true
          : true,
    };
    dispatch(updateState(userConstants.LOADER, { loading: true }));
    ApiGateway.patch(
      `/payout/admin/beneficiary/whitelist/bank/${id?.beneficiary_id}`,
      data,
      (response) => {
        if (response.success) {
          applyToast(response.message, "success");
          dispatch(
            updateState(userConstants.PAYOUT_MERCHANT, {
              checkWhitelist: true,
            })
          );
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          getBankAccount(pageno);
        } else {
          applyToast(response.message, "error");
          dispatch(updateState(userConstants.LOADER, { loading: false }));
        }
      }
    );
  };
  const enableDisbaleUPIBeneficiary = (id) => {
    const data = {
      is_whitelisted:
        id.is_whitelisted === true ? false : id.status === false ? true : true,
    };
    dispatch(updateState(userConstants.LOADER, { loading: true }));
    ApiGateway.patch(
      `/payout/admin/beneficiary/whitelist/upi/${id?.upi_id}`,
      data,
      (response) => {
        if (response.success) {
          applyToast(response.message, "success");
          dispatch(
            updateState(userConstants.PAYOUT_MERCHANT, {
              checkWhitelist: true,
            })
          );
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          getBankAccount(pageno);
        } else {
          applyToast(response.message, "error");
          dispatch(updateState(userConstants.LOADER, { loading: false }));
        }
      }
    );
  };
  const showToggle = (WhitelistType) => {
    dispatch(updateState(userConstants.PAYOUT_MERCHANT, { WhitelistType }));
  };

  return (
    <>
      <div className="tab-content">
        {loading.loading && <Loader />}
        <div className="row">
          <div className="col-xs-7">
            <ul className="nav nav-tabs customized_tab m-b-15">
              
              <li
                className={
                  payout_merchant.WhitelistType === "bank" ? "active" : ""
                }
              >
                <a onClick={() => showToggle("bank")}>Bank</a>
              </li>
              <li
                className={
                  payout_merchant.WhitelistType === "upi" ? "active" : ""
                }
              >
                <a onClick={() => showToggle("upi")}>UPI</a>
              </li>
            </ul>
            {bankupiCountRoute &&  <span className="whitelist_info m-t-5">
              Maximum Debit Whitelist Count :{" "}
              {payout_merchant?.debit_whitelisting_count || 0}
            </span>}
           
            {payout_merchant.WhitelistType === "bank" && (
              <>
                <div className="sub_heading">Bank List</div>

                <div className="table-responsive m-t-25">
                  <table className="table table_customization">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Account Number</th>
                        <th>IFSC</th>
                      {debitWhitelistBankRoute && <th>Status</th>}  
                      </tr>
                    </thead>
                    <tbody>


                      {debitBankRoute ? payout_merchant?.debitBankWhiteList.length > 0 ? (
                        payout_merchant?.debitBankWhiteList?.map((lists, i) => {
                          return (
                            <tr key={i}>
                         <td>{(pageno - 1) * limit + (i + 1)}</td>
                              <td>
                                {lists?.bank_info?.account_holder_name || "-"}
                              </td>
                              <td>{lists?.bank_info?.acc_no || ""}</td>
                              <td>{lists?.bank_info?.ifsc}</td>
{debitWhitelistBankRoute && <td>
                                <span
                                  className={
                                    lists.is_whitelisted === true
                                      ? "label_success pointer m-l-5"
                                      : "label_warning pointer m-l-5"
                                  }
                                  onClick={() =>
                                    enableDisbaleBeneficiary(lists)
                                  }
                                >
                                  {textCapitalize(
                                    lists?.is_whitelisted === true
                                      ? "Whitelisted"
                                      : "NonWhitelisted"
                                  )}
                                </span>
                              </td>}
                              
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="text-center" colSpan="11">
                            No Records Found
                          </td>
                        </tr>
                      ) : <tr>
                      <td className="text-center" colSpan="11">
                        Access Denied
                      </td>
                    </tr>}
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
              </>
            )}
            {payout_merchant.WhitelistType === "upi" && (
              <>
                <div className="sub_heading">UPI List</div>

                <div className="table-responsive m-t-25">
                  <table className="table table_customization">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>UPI ID</th>
                        <th>Refrance ID</th>
                     {debitWhitelistUPIRoute && <th>Status</th>}   
                      </tr>
                    </thead>
                    <tbody>
                      {debitUPIRoute ? payout_merchant?.debitUpiWhiteList.length > 0 ? (
                        payout_merchant?.debitUpiWhiteList?.map((lists, i) => {
                          return (
                            <tr key={i}>
                          <td>{(pageno - 1) * limit + (i + 1)}</td>
                              <td>{lists?.name || "-"}</td>
                              <td>{lists?.vpa || ""}</td>
                              <td>{lists?.upi_id || ""}</td>
         
{debitWhitelistUPIRoute && <td>
                                <span
                                  className={
                                    lists.is_whitelisted === true
                                      ? "label_success pointer m-l-5"
                                      : "label_warning pointer m-l-5"
                                  }
                                  onClick={() =>
                                    enableDisbaleUPIBeneficiary(lists)
                                  }
                                >
                                  {textCapitalize(
                                    lists?.is_whitelisted === true
                                      ? "Whitelisted"
                                      : "NonWhitelisted"
                                  )}
                                </span>
                              </td>}
                              
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="text-center" colSpan="11">
                            No Records Found
                          </td>
                        </tr>
                      ) : <tr>
                      <td className="text-center" colSpan="11">
                        Access Denied
                      </td>
                    </tr>}
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
              </>
            )}
          </div>
        </div>
      </div>
      <div></div>
    </>
  );
}

export default MerchantDebitBankDetails;
