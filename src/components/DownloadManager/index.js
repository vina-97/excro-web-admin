import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../Loader";
import ReportList from "./ReportList";
import DownloadReportList from "./DownloadReportList";
import useRouteExist from "../../DataServices/useRouteExist";

const DownloadManager = () => {
const reportLisRoute =useRouteExist(["admin-download-manager-report-list"]);
const downloadManagerLisRoute =useRouteExist(["admin-download-manager-list"]);

    const [state,setState]=useState({loading:false,type:"reportList"});
    const showToggle = (id) => {
        setState((prevState) => ({
            ...prevState,
            type: id,
          }));
      };


  return (
    <>

      <div className="content_wrapper dash_wrapper">
        {state.loading && <Loader />}
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">
          Download Manager
            <div className="bread_crumb">
              <ul className="breadcrumb">
                <li>
                  <Link to="/dashboard" className="inactive_breadcrumb">
                    Home
                  </Link>
                </li>
                <li className="active_breadcrumb">DownloadManager</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="white_tab_wrap">
          <div className="white_tab_box">
          

          <ul className="nav nav-tabs customized_tab m-b-15">
            {reportLisRoute &&  <li
                  className={
                    state.type === "reportList" ? "active" : ""
                  }
                >
                  <a onClick={() => showToggle("reportList")}>Report List</a>
                </li>}
         {downloadManagerLisRoute && 
          <li
                  className={
                    state.type === "downloadList" ? "active" : ""
                  }
                >
                  <a onClick={() => showToggle("downloadList")}>Download Report</a>
                </li>}
               
              
            </ul>
            {state.type === "reportList" && <>
                    <div
                      className={
                        state.type === "reportList"
                          ? "tab-pane fade active in"
                          : "tab-pane fade"
                      }>
                      <ReportList /></div></>}



                      {state.type === "downloadList" && <>
                    <div
                      className={
                        state.type === "downloadList"
                          ? "tab-pane fade active in"
                          : "tab-pane fade"
                      }>
                      <DownloadReportList/></div></>}
           
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadManager;
