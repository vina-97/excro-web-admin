import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useToasts } from "react-toast-notifications";
import { userConstants } from "../../constants/ActionTypes";
import ApiGateway from "../../DataServices/DataServices";
import Modal from "react-modal";
import { textCapitalize } from "../../DataServices/Utils";
import Pagination from "../Pagination";
import Loader from "../Loader";
import useRouteExist from "../../DataServices/useRouteExist";

export default function RouteManagement() {
  const routeListRoute=useRouteExist(['admin-route-management-list']);
const routeDetailRoute=useRouteExist(['admin-route-management-detail']);
const routeCreate=useRouteExist(['admin-route-management-create']);
const routeUpdate=useRouteExist(['admin-route-management-update']);
    const [state, setState] = useState({ loading: false,routeList:[],openModal: false ,routeDetail:{}});
    const [pageno, setPageNo] = useState(1);
    const [limit, setLimit] = useState(10);
    const [recordsLength, setrecordLength] = useState([]);

    const { addToast } = useToasts();
    const applyToast = (msg, type) => { return addToast(msg, { appearance: type }); }
    useEffect(() => {
      routeList(pageno);
    }, []);

  const routeList = (page) => {

    setPageNo(page);
    setState((prevState)=>({
      ...prevState,
      loading: true,
    }))
    ApiGateway.get(`/payout/admin/apiroutes/list?page=${page}&limit=${limit}`, (response) => {
      if (response?.success) {
        setState((prevState) => ({
          ...prevState,
          routeList: response.data.apiRoutes,
          loading: false,
        }));
        setrecordLength(response.data.apiRoutes.length);
      } else {
        applyToast(response.message || "Error occurred", "error");
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    }) ;
  
  };



  const routeDetail = (id) => {
    setState((prevState)=>({
      ...prevState,
      loading: true,

    }))

    ApiGateway.get(`/payout/admin/apiroutes/details/${id}`, function (response) {
      if (response.success) {
        setState((prevState)=>({
          ...prevState,
          openModal: true,
          routeDetail: response.data.apiRoute,
          loading: false,
        }))
      } else {
        applyToast(response.message, "error");
        setState((prevState)=>({
          ...prevState,
          loading: false,
        }))
      }
    });
  };





  const closeRouteDetailModal = () => {
    setState((prevState)=>({
        ...prevState,
        openModal:false
      }))
  }
  

  const changeStatus = (id) => {




    const data = {
      status:
        id.status == "active"
          ? "inactive"
          : id.status == "inactive"
          ? "active"
          : id.status,
    };
    setState((prevState)=>({
      ...prevState,
      loading: true,
    }))
    ApiGateway.patch(
      `/payout/admin/apiroutes/update/${id?.route_id}`,
      data,
      (response) => {
        if (response.success) {
            applyToast(response.message, "success");
             routeList(pageno);
             setState((prevState)=>({
              ...prevState,
              loading: false,
            }))
        }else{
          setState((prevState)=>({
            ...prevState,
            loading: false,
          }))
            applyToast(response.message, "error");
        }
      }
    );
  };
  return (
    <>

      <div className="content_wrapper dash_wrapper">
        
        {state.loading && <Loader />}
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">Route Management <div className="bread_crumb">
                  <ul className="breadcrumb">
                  <li ><Link to="/dashboard" className="inactive_breadcrumb">Home</Link></li>
                  <li className="active_breadcrumb">Route Management</li>
              
                  </ul>
                  </div></div>
        </div>

        <div className="white_tab_wrap">
          <div className="white_tab_box">
            <div>
              {routeCreate && <Link className="add_btn_right " to="/route-list/add-route">
                Add Route
              </Link>}
              
              <div className="col-xs-12">
                <div className="table-responsive m-t-25">
                  <table className="table table_customization">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>User</th>
                        <th>Created as Parent </th>
                        <th>Route Name</th>
                        <th>Display Name</th>
                        <th>Group</th>
                        <th>Route</th>
                        <th>Method</th>
                        <th>Status</th>
                        {routeDetailRoute && <th>View</th>}
                        
                        <th>Edit</th>
                      
                      </tr>
                    </thead>
                    <tbody>
                      {routeListRoute ? <> {state?.routeList.length > 0 ?  state?.routeList?.map((lists, i) => {
                        return (
                          <tr key={i}>
                            <td>{((pageno - 1) * limit) + (i + 1)}</td>
                            <td>{lists?.user ? textCapitalize(lists?.user) : "-"}</td>
                            <td>{lists?.is_parent ? "Yes" : "No"}</td>
                            <td>
                             {lists?.parent?.name ? textCapitalize(lists?.parent?.name) : "-"}   
                            </td>
                            <td>
                                {lists?.display_name ? textCapitalize(lists?.display_name) : "-"}   
                            </td>
                            <td>{lists?.group ? lists?.group : "-"}</td>
                            <td>{lists?.route ? <span className="show-route">{lists?.route}</span>:  "-"}</td>
                            <td>
                            <span className={`method-pill method-${lists?.method ? lists?.method.toLowerCase() : ""}`}>  {lists?.method ? lists?.method : "-"}</span>
                            </td>
                            <td>{lists?.status ? <span className="label_edit cursor-pointer pointer" onClick={()=>changeStatus(lists)}>{textCapitalize(lists?.status)}</span> : "-"}</td>
                            <td>
                              {routeDetailRoute && <span className="label_edit cursor-pointer pointer" onClick={()=>routeDetail(lists?.route_id)}>View</span>}
                              
                              </td>
                            <td>{(routeDetailRoute && routeUpdate) && <Link to={`route-list/edit-route/${lists?.route_id}`}>Edit</Link>}
                              
                              </td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan="11" className="text-center">
                            No records found.
                          </td>
                        </tr>
                      )}</> : <tr>
                      <td className="text-center" colSpan="10">
                        Access Denied
                      </td>
                    </tr> }
                     
                    </tbody>
                  </table>
                </div>
                <div className="table-bottom-content">
                    <Pagination
                        handle={routeList}
                        list={recordsLength}
                        currentpage={pageno}
                    />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        className="customized_modal_new"
        isOpen={state?.openModal}
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
                    onClick={closeRouteDetailModal}
                >
                  ×
                </button>
                <h4 className="modal-title modal-title-sapce">
                  Route Detail - {state?.routeDetail?.route_id ? state?.routeDetail?.route_id : "-"}
                </h4>
              </div>
              <div className="modal-body clearfix">
                <div className="row">
                      <div className="col-lg-6">
                      <div className="info_title">User Name</div>
                       <div className="info_value">
                       {state?.routeDetail?.user ? state?.routeDetail?.user : "-" }
                       </div>
                      </div>

                      <div className="col-lg-6">
                      <div className="info_title">Display Name</div>
                       <div className="info_value">
                       {state?.routeDetail?.display_name ? state?.routeDetail?.display_name : "-"}
                       </div>
                      </div>
                </div>
                  <div className="row">
                      <div className="col-lg-6">
                      <div className="info_title">Group</div>
                       <div className="info_value">
                       {state?.routeDetail?.group ? state?.routeDetail?.group  : "-"}
                       </div>
                      </div>

                      <div className="col-lg-6">
                      <div className="info_title">Created as Parent</div>
                       <div className="info_value">
                       {state?.routeDetail?.is_parent === true ? "Yes" : "No"}   
                       </div>
                      </div>
                </div>
                <div className="row">
                      <div className="col-lg-6">
                      <div className="info_title">Route</div>
                       <div className="info_value">
                       {state?.routeDetail?.route	? state?.routeDetail?.route	 : "-"}
                       </div>
                      </div>

                      <div className="col-lg-6">
                      <div className="info_title">Method</div>
                       <div className="info_value">
                       {state?.routeDetail?.method ? state?.routeDetail?.method : "-"}   
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
