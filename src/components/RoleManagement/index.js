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
import Modal from "react-modal";
import useRouteExist from "../../DataServices/useRouteExist";

const RoleList = () => {
const roleListRoute=useRouteExist(['admin-role-list']);  
const roleDetailRoute=useRouteExist(['admin-role-detail']);
const roleCreateRoute=useRouteExist(['admin-role-create']);
const roleUpdate=useRouteExist(['admin-role-update']);
const roleStatusUpdate=useRouteExist(['admin-role-update-status']);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };


  const [state, setState] = useState({ loading: false,list:[],status:"admin",status_label:"",filter:"&roleType=admin",route_list:{}});
  const [pageno, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [recordsLength, setrecordLength] = useState([]);



const statusFilter=[ 
  { value: "all", label: "All" },
  { value: "admin", label: "Admin" },
  { value: "merchant", label: "Merchant" },
  
]
const [viewRoleDetail, setViewDetail] = useState(false);

const selectStatusFilter=(e)=>{
  setState((prevState) => ({
    ...prevState,
    status:e.value,
    status_label:e
  }));
}
  

  useEffect(() => {
    roleList(pageno);
  }, [state.filter]);

  useEffect(() => {
    resetFilter();
  }, []);
  const submitFilter = () => {
    var queryParam = "";

    queryParam +=
    state.status === "all" ? "" : `&roleType=${state.status}`;

    setState((prevState) => ({
      ...prevState,
      filter: queryParam,
    }));

    setPageNo(1);
  };

const roleList = (page) => {
  
  setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    setPageNo(page);
    ApiGateway.get(
      `/payout/admin/role-permission/list?page=${page}&limit=${limit}${state?.filter}`,
      (response) => {
        if (response.success) {
          setState((prevState) => ({
            ...prevState,
            loading: false,
            list:response.data?.roles
          }));
        
          setrecordLength(response.data.roles?.length);
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

  const roleDetail = (id) => {
    setViewDetail(true);
    setState((prevState) => ({
         ...prevState,
         loading: true,
       }));
   
       ApiGateway.get(
         `/payout/admin/role-permission/detail/${id}`,
         (response) => {
           if (response.success) {
             setState((prevState) => ({
               ...prevState,
               loading: false,
               route_list:response.data?.role
             }));
           
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
   


     const changeStatus = (id) => {
      const data = {
        status:
          id.status	=== "active"
            ? "inactive"
            : id.status	=== "inactive"
            ? "active"
            : "inactive",
      };
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
  
      ApiGateway.patch(
        `/payout/admin/role-permission/status/${id.roleId}`,
        data,
        (response) => {
          if (response.success) {
            setState((prevState) => ({
              ...prevState,
              loading: false,
            }));
            roleList(pageno);
            applyToast(response.message,"success");
  
          }else{
            setState((prevState) => ({
              ...prevState,
              loading: false,
            }));      
            applyToast(response.message,"error");
          }
        }
      );
    };



  const resetFilter = () => {
 

    setPageNo(1);


    if (state.status) {
state.status ="admin";
      delete state.status_label;
      delete state.filter;
    }

    setState((prevState) => ({
      ...prevState,
      status:"admin",
      status_label:"",
     filter:"&roleType=admin"
    }));
 
   
    setPageNo(1);
  };




  const handleCloseModal = () => {
  setViewDetail(false);

    
  };


  return (
    <>

      <div className="content_wrapper dash_wrapper">
        {state.loading && <Loader />}
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">
             Role List
            <div className="bread_crumb">
              <ul className="breadcrumb">
                <li>
                  <Link to="/dashboard" className="inactive_breadcrumb">
                    Home
                  </Link>
                </li>
                <li className="active_breadcrumb">Role List</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="white_tab_wrap">
          <div className="white_tab_box">
            <div className="row p-0 m-b-5 ">
              <div className="col-xs-12">
                <div className="col-md-12 p-l-0">
                <div className="col-xs-12 col-sm-6 col-md-3 p-r-0">
                  <div className="trans-text m-b-5 color-grey font-semibold">
                    Select By Role
                  </div>
                  <Select
                    className="selectpicker"
                    options={statusFilter}
                    onChange={(e) => selectStatusFilter(e)}
                    value={
                      state?.status === "admin" ?  { value: "admin", label: "Admin" } : 
                      state?.status === "merchant" ? { value: "merchant", label: "Merchant" } : { value: "all", label: "All" }
                    }
                  />

                </div>
                  <div className="m-t-25 pull-right">
                    {roleCreateRoute && <Link
                                    className="submitBtn m-l-15 border-plain"
                                    to="/role-list/add"
                                  >
                                    Add Role
                                  </Link>}
                                  
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
                        <th>Role Name</th>
                        <th>Created At</th>
                        <th>Role Code</th>
                        <th>Role Id</th>
                        <th>Role Type</th>
                        {roleStatusUpdate && <th>Status</th>}
                        {roleDetailRoute && <th>View</th>}
                        {roleUpdate && <th>Edit</th>}
                        
                      </tr>
                    </thead>
                    <tbody>
{roleListRoute ? <>
  {state?.list.map((lists, i) => {
                        return (
                          <tr key={i}>
                            <td>{(pageno - 1) * limit + (i + 1)}</td>
                            <td>
                              {lists?.roleName
                                ? lists?.roleName
                                : "-"}
                            </td>
                            <td>
                              {lists?.createdAt
                                ? returnTimeZoneDate(lists?.createdAt)
                                : "-"}
                            </td>
                            <td>
                              {lists?.roleCode
                                ? lists?.roleCode
                                : "-"}
                            </td>
                            <td>
                              {lists?.roleId ? lists?.roleId : "-" }
                            </td>
                            <td>
                              {lists?.roleType ? lists?.roleType : "-" }
                            </td>
                            <td>
                            <span className={
                                   lists.status == "active"
                                   ? "label_success pointer"
                                   : "label_warning pointer"
                                } onClick={()=>changeStatus(lists)}>{lists?.status ? textCapitalize(lists?.status) : "-" }</span>
                            </td>
                          
                          
                            <td><span className="label_edit pointer-cursor" onClick={()=>roleDetail(lists?.roleId)}>View</span></td>
                            <td><Link className="label_edit" to={`/role-list/edit/${lists?.roleId}`}>Edit</Link></td>
                          </tr>
                        );
                      })} </> : <tr>
                      <td className="text-center" colSpan="9">
                        Access Denied
                      </td>
                    </tr> }
                  

             
                    </tbody>
                  </table>
                </div>
                <div className="table-bottom-content">
              <Pagination
                      handle={roleList}
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
        isOpen={viewRoleDetail}
        ariaHideApp={false}
      >
        <div
          className="modal modalbg fade in"
          style={{ display: "block", overflowX: "hidden", overflowY: "auto" }}
        >
       <div className="role-detail-modal">
                  <div className="modal-content">
                    <div className="modal-header">
                      <div className="modal-header">
                        <button
                          type="button"
                          className="close font-28"
                          onClick={handleCloseModal} 
                        >
                          ×
                        </button>
                        <h4 className="modal-title modal-title-sapce">
                          Role Privileges
                        </h4>
                      </div>
                    </div>
                    <div className="modal-body clearfix modal_label_right">
                      <div className="modal-body clearfix">

                          <div className="row m-b-15">
                                          <div className="col-md-6 control-label">
                                           Role Name
                                          </div>
                                          <div className="col-md-6 font-700">
                                        {state?.route_list?.roleName ? state?.route_list?.roleName : "-"} 
                                       
                                          </div>
                                        </div>
                                        <div className="row m-b-15">
                                          <div className="col-md-6 control-label">
                                           Role Code
                                          </div>
                                          <div className="col-md-6 font-700">
                                          {state?.route_list?.roleCode ? state?.route_list?.roleCode : "-"} 
                                       
                                          </div>
                                        </div>

                                        <div className="row m-b-15">
                                          <div className="col-md-6 control-label">
                                           Role Id
                                          </div>
                                          <div className="col-md-6 font-700">
                                          {state?.route_list?.roleId ? state?.route_list?.roleId : "-"} 
                                       
                                          </div>
                                        </div> 
                                        <div className="row m-b-15">
                                          <div className="col-md-6 control-label">
                                           Role Type
                                          </div>
                                          <div className="col-md-6 font-700">
                                          {state?.route_list?.roleType ? textCapitalize(state?.route_list?.roleType) : "-"} 
                                       
                                          </div>
                                        </div>                       
<hr></hr>


<div className="permission-list-data">
{state?.route_list?.privileges?.map((permission, pIndex) => (
  <div key={pIndex} className="section-wrapper ">
    <h3 className="section-heading">{permission.display_name}</h3>
    <div className="routes-grid">
      {permission.route_list.map((route, rIndex) => {
        const method = String(route.method || "").toLowerCase();
        return (
          <div
            key={rIndex}
            className={`route-card ${route.is_enabled ? "enabled" : "disabled"}`}
          >
            <div className="route-card-header">
              <span className="route-name">{route.display_name}</span>
              <span className={`status-badge ${route.is_enabled ? "status-enabled" : "status-disabled"}`}>
                {route.is_enabled ? "Enabled" : "Disabled"}
              </span>
            </div>

            <div className="route-line">
              <span className={`method-pill method-${method}`}>
                {route.method}
              </span>
              <code className="route-url">{route.route}</code>
            </div>
          </div>
        );
      })}
    </div>
  </div>
))}
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

export default RoleList;
