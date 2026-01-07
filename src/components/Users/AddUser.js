import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import ApiGateway from "../../DataServices/DataServices";
import { useToasts } from "react-toast-notifications";
import OpenEye from '../../assets/images/eye_icon.svg';
import CloseEye from '../../assets/images/eye_close_icon.svg';
import { escape } from "../../DataServices/Utils";
import { AsyncPaginate } from 'react-select-async-paginate'
import CheckboxTree from "react-checkbox-tree";
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../Loader";
const AddUsers = () => {
    const [nodesTree, setNodesTree] = useState([]);
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  
    const { addUser } = useSelector((state) => state);
    const history = useHistory();
    const dispatch = useDispatch();

    const { addToast } = useToasts();
    const applyToast = (msg, type) => {
        return addToast(msg, { appearance: type });
    };
    const updateState = (actionType, value) => (dispatch) => {
        dispatch({ type: actionType, payload: value });
        return Promise.resolve();
    };

const [state,setState]=useState({
    roleId:"",
    roleName:"",
    roleCode:"",
    selectedRole: null,
})

useEffect(()=>{
setState((prev)=>({
    ...prev,roleId:"",
    roleName:"",
    roleCode:""
}))
dispatch(
    updateState(userConstants.ADDUSERS, {
        fullname:"",lastname:"",phone:"",email:"", password:"",  confirmPassword:"" })
);
},[])
useEffect(()=>{
    if(state?.roleCode){
        roleDetail()
    }else{
        getMerchantRouteList()
    }
  
},[state?.roleCode])


// useEffect(()=>{
//     getMerchantRouteList();
// },[])


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
          // const isGroupChecked = checkedSet.has(groupKey);
    
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
   /*    const getFinalResponse = () => {
        const checkedSet = new Set(checked);
    
        return privileges.map((group) => {
          const groupKey = group.group;
          const isGroupChecked = checkedSet.has(groupKey);
    
          const updatedRoutes = group.route_list.map((route, index) => {
            const routeKey = `${groupKey}:${route.route_id ?? index}`;
            return {
              ...route,
              is_enabled: checkedSet.has(routeKey),
            };
          });
    
          return {
            ...group,
            is_enabled: isGroupChecked || updatedRoutes.some((r) => r.is_enabled),
            route_list: updatedRoutes,
          };
        });
      }; */
      const convertToTreeNodes = (data) => {
        const groups = Array.isArray(data) ? data : [];
      
        return groups.map((group) => ({
          value: group?.group,
          label: group?.display_name,
          children: Array.isArray(group?.route_list)
            ? group.route_list.map((route, index) => ({
                value: `${group?.group}:${route?.route_id ?? index}`,
                label: route?.display_name,
              }))
            : [],
        }));
      };
      
    
      const treeData = convertToTreeNodes(privileges);


    const getMerchantRouteList = () => {
        ApiGateway.get("/payout/admin/role-permission/get-all-routes?roleType=admin", (response) => {
            if (response.success) {
                dispatch(
                    updateState(userConstants.ADDUSERS, {
                        merchantrouteList: response?.data?.route_list,
                    })
                );
                setPrivileges(response?.data?.route_list)
            }
            else {
                applyToast(response?.message);
            }
        });
    }
  const roleDetail = () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    ApiGateway.get(`/payout/admin/role-permission/detail/${state?.roleId}`, (response) => {
      if (response.success) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
     
        }));
        setPrivileges(response?.data?.role?.privileges);
      } else {
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
        applyToast(response.message, "error");
      }
    });
  };


    const addUsers = () => {

        var eRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!addUser.fullname) {
            addToast("Please Enter Full Name")
        } else if (!addUser.phone.match(/^(\+\d{1,3}[- ]?)?\d{10}$/)) {
            addToast("Please Enter Contact Number")
        } else if (!addUser.email || !eRegex.test(addUser.email)) {
            addToast("Please Enter Email")
        } else if (!addUser.password) {
            addToast("Please Enter Password")
        } else if (addUser.password !== addUser.confirmPassword) {
            addToast("Password and Confirm Password does not match")
        }
     
        else {
            const data = {
                accType:"admin",
                phone: {
                    number: addUser.phone,
                    code:"+91"
                },
                firstName: escape(addUser.fullname),
                lastName:escape(addUser.lastname),
                email: addUser.email,
                password:addUser.password
            }

            if (state?.roleCode) {
                data.role = {
                  ...data.role,
                  roleCode: state.roleCode,
                };
              } else {
                data.privileges = getFinalResponse();
              }
  
            ApiGateway.post("/payout/admin/add-user", data, (response) => {
                if (response.success) {
                    addToast(response.message)
                    window.location.href = '/users'
                } else {
                    addToast(response.message, "error")
                }
            })
        }
    }

    const handleBack=()=>{
        history.push('/users')
    }
    const handleChange = (e) => {
        dispatch(
            updateState(userConstants.ADDUSERS, { [e.target.name]: e.target.value })
        );
    };

  

    const handleShowPassword = () => {
        dispatch(
            updateState(userConstants.ADDUSERS, { showPassword: !addUser.showPassword })
        );
    }

    const handleShowConfirmPassword = () => {
        dispatch(
            updateState(userConstants.ADDUSERS, { showConfirmPassword: !addUser.showConfirmPassword })
        );
    }

    const handlePasswordChange = (e) => {
        let regex = /[()]/g;
        if (!regex.test(e.target.value)) {
            dispatch(
                updateState(userConstants.ADDUSERS, { [e.target.name]: e.target.value })
            );
        }
    };
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
                    {state.loading && <Loader/>}
                    <div className="merchent_wlcome_content add-user">Add Users <div className="bread_crumb">
                  <ul className="breadcrumb">
                  <li><Link to="/dashboard" className="inactive_breadcrumb">Home</Link></li>
                  <li><Link to="/users" className="inactive_breadcrumb">User List</Link></li>
                  <li className="active_breadcrumb">Add User</li>
              
                  </ul>
                  </div></div>
                </div>
                <div className="col-xs-12 bg-white">
                    <div className="white_tab_wrap">
                        <div className="white_tab_box">
                            <div className="clearfix">
                                <ul className="nav nav-tabs customized_tab m-b-20">
                                    <li className="page_title">
                                         User Details
                                    </li>
                                </ul>
                                <div className="form-group clearfix form-refrance-cls">
                                    <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                        First Name:
                                    </div>
                                    <div className="col-sm-5">
                                        <input
                                            type="text"
                                            name="fullname"
                                            className="form-control"
                                            id="first_name"
                                            placeholder="Enter First Name"
                                            value={addUser.fullname}
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
                                            name="lastname"
                                            className="form-control"
                                            id="lastname"
                                            placeholder="Enter Last Name"
                                            value={addUser.lastname}
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
                                            name="phone"
                                            className="form-control"
                                            id="phone"
                                            placeholder="Enter Contact No"
                                            value={addUser.phone}
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
                                            name="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="Enter Email"
                                            value={addUser.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group clearfix form-refrance-cls">
                                    <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                        Password:
                                    </div>
                                    <div className="col-sm-5 position-relative">
                                        <input
                                            type={addUser.showPassword ? "text" : "password"}
                                            name="password"
                                            className="form-control password-text"
                                            id="password"
                                            placeholder="Enter Password"
                                            value={addUser.password}
                                            onChange={handlePasswordChange}
                                        />
                                        <div className="show-eye" onClick={handleShowPassword}>
                                            {addUser.showPassword === false ? <img src={CloseEye} className="inner_eye"/> : <img src={OpenEye} className="inner_eye"/>}
                                        </div>
                                        <div className="prefix_hint">Your password must be at least 8 characters long at least with 1 capital letter,1 numeric ,1 special character and 1 small number.</div>
                                    </div>

                                </div>
                                <div className="form-group clearfix  form-refrance-cls">
                                    <div className="col-md-2 col-sm-3 col-xs-12 control-label">
                                        Confirm Password:
                                    </div>
                                    <div className="col-sm-5 position-relative">
                                        <input
                                            type={addUser.showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            className="form-control password-text"
                                            id="confirmPassword"
                                            placeholder="Enter Password"
                                            value={addUser.confirmPassword}
                                            onChange={handlePasswordChange}
                                        />
                                        <div className="show-eye" onClick={handleShowConfirmPassword}>
                                            {addUser.showConfirmPassword === false ? <img src={CloseEye} className="inner_eye"/> : <img src={OpenEye} className="inner_eye"/>}
                                        </div>
                                    </div>

                                </div>
                                <div className="form-group clearfix  form-refrance-cls">
                                    <div className="col-md-2 col-sm-3 col-xs-12 control-label">
                                        Select Role Code:
                                    </div>
                                    <div className="col-sm-5 position-relative">
                                    
                                                <AsyncPaginate
                                                    loadOptions={getAllRoute}
                                                    getOptionValue={(option) => option.roleCode}
                                                    getOptionLabel={(option) => option.roleCode	}
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
                                <div className="form-group clearfix form-refrance-cls">
                                    <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                        Roles:
                                    </div>
                                    <div className="col-sm-5 control-label add-user">
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
                                    <button className="submitBtn" onClick={addUsers}>Submit</button>
                                    <button className="cancelBtn m-l-10" onClick={handleBack}>Cancel</button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

        </>
    );
};

export default AddUsers;
