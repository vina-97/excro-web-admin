import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import {
  formatLabelWithCaps,
  manipulateString,
  returnTimeZoneDate,
  textCapitalize,
} from "../../DataServices/Utils";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import ApiGateway from "../../DataServices/DataServices";
import { useToasts } from "react-toast-notifications";

import Loader from "../Loader";
import Select from "react-select";
import Pagination from "../Pagination";

import moment from "moment";
import useRouteExist from "../../DataServices/useRouteExist";

const ApprovalList = () => {
  const { reseller, acl_routes } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };

  const latestValue = useRef({});

  latestValue.current = reseller;

  const statusFilter = [
    { value: "", label: "All" },
    { value: "submitted", label: "Submitted" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const selectStatusFilter = (e) => {
    setState((prevState) => ({
      ...prevState,
      status: e.value,
      status_label: e,
    }));
  };

  const approvalListRoute = useRouteExist(["admin-approval-list"]);
  const approvalDetail = useRouteExist(["admin-approval-detail"]);

  const [state, setState] = useState({
    loading: false,
    list: [],
    status: "",
    status_label: "",
    filter: "",
  });
  const [pageno, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [recordsLength, setrecordLength] = useState([]);

  useEffect(() => {
    approvalList(pageno);
  }, [state.filter]);

  useEffect(() => {
    resetFilter();
  }, []);
  const submitFilter = () => {
    var queryParam = "";

    queryParam +=
      !state.status || state.status === "all" ? "" : `&status=${state.status}`;

    setState((prevState) => ({
      ...prevState,
      filter: queryParam,
    }));

    setPageNo(1);
  };

  const approvalList = (page) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    ApiGateway.get(
      `/payout/admin/approval/list?page=${page}&limit=${limit}${state.filter}`,
      (response) => {
        if (response.success) {
          setState((prevState) => ({
            ...prevState,
            loading: false,
            list: response.data,
          }));

          setrecordLength(response.data.length);
        } else {
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
          applyToast(response.message, "error");
        }
      }
    );
  };

  const resetFilter = () => {
    setPageNo(1);

    if (state.status) {
      delete state.status;
      delete state.status_label;
      delete state.filter;
    }

    setState((prevState) => ({
      ...prevState,
      status: "",
      status_label: "",
      filter: "",
    }));

    setPageNo(1);
  };

  const handleNavigate = (lists) => {
    const { process, action, doc_id } = lists || {};

    if (
      (process === "merchant_pricing" ||
        process === "reseller_settings" ||
        process === "merchant_settings" ||
        process === "default_settings") &&
      (action === "create" || action === "update")
    ) {
      window.location.href = `/approval-list/approve-pricing/${doc_id}`;
      return;
    }

    if (
      process === "nodal_account" &&
      (action === "create" || action === "update")
    ) {
      window.location.href = `/approval-list/approve-nodal/${doc_id}`;
      return;
    }
  };
  return (
    <>
      <div className="content_wrapper dash_wrapper">
        {approvalListRoute ? (
          <>
            {state.loading && <Loader />}
            <div className="dash_merchent_welcome">
              <div className="merchent_wlcome_content">
                Approval List
                <div className="bread_crumb">
                  <ul className="breadcrumb">
                    <li>
                      <Link to="/dashboard" className="inactive_breadcrumb">
                        Home
                      </Link>
                    </li>
                    <li className="active_breadcrumb">Approval List</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="white_tab_wrap">
              <div className="white_tab_box">
                <div className="row p-0 m-b-5 ">
                  <div className="col-xs-12 ">
                    <div className="col-md-6 p-l-0">
                      <div className="col-xs-12 col-md-3 p-r-0">
                        <div className="trans-text m-b-5 color-grey font-semibold">
                          Select By Status
                        </div>
                        <Select
                          className="selectpicker"
                          options={statusFilter}
                          onChange={(e) => selectStatusFilter(e)}
                          value={
                            state.status_label !== undefined &&
                            state.status_label
                          }
                        />
                      </div>
                    </div>

                    <div className="col-xs-12 m-t-15 p-0 textCenter">
                      <div className="col-xs-12 m-t-25">
                        <a
                          className="submitBtn border-plain "
                          onClick={submitFilter}
                        >
                          Submit
                        </a>
                        <a
                          className="btn btn-default m-l-15 border-plain "
                          onClick={resetFilter}
                        >
                          Reset
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="col-xs-12">
                    <div className="table-responsive m-t-25">
                      <table className="table table_customization">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            {/* <th>User ID</th> */}
                            {/* <th>User Name</th> */}
                            <th>Process</th>
                            <th>Status</th>
                            <th>User Type</th>
                            <th>Action</th>
                            {approvalDetail && <th>View</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {approvalListRoute ? (
                            <>
                              {state?.list?.map((lists, i) => {
                                return (
                                  <tr key={i}>
                                    <td>{(pageno - 1) * limit + (i + 1)}</td>
                                    {/* <td>
                              {lists?.user?.id
                                ? lists?.user?.id
                                : "-"}
                            </td> */}
                                    {/* <td>
                              {lists?.user?.name
                                ? lists?.user?.name
                                : "-"}
                            </td> */}
                                    <td>
                                      {lists?.process
                                        ? formatLabelWithCaps(lists?.process)
                                        : "-"}
                                    </td>

                                    <td>
                                      <span
                                        className={
                                          lists?.status === "submitted"
                                            ? "label_edit"
                                            : ""
                                        }
                                      >
                                        {" "}
                                        {lists?.status
                                          ? textCapitalize(lists?.status)
                                          : "-"}
                                      </span>
                                    </td>
                                    <td>
                                      {lists?.user?.type
                                        ? textCapitalize(lists?.user?.type)
                                        : "-"}
                                    </td>

                                    <td>
                                      {approvalDetail && lists?.action
                                        ? textCapitalize(lists?.action)
                                        : "-"}
                                    </td>
                                    {
                                      <td>
                                        <span
                                          className="label_edit pointer-cursor"
                                          onClick={() => handleNavigate(lists)}
                                        >
                                          View
                                        </span>
                                      </td>
                                    }

                                    {/* <td><Link className="label_edit" to={`/approval-list/approve-pricing/${lists?.doc_id}`}>View</Link></td> */}
                                  </tr>
                                );
                              })}{" "}
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
                    </div>
                    <div className="table-bottom-content">
                      <Pagination
                        handle={approvalList}
                        list={recordsLength}
                        currentpage={pageno}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="dash_merchent_welcome">
              <div className="merchent_wlcome_content">
                Approval List
                <div className="bread_crumb">
                  <ul className="breadcrumb">
                    <li>
                      <Link to="/dashboard" className="inactive_breadcrumb">
                        Home
                      </Link>
                    </li>
                    <li className="active_breadcrumb">Approval List</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="white_tab_wrap">
              <div className="white_tab_box">
                <div className="col-xs-12 text-center p-0 access-denied">
                  Access Denied to view this Section. Contact Admin.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ApprovalList;
