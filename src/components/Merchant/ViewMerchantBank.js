import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import Logo from "../../assets/images/bank-line.svg"
import Modal from "react-modal";
import { textCapitalize } from "../../DataServices/Utils";
import ApiGateway from "../../DataServices/DataServices";
import { useToasts } from "react-toast-notifications";
import Loader from "../Loader";

const MerchantBankList = () => {
  const { id } = useParams();
  const { addToast } = useToasts();

  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ openBankModal: false });
  const [BankList, setBankList] = useState([]);
  const [BankDetails, setBankDetails] = useState({});

  useEffect(() => {
    getBankList();
  }, [id]);

  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };

  const handleViewMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + 4, BankList?.data?.length || 0)
    );
  };

  const handleBankDetailModal = () => {
    setState((prev) => ({
      ...prev,
      openBankModal: !prev.openBankModal,
    }));
  };

  const getBankList = () => {
    setLoading(true);
    ApiGateway.get(`/payout/admin/connectedbank/list/${id}`, (response) => {
      setLoading(false);
      if (response.success) {
        setBankList(response.data);
      } else {
        applyToast(response.message, "error");
      }
    });
  };

  const getBankDetail = (bankId) => {
    setLoading(true);
    ApiGateway.get(`/payout/admin/connectedbank/detail/${bankId}`, (response) => {
      setLoading(false);
      if (response.success) {
        setBankDetails(response.data);
        setState((prev) => ({
          ...prev,
          openBankModal: true,
        }));
      } else {
        applyToast(response.message, "error");
      }
    });
  };

  const visibleData = BankList?.slice(0, visibleCount) || [];

  const rows = visibleData.reduce((acc, item, idx) => {
    if (idx % 2 === 0) acc.push([]);
    acc[acc.length - 1].push(item);
    return acc;
  }, []);

  return (
    <>
      <div className="content_wrapper dash_wrapper">
        {loading && <Loader />}

        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">
            Merchants Bank List
            <div className="bread_crumb">
              <ul className="breadcrumb">
                <li>
                  <Link to="/dashboard" className="inactive_breadcrumb">
                    Home
                  </Link>
                </li>
                <li className="inactive_breadcrumb">Merchants</li>
                <li className="active_breadcrumb">Bank List</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="white_tab_wrap">
          <div className="white_tab_box">
            <div className="col-xs-12 p-0">
              <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
              
               {rows.length === 0 ? <div className="text-center my-3 no-data">No Data</div> :<>
                {rows.map((pair, idx) => (
                  <div className="row" key={idx}>
                    {pair.map((item) => (
                      <div className="col-md-5 col-sm-12 mb-3" key={item._id}>
                        <div className="panel panel-primary" style={{ borderRadius: 8 }}>
                          <div className="panel-heading" style={{ fontWeight: "bold" }}>
                            <div className="clearfix">
                              <span>{item.account.holder_name}</span>
                              <span className="pull-right">
                                <span
                                  onClick={() => getBankDetail(item?.bank_id)}
                                  className="cursor-pointer pointer"
                                >
                                  View
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="panel-body">
                            <div className="media">
                              <div className="col-xs-3">
                                <img
                                  src={Logo}
                                  alt="Bank Logo"
                                  className="media-object"
                                  style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: "50%",
                                    border: "1px solid #ccc",
                                    padding: 4,
                                  }}
                                />
                              </div>
                              <div className="col-xs-9">
                                <p><strong>Bank:</strong> {item.account.bank?.BANK}</p>
                                <p><strong>IFSC:</strong> {item.account.ifsc}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {visibleCount < (BankList?.data?.length || 0) && (
                  <div className="text-center my-3">
                    <button className="btn btn-primary" onClick={handleViewMore}>
                      View More
                    </button>
                  </div>
                )}</> }
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        className="customized_modal_new"
        isOpen={state.openBankModal}
        ariaHideApp={false}
      >
        <div
          className="modal modalbg fade in"
          style={{ display: "block", overflowX: "hidden", overflowY: "auto" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close font-28" onClick={handleBankDetailModal}>
                  ×
                </button>
                <h4 className="modal-title modal-title-sapce">
                  Account Details - Merchant ID: {BankDetails?.merchant?.id}
                </h4>
              </div>
              <div className="modal-body clearfix modal_label_right">
                <div className="row m-b-15">
                  <div className="col-md-6 control-label">Merchant Name</div>
                  <div className="col-md-6 font-700">
                    {textCapitalize(BankDetails?.merchant?.name || "")}
                  </div>
                </div>

                <div className="row m-b-15">
                  <div className="col-md-6 control-label">Account Holder Name</div>
                  <div className="col-md-6 font-700">
                    {textCapitalize(BankDetails?.account?.holder_name || "")}
                  </div>
                </div>

                <div className="row m-b-15">
                  <div className="col-md-6 control-label">Bank Name</div>
                  <div className="col-md-6 font-700">
                    {textCapitalize(BankDetails?.account?.bank?.BANK || "-")}
                  </div>
                </div>

                <div className="row m-b-15">
                  <div className="col-md-6 control-label">Account Number</div>
                  <div className="col-md-3 font-700">
                    {BankDetails?.account?.number || "-"}
                  </div>
                </div>

                <div className="row m-b-15">
                  <div className="col-md-6 control-label">IFSC</div>
                  <div className="col-md-6 font-700">
                    {BankDetails?.account?.ifsc || "-"}
                  </div>
                </div>

                <div className="row m-b-15">
                  <div className="col-md-6 control-label">Status</div>
                  <div className="col-md-6 font-700">
                    {BankDetails?.status && (
                      <span
                        className={
                          BankDetails.status === "active"
                            ? "label_success"
                            : "label_warning"
                        }
                      >
                        {textCapitalize(BankDetails.status)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="row m-b-15">
                  <div className="col-md-6 control-label">Primary Account</div>
                  <div className="col-md-6 font-700">
                    {BankDetails?.is_primary ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MerchantBankList;
