import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import { returnTimeZoneDate, textCapitalize } from "../../DataServices/Utils";
import ApiGateway from "../../DataServices/DataServices";
import useRouteExist from "../../DataServices/useRouteExist";
import { ToastProvider, useToasts } from "react-toast-notifications";

import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../Loader";
const Users = () => {
  const { user_list } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [state,setState]=useState({loading:false})
  const userListRoute = useRouteExist(["admin-list-admin-user"]);
  const addUserRoute = useRouteExist(["admin-add-admin-user"]);
  const editUserRoute = useRouteExist(["admin-update-admin-user"]);
  const deleteUserRoute = useRouteExist(["admin-delete-admin-user"]);
  const userStatusRoute = useRouteExist(["admin-status-admin-user"]);
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };

  useEffect(() => {
    UserList();
  }, []);

  const UserList = () => {
    setState((prev) => ({
      ...prev,
      loading: true,
    }));
    
    ApiGateway.get("/payout/admin/user-list", (response) => {

      if (response.success) {
        dispatch(updateState(userConstants.USERS, { list: response.data }));
        setState((prev) => ({
          ...prev,
          loading: false,
        })); 
      }else{
        setState((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    });
  };

  const deleteUser = (id) => {
 const data={
    subUserId:id
 }
    ApiGateway.delete(`/payout/admin/user-delete`, {data}, (response) => {
      if (response.success) {
        addToast(response.message, "success");
        UserList();
      } else {
        addToast(response.message, "error");
      }
    });
  };

  const changeStatus = (id) => {

    const data = {
      subUserId:id.userId,
      status:
        id.status == "active"
          ? "inactive"
          : id.status == "inactive"
          ? "active"
          : id.status,
    };
    ApiGateway.patch(
      `/payout/admin/user-status`,
      data,
      (response) => {
        if (response.success) {
          applyToast(response.message,"success");
          UserList();
        }else{
          applyToast(response.message,"error");
        }
      }
    );
  };
  return (
    <>
      <div className="content_wrapper dash_wrapper">
        <div className="dash_merchent_welcome">
          {state.loading && <Loader/>}
          <div className="merchent_wlcome_content">User List <div className="bread_crumb">
                  <ul className="breadcrumb">
                  <li ><Link to="/dashboard" className="inactive_breadcrumb">Home</Link></li>
                  <li className="active_breadcrumb">User List</li>
              
                  </ul>
                  </div></div>
        </div>

        <div className="white_tab_wrap">
          <div className="white_tab_box">
            <div>
              {addUserRoute && <Link className="add_btn_right " to="/users/addusers">
                Add User
              </Link>}
              
              <div className="col-xs-12">
                <div className="table-responsive m-t-25">
                  <table className="table table_customization">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created At</th>
                        <th>Contact No</th>
                        {userStatusRoute && <th>Status</th>}
                      
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userListRoute ? <>
                        {user_list?.list.length > 0 ? user_list?.list?.map((lists, i) => {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{lists?.firstName}</td>
                            <td>{lists?.email}</td>

                            <td> {returnTimeZoneDate(lists.createdAt)} </td>
                            <td>{lists?.phone?.number}</td>
                            {userStatusRoute && <td>
                              <span
                                className={
                                  lists.status == "active"
                                    ? "label_success cursor-pointer pointer"
                                    : lists?.status == "inactive"
                                    ? "label_warning cursor-pointer pointer"
                                    : lists?.status == "processing"
                                    ? "label_edit cursor-pointer pointer"
                                    : lists?.status == "failed"
                                    ? "label_danger cursor-pointer pointer"
                                    : "label_edit cursor-pointer pointer"
                                }
                                onClick={()=>changeStatus(lists)}
                              >
                                {textCapitalize(lists?.status)}
                              </span>
                            </td>}
                            
                            <td>
                              {editUserRoute && <>
                                <Link
                                  to={`/users/edituser/${lists?.userId}`}
                                  className="btn btn-xs table-btn space-right"
                                >
                                  Edit
                                </Link>
                              </>}
                             {deleteUserRoute && <>
                                <span
                                  className="btn btn-xs btn-danger cursor-pointer pointer"
                                  onClick={() => deleteUser(lists?.userId)}
                                >
                                  Delete
                                </span>
                              </>}
                              
                            </td>
                          </tr>
                        );
                      }): (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No records found.
                          </td>
                        </tr>
                      )}</> : <tr>
                      <td className="text-center" colSpan="7">
                        Access Denied
                      </td>
                    </tr>}
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
