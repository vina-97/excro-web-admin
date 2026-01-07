import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { useToasts } from "react-toast-notifications";
import { userConstants } from "../../constants/ActionTypes";
import ApiGateway from "../../DataServices/DataServices";
import Modal from "react-modal";
import { textCapitalize } from "../../DataServices/Utils";
import Pagination from "../Pagination";
import Loader from "../Loader";
import useRouteExist from "../../DataServices/useRouteExist";
import ResellerSelect from "./components/ResellerSelect";

export default function NodalList() {
  const { nodal_account } = useSelector((state) => state);
  const dispatch = useDispatch();
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };
  const nodalListRoute = useRouteExist(["admin-escrow-account-list"]);
  const nodalStatusRoute = useRouteExist([
    "admin-escrow-account-status-update",
  ]);
  const location = useLocation();
  const navigate = useHistory();
  const nodalDetailRoute = useRouteExist(["admin-escrow-account-detail"]);
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  const [state, setState] = useState({ loading: false });
  const [recordsLength, setrecordLength] = useState([]);

  const params = new URLSearchParams(location.search);

  const [searchState, setSearchState] = useState({
    reseller: {
      id: params.get("resellerId") ? params.get("resellerId") : "",
      name: params.get("resellerName") ? params.get("resellerName") : "",
    },
  });

  const { reseller, limit, page } = searchState;
  console.log(page, "inside", params.get("page"), typeof params.get("page"));

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams(location.search);
    const newState = {
      page: Number(params.get("page")) || 1,
      limit: Number(params.get("limit")) || 10,
      reseller: {
        id: params.get("resellerId") ? params.get("resellerId") : "",
        name: params.get("resellerName") ? params.get("resellerName") : "",
      },
    };
    console.log("first", newState);
    setSearchState(newState);
    nodalAccountList(newState, isMounted);
    return () => {
      isMounted = false; // cleanup on unmount
    };
  }, [location.search]);

  const buildQueryParams = (paramsObj) => {
    const query = new URLSearchParams();
    query.set("page", paramsObj.page || 1);
    query.set("limit", paramsObj.limit || 10);

    if (paramsObj.reseller?.id)
      query.set("reseller.id", paramsObj.reseller?.id);

    return query.toString();
  };

  const nodalAccountList = useCallback((paramsObj, isMounted = true) => {
    console.log("second", paramsObj);

    const baseUrl = `/payout/admin/nodal/list`;

    const queryParams = buildQueryParams(paramsObj);
    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    ApiGateway.get(url, function (response) {
      if (!isMounted) return;
      if (response.success) {
        const filteredDatas = response.data?.accounts || [];

        dispatch(
          updateState(userConstants.NODAL_ACCOUNT, {
            list: filteredDatas || [],
          })
        );
        setrecordLength(filteredDatas?.length);
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      } else {
        setrecordLength([]);
        dispatch(
          updateState(userConstants.NODAL_ACCOUNT, {
            list: [],
          })
        );
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    });
  }, []);

  const handlePageChange = (selectedpage) => {
    console.log(selectedpage);

    const query = new URLSearchParams(location.search);
    const newSearchPageState = {
      reseller: {
        id: params.get("resellerId") ? params.get("resellerId") : "",
        name: params.get("resellerName") ? params.get("resellerName") : "",
        page: selectedpage,
      },
    };
    console.log("first", newSearchPageState);
    setSearchState(newSearchPageState);
    const { page, reseller, ...restState } = searchState;

    Object.entries(restState).forEach(([key, value]) => {
      if (page) {
        query.set("page", selectedpage);
      }
      if (value) {
        query.set(key, value);
      }
    });
    navigate.push({
      pathname: "/escrow-pool-accounts",
      search: `?${query.toString()}`,
    });
  };

  const openAccountDetail = (account_id) => {
    ApiGateway.get(
      `/payout/admin/nodal/detail?account_id=${account_id}`,
      function (response) {
        if (response.success) {
          dispatch(
            updateState(userConstants.NODAL_ACCOUNT, {
              nodalDetail: response.data.account,
              openDetailModal: !nodal_account.openDetailModal,
            })
          );
        } else {
          applyToast(response.message, "error");
        }
      }
    );
  };

  const closeAccountDetailModal = () => {
    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        openDetailModal: !nodal_account.openDetailModal,
      })
    );
  };

  const changeStatus = (id) => {
    const data = {
      account_id: id.account_id,
      status:
        id.status == "active"
          ? "inactive"
          : id.status == "inactive"
          ? "active"
          : id.status,
    };
    ApiGateway.patch(`/payout/admin/nodal/update`, data, (response) => {
      if (response.success) {
        applyToast(response.message, "success");
        nodalAccountList(searchState);
      } else {
        applyToast(response.message, "error");
      }
    });
  };

  const handleChangeSelect = (selected, name) => {
    setSearchState((prevState) => ({
      ...prevState,
      reseller: {
        id: selected ? selected.value : "",
        name:
          selected && selected.label
            ? selected.label.replace(/^Reseller\s*/, "")
            : "",
      },
    }));

    const query = new URLSearchParams();
    const { reseller, ...restState } = searchState;
    Object.entries(restState).forEach(([key, value]) => {
      if (selected?.value) {
        query.set("resellerId", selected?.value);
        query.set("resellerName", selected.label.replace(/^Reseller\s*/, ""));
      }
      if (value) {
        query.set(key, value);
      }
    });
    navigate.push({
      pathname: "/escrow-pool-accounts",
      search: `?${query.toString()}`,
    });

    console.log("Selected Reseller ID:", name, selected ? selected.value : "");
  };
  console.log(reseller);

  return (
    <>
      <div className="content_wrapper dash_wrapper">
        {state.loading && <Loader />}
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">
            Escrow / Accounts List
            <div className="bread_crumb">
              <ul className="breadcrumb">
                <li>
                  <Link to="/dashboard" className="inactive_breadcrumb">
                    Home
                  </Link>
                </li>
                <li className="active_breadcrumb">Escrow / Accounts</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="white_tab_wrap">
          <div className="white_tab_box">
            <div>
              <div className="panel-body">
                <div className="row">
                  <div className="col-md-8 col-sm-8">
                    <div className="form-group">
                      {/* Label above the select */}
                      <div className="row">
                        <div className="col-xs-12">
                          <label className="control-label">
                            Select Reseller:
                          </label>
                        </div>
                      </div>
                      <div className="row mt-10">
                        <div className="col-xs-5">
                          <ResellerSelect
                            value={
                              reseller?.id
                                ? { value: reseller.id, label: reseller.name }
                                : null
                            }
                            onChange={(e) => handleChangeSelect(e, "id")}
                            from="reseller"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-12">
                    <div className="pull-right">
                      <Link
                        className="btn btn-primary"
                        to="/escrow-pool-accounts/escrow-pool-accounts"
                      >
                        <span className="glyphicon glyphicon-plus"></span> Add
                        Account
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12">
                <div className="table-responsive">
                  <table className="table table_customization">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Bank Name</th>
                        {nodalDetailRoute && <th>Account ID</th>}
                        <th>Account Number</th>
                        <th>IFSC</th>
                        {nodalStatusRoute && <th>Status</th>}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nodalListRoute ? (
                        <>
                          {nodal_account?.list?.map((lists, i) => {
                            return (
                              <tr key={i}>
                                <td>{(page - 1) * limit + (i + 1)}</td>
                                <td>{textCapitalize(lists?.name)}</td>
                                <td>{textCapitalize(lists?.bank_name)}</td>
                                {nodalDetailRoute && (
                                  <td>
                                    <span
                                      className="label_edit pointer"
                                      onClick={() =>
                                        openAccountDetail(lists?.account_id)
                                      }
                                    >
                                      {lists?.account_id}
                                    </span>
                                  </td>
                                )}
                                <td>{lists?.account_number}</td>
                                <td>{lists?.ifsc}</td>
                                {nodalStatusRoute && (
                                  <td>
                                    <span
                                      className={
                                        lists.status == "active"
                                          ? "label_success pointer"
                                          : "label_warning pointer"
                                      }
                                      onClick={() => changeStatus(lists)}
                                    >
                                      {textCapitalize(lists?.status)}
                                    </span>
                                  </td>
                                )}
                                <td>
                                  <Link
                                    to={`/escrow-pool-accounts/escrow-pool-accounts/${lists?.account_id}`}
                                  >
                                    Edit
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </>
                      ) : (
                        <tr>
                          <td className="text-center" colSpan="8">
                            Access Denied
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="table-bottom-content">
                  <Pagination
                    handle={handlePageChange}
                    list={recordsLength}
                    currentpage={page}
                  />
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      </div>
      <Modal
        className="customized_modal_new"
        isOpen={nodal_account?.openDetailModal}
        ariaHideApp={false}
      >
        <div
          className="modal modalbg fade in"
          style={{ display: "block", overflowX: "hidden", overflowY: "auto" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close font-28"
                  onClick={closeAccountDetailModal}
                >
                  ×
                </button>
                <h4 className="modal-title modal-title-sapce">
                  Nodal Account Detail -
                  {nodal_account?.nodalDetail?.account_id}
                </h4>
              </div>
              <div className="modal-body clearfix">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="info_title">Name</div>
                    <div className="info_value">
                      {nodal_account?.nodalDetail?.name}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="info_title">Bank Name</div>
                    <div className="info_value">
                      {nodal_account?.nodalDetail?.bank_name}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="info_title">IFSC</div>
                    <div className="info_value">
                      {nodal_account?.nodalDetail?.ifsc}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="info_title">Bank Code</div>
                    <div className="info_value">
                      {nodal_account?.nodalDetail?.bank_code}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="info_title">Corporate Code</div>
                    <div className="info_value">
                      {nodal_account?.nodalDetail?.corp_code}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="info_title">Status</div>
                    <div className="info_value">
                      {nodal_account?.nodalDetail?.status}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="info_title">UPI Enabled</div>
                    <div className="info_value">
                      {nodal_account?.nodalDetail?.isUpiEnabled == true
                        ? "Yes"
                        : nodal_account?.nodalDetail?.isUpiEnabled == false
                        ? "No"
                        : "-"}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="info_title">Fund Transfer Enabled</div>
                    <div className="info_value">
                      {[
                        nodal_account?.nodalDetail?.isFtEnabled?.imps && "IMPS",
                        nodal_account?.nodalDetail?.isFtEnabled?.neft && "NEFT",
                        nodal_account?.nodalDetail?.isFtEnabled?.rtgs && "RTGS",
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="info_title">Bank Verification Enabled</div>
                    <div className="info_value">
                      {[
                        nodal_account?.nodalDetail?.isBankVerificationEnabled
                          ?.direct && "Pennyless",
                        nodal_account?.nodalDetail?.isBankVerificationEnabled
                          ?.indirect && "Pennydrop",
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="info_title">VPA Validation Enabled</div>
                    <div className="info_value">
                      {[
                        nodal_account?.nodalDetail?.isVpaValidationEnabled
                          ?.direct && "Pennyless",
                        nodal_account?.nodalDetail?.isVpaValidationEnabled
                          ?.indirect && "Pennydrop",
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="info_title">Connected Banking Enabled</div>
                    <div className="info_value">
                      {nodal_account?.nodalDetail?.isConnectedBankingEnabled ==
                      true
                        ? "Yes"
                        : nodal_account?.nodalDetail
                            ?.isConnectedBankingEnabled == false
                        ? "No"
                        : "-"}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="info_title">Reseller Name</div>
                    <div className="info_value">
                      {nodal_account?.nodalDetail?.reseller?.name ? nodal_account?.nodalDetail?.reseller?.name : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
