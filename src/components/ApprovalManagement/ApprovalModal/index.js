import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import ApiGateway from "../../../DataServices/DataServices";
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useToasts } from 'react-toast-notifications';

function ApprovalModal({isOpenModal,isCloseModal,isStatus}) {
const {id}=useParams();
    const [state,setState]=useState({
        reason:"",

    })
    const handleChange=(e)=>{
        setState((prev) => ({
            ...prev,
        [e.target.name]: e.target.value,
          }));}
    const { addToast } = useToasts();
    const applyToast = (msg, type) => { return addToast(msg, { appearance: type }); }
 const approveORreject = () => {
const data={
    status:isStatus,
    reason:state.reason
}

    ApiGateway.patch(
      `/payout/admin/approval/update/status/${id}`,data,
      (response) => {
        if (response.success) {
    
            applyToast(response.message,"success")
            setTimeout(()=>{
                isCloseModal();
                window.location.href="/approval-list";
            },1000)
        } else {
            isCloseModal()
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
        }
      }
    ); 
  };



  return (
    <> 
    <Modal
    className="customized_modal_new"
    isOpen={isOpenModal}
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
              onClick={isCloseModal}
            >
              ×
            </button>
            <h4 className="modal-title modal-title-sapce">
            {isStatus == "approved" ?  "Approve" : "Reject"}
            </h4>
          </div>
          <div className="modal-body clearfix modal_label_right">
            <div className="row m-b-15">
              <div className="col-md-3 control-label">
               Status
              </div>
              <div className="col-md-8 ">
              
              <input
                type="text"
                name="statusOption"
                className="form-control"
                value={isStatus}
                disabled
                readOnly
                />
              </div>
            </div>
            <div className="row m-b-15">
              <div className="col-md-3 control-label">
              Reason
              </div>
              <div className="col-md-8">
              <textarea
                type="text"
                name="reason"
                className="form-control"
                id="reason"
                placeholder="Enter Reason"
                value={state.reason}
                onChange={handleChange}
                />           
              </div>
            </div>
  <div className='m-t-10 text-center'><span className="submitBtn" onClick={approveORreject}>Submit</span> <span onClick={isCloseModal} className="btn btn-default">Cancel</span></div>
            
          </div>
        </div>
      </div>
    </div>
  </Modal>
  </>
  )
}

export default ApprovalModal;