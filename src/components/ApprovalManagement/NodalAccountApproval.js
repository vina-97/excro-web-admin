import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { formatLabelWithCaps } from "../../DataServices/Utils";
import ApiGateway from "../../DataServices/DataServices";
import NodalHelper from "./Helpers/NodalHelper";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import ApprovalModal from "./ApprovalModal";
import useRouteExist from "../../DataServices/useRouteExist";

const NodalAccountApproval = (props) => {
  const { id } = useParams();
  const approvePermission=useRouteExist(['admin-approval-status-update'])
  const [state, setState] = useState({
    nodalDetail: {},
  });
  useEffect(() => {
    nodalDetail();
  }, [id]);
  const nodalDetail = () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    ApiGateway.get(`/payout/admin/approval/detail/${id}`, (response) => {
      if (response.success) {
        setState((prevState) => ({
          ...prevState,
          nodalDetail: response?.data,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    });
  };
  const closeApproveModal = () => {
    setState((prev) => ({
      ...prev,
      openApproveModal: !state.openApproveModal,
    }));
  };
  const openApproveModal = (id, statusProp) => {
    setState((prev) => ({
      ...prev,
      openApproveModal: !state.openApproveModal,
      status: statusProp,
    }));
  };
  return (
    <>
      <div className="content_wrapper dash_wrapper">
        {/* {loading && <Loader />} */}
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">
            Escrow / Pool Accounts Approval{" "}
            <div className="bread_crumb">
              <ul className="breadcrumb">
                <li>
                  <Link to="/dashboard" className="inactive_breadcrumb">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/approval-list" className="inactive_breadcrumb">
                    Approval
                  </Link>
                </li>
                <li className="active_breadcrumb">
                  Escrow / Pool Accounts Approval
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="white_tab_wrap">
          <div className="white_tab_box">
            <div className="tab-content">
              <div id="commission" className="tab-pane fade in active">
                <div className="approval-details-section">
                  <div>
                    <div className="m-t-10">
                      <span className="approve-detail-label">Process</span> :{" "}
                      <span className="approve-detail-value">
                        {state?.nodalDetail?.process
                          ? formatLabelWithCaps(state?.nodalDetail?.process)
                          : ""}
                      </span>
                    </div>
                    <div className="m-t-10">
                      <span className="approve-detail-label">Action</span> :{" "}
                      <span className="approve-detail-value">
                        {state?.nodalDetail?.action
                          ? formatLabelWithCaps(state?.nodalDetail?.action)
                          : ""}
                      </span>
                    </div>
                    <div className="m-t-10">
                      <span className="approve-detail-label">Status</span> :{" "}
                      <span className="approve-detail-value">
                        {state?.nodalDetail?.status
                          ? formatLabelWithCaps(state?.nodalDetail?.status)
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="m-t-10">
                      <span className="approve-detail-label">Created By</span> :{" "}
                      <span className="approve-detail-value">
                        {state?.nodalDetail?.audit?.createdBy?.name
                          ? formatLabelWithCaps(
                              state?.nodalDetail?.audit?.createdBy?.name
                            )
                          : ""}
                      </span>
                    </div>
                    <div className="m-t-10">
                      <span className="approve-detail-label">Admin ID</span> :{" "}
                      <span className="approve-detail-value">
                        {state?.nodalDetail?.audit?.createdBy?.id
                          ? state?.nodalDetail?.audit?.createdBy?.id
                          : ""}
                      </span>
                    </div>
                    <div className="m-t-10">
                      <span className="approve-detail-label">Admin ID</span> :{" "}
                      <span className="approve-detail-value">
                        {state?.nodalDetail?.audit?.createdBy?.type
                          ? formatLabelWithCaps(
                              state?.nodalDetail?.audit?.createdBy?.type
                            )
                          : ""}
                      </span>
                    </div>
                  </div>
                  {state?.nodalDetail?.status == "submitted" ? (
                    <div>
                      {approvePermission && <>
                        <span
                        className="submitBtn border-plain"
                        onClick={() =>
                          openApproveModal(
                            state?.nodalDetail?.doc_id,
                            "approved"
                          )
                        }
                      >
                        Approve
                      </span>
                      <span
                        className="btn btn-danger m-l-15 border-plain"
                        onClick={() =>
                          openApproveModal(
                            state?.nodalDetail?.doc_id,
                            "rejected"
                          )
                        }
                      >
                        Reject
                      </span></>}
                     
                    </div>
                  ) : (state?.nodalDetail?.status == "approved" ||
                      state?.nodalDetail?.status == "rejected") &&
                    state?.nodalDetail?.audit?.updatedBy ? (
                    <div>
                      <div className="m-t-10">
                        <span className="approve-detail-label">Updated By</span>{" "}
                        :{" "}
                        <span className="approve-detail-value">
                          {state?.nodalDetail?.audit?.updatedBy?.name
                            ? formatLabelWithCaps(
                                state?.nodalDetail?.audit?.updatedBy?.name
                              )
                            : ""}
                        </span>
                      </div>
                      <div className="m-t-10">
                        <span className="approve-detail-label">Admin ID</span> :{" "}
                        <span className="approve-detail-value">
                          {state?.nodalDetail?.audit?.updatedBy?.user_id
                            ? state?.nodalDetail?.audit?.updatedBy?.user_id
                            : ""}
                        </span>
                      </div>
                      <div className="m-t-10">
                        <span className="approve-detail-label">Admin ID</span> :{" "}
                        <span className="approve-detail-value">
                          {state?.nodalDetail?.audit?.updatedBy?.type
                            ? formatLabelWithCaps(
                                state?.nodalDetail?.audit?.updatedBy?.type
                              )
                            : ""}
                        </span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="m-t-10">
                  <NodalHelper response={state?.nodalDetail} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ApprovalModal
        isOpenModal={state.openApproveModal}
        isCloseModal={closeApproveModal}
        isStatus={state?.status}
      />
    </>
  );
};

export default NodalAccountApproval;
