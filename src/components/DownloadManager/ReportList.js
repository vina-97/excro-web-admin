import React, { useEffect, useState } from "react";

import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ApiGateway from "../../DataServices/DataServices";
import Loader from "../Loader";
import { camelCaseText, formatLabelWithCaps } from "../../DataServices/Utils";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import { useToasts } from "react-toast-notifications";


const ReportList = (props) => {
    const history  =useHistory();
    const dispatch = useDispatch();
    const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };
    const { addToast } = useToasts();
    const applyToast = (msg, type) => {
      return addToast(msg, { appearance: type });
    };
    const [state,setState]=useState({loading:false,reportList:[]
     
})
useEffect(()=>{
  getReportList();
},[]);

const getReportList = () => {
  setState((prevState) => ({
    ...prevState,
    loading: true,
  }));
  ApiGateway.get(
    `/payout/admin/report/list`,
    function (response) {
      if (response.success) {
        setState((prevState) => ({
          ...prevState,
          reportList: response?.data?.reports,
          loading: false,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    }
  );
};

  const handleRedirect = (reportData) => {
       dispatch(updateState(userConstants.DOWNLOADMANAGER, { selectedReport: reportData }));
       history.push(`/report-list/generate-reports/${reportData?.report_id}`);
  
  };


  return (
    <>

<div className="tab-content">
{state.loading && <Loader/>}
<div className="row">
  {state?.reportList?.length > 0 ? (
    state.reportList.map((reportData) => (
      <div className="col-md-4" key={reportData?.report_id}>
        <div
          className="panel panel-default report-card"
          onClick={() => handleRedirect(reportData)}
        >
          <div className="panel-body p-20">
            <h4 className="report-title text-capitalize">
              {formatLabelWithCaps(camelCaseText(reportData?.report_name))}
            </h4>
            <p className="report-desc">{reportData?.description}</p>
            <button className="btn btn-primary generate-btn mt-2">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="col-md-12">
      <p>No reports available.</p>
    </div>
  )}
</div>
                </div>
    </>
  );
};

export default ReportList;
