import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import ApiGateway from "../../DataServices/DataServices";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { escape } from "../../DataServices/Utils";
import CheckboxTree from "react-checkbox-tree";
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import useRouteExist from "../../DataServices/useRouteExist";
import { AsyncPaginate } from "react-select-async-paginate";
const EditUsers = (props) => {
    const { id } = useParams();
    const history=useHistory();
    const { editUser, addUser } = useSelector((state) => state);
    const adminEditRolesRoutes =useRouteExist(["admin-user-get-all-routes"])
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);
  const [privileges, setPrivileges] = useState([]);
    const dispatch = useDispatch();
const [state,setState]=useState({
    roleId:"",
    roleName:"",
    roleCode:"",

    selectedRole: null,

})


    const { addToast } = useToasts();
    const applyToast = (msg, type) => {
        return addToast(msg, { appearance: type });
    };
    const updateState = (actionType, value) => (dispatch) => {
        dispatch({ type: actionType, payload: value });
        return Promise.resolve();
    };


    useEffect(() => {
        subUserDeatil()
    }, []);


    useEffect(() => {
        if (state?.roleCode) {
            privilageDetail()
        }
    }, [state?.roleCode])


    const handleCheck = (newChecked) => {
        setState((prev)=>({
            ...prev,roleId:"",
            roleName:"",
            roleCode:"",
            selectedRole: null,
        }))
        setChecked(newChecked);
      };
    
      useEffect(() => {
        if (privileges?.length) {
          const checkedFromAPI = getInitialChecked(privileges);
          setChecked(checkedFromAPI);
        }
      }, [privileges]);
    
      // Generate checked keys from API
      const getInitialChecked = (privileges) => {
        const checked = [];
    
        privileges.forEach((group) => {
          if (group.is_enabled) {
            checked.push(group.group);
          }
    
          group?.route_list.forEach((route, index) => {
            if (route?.is_enabled) {
              checked.push(`${group?.group}:${route?.route_id ?? index}`);
            }
          });
        });
    
        return checked;
      };
      const getFinalResponse = () => {
        const checkedSet = new Set(checked);
      
        return privileges.map((group) => {
    
          const groupKey = group.group;
    
          const updatedRoutes = group.route_list.map((route,index) => {
            const routeKey = `${groupKey}:${route.route_id ?? index}`;
            return {
              ...route,
              is_enabled: checkedSet.has(routeKey),
            };
          });
      
          return {
            ...group,
            is_enabled:  updatedRoutes.some((r) => r.is_enabled),
            route_list: updatedRoutes,
          };
        });
      };

    const convertToTreeNodes = (data) => {
        return data.map((group) => ({
          value: group?.group,
          label: group?.display_name,
          children: group.route_list.map((route, index) => ({
            value: `${group.group}:${route.route_id ?? index}`,
            label: route?.display_name,
          })),
        }));
      };
    
      const treeData = convertToTreeNodes(privileges);
  
    const subUserDeatil = () => {
        ApiGateway.get(`/payout/admin/view-user?userId=${id}`, (response) => {
       
            if (response.success) {
                const role = {
                    roleCode: response?.data?.role?.roleCode,
                    roleName: response?.data?.role?.roleCode, 
                  };
            
                  setState((prev) => ({
                    ...prev,
                    roleCode: role.roleCode,
                    roleName: role.roleCode,
                    selectedRole: role,
                  }));
                        dispatch(
                        updateState(userConstants.EDITUSERS, {
                            subUserdetailList: response?.data,
                            edit_fullname: response?.data.firstName,
                            edit_lastname:response?.data.lastName,
                            edit_email: response?.data?.email,
                            edit_phone: response?.data?.phone?.number,
                            roleId: response?.data?.role?.roleCode,
                            accType:response?.data?.accType,
                        })
                        );
            }
        })
    }


    const privilageDetail = () => {
        ApiGateway.get(`/payout/admin/role-permission/get-all-update-routes/${state?.roleCode}`, (response) => {
            if (response.success){
                setPrivileges(response.data.route_list)
            }
        })
    };


    const editUsers = () => {
     
        var eRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!editUser?.edit_fullname) {
            addToast("Please Enter First Name")
        } else if(!editUser?.edit_lastname){
            addToast("Please Enter Last Name")
        }else if (!editUser?.edit_phone.match(/^(\+\d{1,3}[- ]?)?\d{10}$/)) {
            addToast("Please Enter Contact Number")
        } else if (!editUser?.edit_email || !eRegex.test(editUser?.edit_email)) {
            addToast("Please Enter Email")
        }
       
        else {
            const data = {
                accType:editUser?.accType,
                subuserId:id,
                fullName: escape(editUser?.edit_fullname),
                lastName: escape(editUser?.edit_lastname),
                phone: {
                    code:"+91",
                    number: editUser?.edit_phone,
                },
                email: editUser?.edit_email,
               
            }
            
            ApiGateway.patch(`/payout/admin/update-user`, data, (response) => {
                if (response.success) {
                    applyToast(response.message, "success")
                    setTimeout(()=>{
                        history.push('/users')
                      },1000)
                } else {
                    applyToast(response.message, "error")
                }
            })
        }
    }


    const handleChange = (e) => {
        dispatch(
            updateState(userConstants.EDITUSERS, { [e.target.name]: e.target.value })
        );
    };


    const updatePrivilages = () =>{
let data = {
    subuserId:id,
}
if (state?.roleCode) {
    data.role = {
      ...data.role,
      roleCode: state.roleCode,
    };
  } else {
    data.privileges = getFinalResponse();
  }
        ApiGateway.patch(`/payout/admin/update-user`,data,(response)=>{
            if(response.success){

                applyToast(response.message, "success")
              setTimeout(()=>{
                history.push('/users')
              },1000)
            }else{
                applyToast(response.message, "error")
            }
        })
    }

    const getAllRoute = async (searchQuery, loadedOptions, { page }) => {
            return new Promise((resolve, reject) => {
                        let queryParam = "";
                        queryParam += !searchQuery ? ""  : `&search_term=${searchQuery}`;
                        ApiGateway.get(`/payout/admin/role-permission/list?roleType=admin&page=${page}&limit=10${queryParam}`, function (response) {
                    if (response) {                 
    
                        resolve({
                            options: response.data.roles,
                            hasMore: response.data.roles.length >= 10,
                            additional: {
                                page: searchQuery ? 2 : page + 1,
                            },
                        });
                    } else {
                        reject(response);
                    }
                });
            });
        }; 
     
        const selectRole=(e)=>{
            // console.log("selected role",e);
            setState((prevState) => ({
                ...prevState,
                roleId: e?.roleId,
                roleName: e?.roleName,
                selectedRole: e,
                roleCode:e?.roleCode
              }));
        }
    return (
        <>
            <div className="content_wrapper dash_wrapper">
                <div className="dash_merchent_welcome">
                    <div className="merchent_wlcome_content add-user">Edit User <div className="bread_crumb">
                  <ul className="breadcrumb">
                  <li><Link to="/dashboard" className="inactive_breadcrumb">Home</Link></li>
                  <li><Link to="/users" className="inactive_breadcrumb">User List</Link></li>
                  <li className="active_breadcrumb">Edit User</li>
              
                  </ul>
                  </div></div>
                </div>
                <div className="white_tab_wrap">
                    <div className="white_tab_box">
                        <div className="white_tab_box_edit">
                            <div className="clearfix">
                                <div className="form-group clearfix form-refrance-cls">
                                    <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                        First Name:
                                    </div>
                                    <div className="col-sm-5">
                                        <input
                                            type="text"
                                            name="edit_fullname"
                                            className="form-control"
                                            id="edit_fullname"
                                            placeholder="Enter First Name"
                                            value={editUser?.edit_fullname}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group clearfix form-refrance-cls">
                                    <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                        Last Name:
                                    </div>
                                    <div className="col-sm-5">
                                        <input
                                            type="text"
                                            name="edit_lastname"
                                            className="form-control"
                                            id="edit_lastname"
                                            placeholder="Enter Last Name"
                                            value={editUser?.edit_lastname}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group clearfix form-refrance-cls">
                                    <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                        Contact No:
                                    </div>
                                    <div className="col-sm-5">
                                        <input
                                            type="text"
                                            name="edit_phone"
                                            className="form-control"
                                            id="edit_phone"
                                            placeholder="Enter Contact No"
                                            value={editUser?.edit_phone}
                                            onChange={handleChange}
                                            maxLength={10}
                                        />
                                    </div>
                                </div>
                                <div className="form-group clearfix form-refrance-cls">
                                    <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                        Email:
                                    </div>
                                    <div className="col-sm-5">
                                        <input
                                            type="text"
                                            name="edit_email"
                                            className="form-control"
                                            id="edit_email"
                                            placeholder="Enter Email"
                                            value={editUser?.edit_email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 text-center m-b-10">
                                    <div className="col-md-8">
                                    <button className="submitBtn" onClick={editUsers}>Submit</button>

                                    </div>
                                </div>
                                <div className="form-group clearfix  form-refrance-cls m-t-10">
                                    <div className="col-md-2 col-sm-3 col-xs-12 control-label">
                                        Select Role Code:
                                    </div>
                                    <div className="col-sm-5 position-relative">
                                    
                                                <AsyncPaginate
                                                    loadOptions={getAllRoute}
                                                    getOptionValue={(option) => option.roleCode}
                                                    getOptionLabel={(option) => option.roleCode}
                                                    onChange={(e) => selectRole(e)}   
                                                    isSearchable={true}
                                                    placeholder="Select"
                                                    additional={{
                                                        page: 1,
                                                    }}
                              
                                                    classNamePrefix={"react-select"}
                                                    isClearable
                                                    value={state?.selectedRole || null}
                                                />
                                    </div>

                                </div>
                                {adminEditRolesRoutes && <><div className="form-group clearfix form-refrance-cls m-t-10">
                                    <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                        Select Privileges:
                                    </div>
                                    <div className="col-sm-5">
                                         <CheckboxTree
                                                                              nodes={treeData}
                                                                              checked={checked}
                                                                              expanded={expanded}
                                                                              onCheck={handleCheck}
                                                                              onExpand={setExpanded}
                                                                              showNodeIcon={false}
                                                                              />
                                    </div>
                                </div>
                                <div className="col-md-12 text-center">
                                    <div className="col-md-8">
                                    <button className="submitBtn" onClick={updatePrivilages}>Submit</button>
                                    </div>
                                </div></>}
                              
                            </div>
                        </div>


                    </div>
                </div>
            </div>

        </>
    );
};

export default EditUsers;
