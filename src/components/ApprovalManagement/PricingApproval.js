import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";

import ApiGateway from "../../DataServices/DataServices";

import { Link } from "react-router-dom";

import DiffViewer from "./Helpers/PricingHelper";
import { formatLabelWithCaps } from "../../DataServices/Utils";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import ApprovalModal from "./ApprovalModal";
import useRouteExist from "../../DataServices/useRouteExist";

const PricingApproval = (props) => {
  const { id } = useParams();

  const approvalUpdatetRoute =useRouteExist(["admin-approval-status-update"]);

  const [state, setState] = useState({
    pricingDetail: {},
    openApproveModal: false,
    status: "",
  });
  useEffect(() => {
    approvalDetail();
  }, [id]);

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
  const approvalDetail = () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    ApiGateway.get(`/payout/admin/approval/detail/${id}`, (response) => {
      if (response.success) {
        setState((prevState) => ({
          ...prevState,
          pricingDetail: response?.data,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    });
  };

  return (
    <>
      <div className="content_wrapper dash_wrapper">
        {/* {loading && <Loader />} */}
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">
            Pricing Approval{" "}
            <div className="bread_crumb">
              <ul className="breadcrumb">
                <li>
                  <Link to="/dashboard" className="inactive_breadcrumb">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/merchant" className="inactive_breadcrumb">
                    Approval
                  </Link>
                </li>
                <li className="active_breadcrumb">Pricing Approval</li>
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
                    <div className="">
                      <span className="approve-detail-label">User Name</span> :
                      <span className="approve-detail-value">
                        {" "}
                        {state?.pricingDetail?.user?.name
                          ? state?.pricingDetail?.user?.name
                          : "-"}
                      </span>
                    </div>
                    <div className="m-t-10">
                      <span className="approve-detail-label">User ID</span> :{" "}
                      <span className="approve-detail-value">
                        {state?.pricingDetail?.user?.id
                          ? state?.pricingDetail?.user?.id
                          : "-"}
                      </span>
                    </div>
                    <div className="m-t-10">
                      <span className="approve-detail-label">Process</span> :{" "}
                      <span className="approve-detail-value">
                        {state?.pricingDetail?.process
                          ? formatLabelWithCaps(state?.pricingDetail?.process)
                          : "-"}
                      </span>
                    </div>
                    <div className="m-t-10">
                      <span className="approve-detail-label">Action</span> :{" "}
                      <span className="approve-detail-value">
                        {state?.pricingDetail?.action
                          ? formatLabelWithCaps(state?.pricingDetail?.action)
                          : "-"}
                      </span>
                    </div>
                    <div className="m-t-10">
                      <span className="approve-detail-label">Status</span> :{" "}
                      <span className="approve-detail-value">
                        {state?.pricingDetail?.status
                          ? formatLabelWithCaps(state?.pricingDetail?.status)
                          : "-"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="m-t-10">
                      <span className="approve-detail-label">Created By</span> :{" "}
                      <span className="approve-detail-value">
                        {state?.pricingDetail?.audit?.createdBy?.name
                          ? formatLabelWithCaps(
                              state?.pricingDetail?.audit?.createdBy?.name
                            )
                          : "-"}
                      </span>
                    </div>
                    <div className="m-t-10">
                      <span className="approve-detail-label">Admin ID</span> :{" "}
                      <span className="approve-detail-value">
                        {state?.pricingDetail?.audit?.createdBy?.id
                          ? state?.pricingDetail?.audit?.createdBy?.id
                          : "-"}
                      </span>
                    </div>
                    <div className="m-t-10">
                      <span className="approve-detail-label">Admin Type</span> :{" "}
                      <span className="approve-detail-value">
                        {state?.pricingDetail?.audit?.createdBy?.type
                          ? formatLabelWithCaps(
                            state?.pricingDetail?.audit?.createdBy?.type
                            )
                          : "-"}
                      </span>
                    </div>
                  </div>
                  { state?.pricingDetail?.status == "submitted" ? (
                    <>
                    {approvalUpdatetRoute &&  <div>
                      <span
                        className="submitBtn border-plain cursor-pointer pointer"
                        onClick={() =>
                          openApproveModal(
                            state?.pricingDetail?.doc_id,
                            "approved"
                          )
                        }
                      >
                        Approve
                      </span>
                      <span
                        className="btn btn-danger m-l-15 border-plain cursor-pointer pointer"
                        onClick={() =>
                          openApproveModal(
                            state?.pricingDetail?.doc_id,
                            "rejected"
                          )
                        }
                      >
                        Reject
                      </span>
                    </div>}
                    </>
                   
                  ) : (state?.pricingDetail?.status == "approved" ||
                      state?.pricingDetail?.status == "rejected") &&
                    state?.pricingDetail?.audit?.updatedBy ? (
                    <div>
                      <div className="m-t-10">
                        <span className="approve-detail-label">Updated By</span>{" "}
                        :{" "}
                        <span className="approve-detail-value">
                          {state?.pricingDetail?.audit?.updatedBy?.name
                            ? formatLabelWithCaps(
                                state?.pricingDetail?.audit?.updatedBy?.name
                              )
                            : "-"}
                        </span>
                      </div>
                      <div className="m-t-10">
                        <span className="approve-detail-label">Admin ID</span> :{" "}
                        <span className="approve-detail-value">
                          {state?.pricingDetail?.audit?.updatedBy?.user_id
                            ? state?.pricingDetail?.audit?.updatedBy?.user_id
                            : "-"}
                        </span>
                      </div>
                      <div className="m-t-10">
                        <span className="approve-detail-label">Admin Type</span> :{" "}
                        <span className="approve-detail-value">
                          {state?.pricingDetail?.audit?.updatedBy?.type
                            ? formatLabelWithCaps(
                                state?.pricingDetail?.audit?.updatedBy?.type
                              )
                            : "-"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="m-t-10">
                  <DiffViewer response={state.pricingDetail} />
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

export default PricingApproval;
