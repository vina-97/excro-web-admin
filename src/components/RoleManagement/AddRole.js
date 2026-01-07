import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import ApiGateway from "../../DataServices/DataServices";
import { useToasts } from "react-toast-notifications";
import OpenEye from "../../assets/images/eye_icon.svg";
import CloseEye from "../../assets/images/eye_close_icon.svg";
import { escape } from "../../DataServices/Utils";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import Select from "react-select";
import {
  Link,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { use } from "react";
import Loader from "../Loader";
const AddRole = () => {
  const { id } = useParams();
  const history = useHistory();
  const [privileges, setPrivileges] = useState([]);

  const roleFilter = [
    { value: "admin", label: "Admin" },
    { value: "merchant", label: "Merchant" },
  ];

  const merchantUserTypeFilter = [
    { value: "is_escrow_merchant", label: "Escrow" },
    { value: "is_connected_merchant", label: "Connected Banking" },
  ];

  const adminUserTypeFilter = [
    { value: "sub_admin", label: "Sub Admin" },
    { value: "reseller", label: "Reseller" },
  ];

  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

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

      group.route_list.forEach((route, index) => {
        if (route.is_enabled) {
          checked.push(`${group.group}:${route.route_id ?? index}`);
        }
      });
    });

    return checked;
  };
  // Handler when checkboxes are toggled
  const handleCheck = (newChecked) => {
    setChecked(newChecked);
  };

  // const getFinalResponse = () => {
  //   const checkedSet = new Set(checked);

  //   return privileges.map((group) => {
  //     const groupKey = group.group;
  //     const isGroupChecked = checkedSet.has(groupKey);

  //     const updatedRoutes = group.route_list.map((route, index) => {
  //       const routeKey = `${groupKey}:${route.route_id ?? index}`;
  //       return {
  //         ...route,
  //         is_enabled: checkedSet.has(routeKey),
  //       };
  //     });

  //     return {
  //       ...group,
  //       is_enabled: isGroupChecked || updatedRoutes.some((r) => r.is_enabled),
  //       route_list: updatedRoutes,
  //     };
  //   });
  // };
  const getFinalResponse = () => {
    const checkedSet = new Set(checked);

    return privileges.map((group) => {
      const groupKey = group.group;
      // const isGroupChecked = checkedSet.has(groupKey);

      const updatedRoutes = group.route_list.map((route, index) => {
        const routeKey = `${groupKey}:${route.route_id ?? index}`;
        return {
          ...route,
          is_enabled: checkedSet.has(routeKey),
        };
      });

      return {
        ...group,
        is_enabled: updatedRoutes.some((r) => r.is_enabled),
        route_list: updatedRoutes,
      };
    });
  };

  const dispatch = useDispatch();

  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };

  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };

  const [state, setState] = useState({
    roleCode: "",
    roleName: "",
    description: "",
    privileges: [],
    roleType: "admin",
    userType: "",
    route_detail: {},
    loading: false,
  });

  useEffect(() => {
    if (id) {
      roleDetail(id);
      return;
    }
    if (state?.roleType || state?.userType) {
      getMerchantRouteList();
    }
  }, [id, state?.roleType, state?.userType]);

  useEffect(()=>{
if(id && state.roleCode){
  editPrivilageDetail();
}
  },[id,state.roleCode])


  const roleDetail = (id) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    ApiGateway.get(`/payout/admin/role-permission/detail/${id}`, (response) => {
      if (response.success) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          roleCode: response?.data?.role?.roleCode,
          roleName: response?.data?.role?.roleName,
          //    privileges: response?.data?.role?.privileges,
          roleType: response?.data?.role?.roleType,
          userType: response?.data?.role?.userType,
        }));
        // setPrivileges(response?.data?.role?.privileges);
      } else {
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
        applyToast(response.message, "error");
      }
    });
  };
   const editPrivilageDetail = () => {
        ApiGateway.get(`/payout/admin/role-permission/get-all-update-routes/${state?.roleCode}`, (response) => {
            if (response.success){
                setPrivileges(response.data.route_list)
            }
        })
    };
  const getMerchantRouteList = () => {
    setState((prev) => ({
      ...prev,
      loading: true,
    }));
    let connectedBankQuery =
      state.roleType === "merchant" &&
      state?.userType === "is_connected_merchant"
        ? "&userType=connected_bank"
        : state?.userType === "reseller"
        ? "&userType=reseller"
        : "";
    ApiGateway.get(
      `/payout/admin/role-permission/get-all-routes?roleType=${state.roleType}${connectedBankQuery}`,
      (response) => {
        if (response.success) {
          setPrivileges(response?.data?.route_list);
          setState((prev) => ({
            ...prev,
            loading: false,
          }));
        } else {
          applyToast(response?.message, "info");
          setState((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      }
    );
  };

  const convertToTreeNodes = (data) => {
    return data.map((group) => ({
      value: group?.group,
      label: group?.display_name,
      children: group?.route_list?.map((route, index) => ({
        value: `${group?.group}:${route?.route_id ?? index}`,
        label: route?.display_name,
      })),
    }));
  };

  const treeData = convertToTreeNodes(privileges);

  const addRole = () => {
    if (!state?.roleName) {
      addToast("Please Enter Role Name");
    } else if (!state?.roleCode) {
      addToast("Please Enter Role Code");
    } else if (!state?.roleType) {
      addToast("Please Enter Role Type");
    } else if (!state?.userType) {
      addToast("Please Enter User Type");
    } else {
      const data = {
        roleCode: state?.roleCode,
        roleName: state?.roleName,
        privileges: getFinalResponse(),
        roleType: state?.roleType,
        userType: state?.userType,
      };
      console.log(data, "DATA");
      setState((prev) => ({
        ...prev,
        loading: true,
      }));
      ApiGateway.post(
        "/payout/admin/role-permission/create",
        data,
        (response) => {
          if (response.success) {
            setState((prev) => ({
              ...prev,
              loading: false,
            }));
            addToast(response.message);
            setTimeout(() => {
              window.location.href = "/role-list";
            }, 1000);
          } else {
            addToast(response.message, "error");
            setState((prev) => ({
              ...prev,
              loading: false,
            }));
          }
        }
      );
    }
  };
  const updateRole = () => {
    if (!state?.roleName) {
      addToast("Please Enter Role Name");
    } else if (!state?.roleName) {
      addToast("Please Enter Role Name");
    } else {
      const data = {
        // roleCode: state?.roleCode,
        roleName: state?.roleName,

        privileges: getFinalResponse(),
        roleType: state?.roleType,
        userType: state?.userType,
      };
      setState((prev) => ({
        ...prev,
        loading: true,
      }));
      ApiGateway.patch(
        `/payout/admin/role-permission/update/${state?.roleCode}`,
        data,
        (response) => {
          if (response.success) {
            setState((prev) => ({
              ...prev,
              loading: false,
            }));
            addToast(response.message);
            setTimeout(() => {
              window.location.href = "/role-list";
            }, 1000);
          } else {
            setState((prev) => ({
              ...prev,
              loading: false,
            }));
            addToast(response.message, "error");
          }
        }
      );
    }
  };
  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const roleTypeChange = (e) => {
    const selectedRole = e.value;
    console.log(e, "E");
    const userType = selectedRole === "admin" ? "sub_admin" : "sub_merchant";

    setState((prevState) => ({
      ...prevState,
      roleType: selectedRole,
      role_label: e,
      userType: userType,
    }));
  };

  const userTypeChange = (e) => {
    console.log(e);

    setState((prevState) => ({
      ...prevState,

      userType_label: e,
      userType: e.value,
    }));
  };

  const handleBack = () => {
    history.push("/role-list");
  };
  return (
    <>
      <div className="content_wrapper dash_wrapper">
        {state?.loading && <Loader />}
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content add-user">
            {id ? "Edit Role" : "Add Role"}
            <div className="bread_crumb">
              <ul className="breadcrumb">
                <li>
                  <Link to="/dashboard" className="inactive_breadcrumb">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/role-list" className="inactive_breadcrumb">
                    Role List
                  </Link>
                </li>
                <li className="active_breadcrumb">Add Role</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-xs-12 bg-white">
          <div className="white_tab_wrap">
            <div className="white_tab_box">
              <div className="clearfix">
                <ul className="nav nav-tabs customized_tab m-b-20">
                  <li className="page_title">Role Details</li>
                </ul>
                <div className="form-group clearfix form-refrance-cls">
                  <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                    Role Name:
                  </div>
                  <div className="col-sm-5">
                    <input
                      type="text"
                      name="roleName"
                      className={`form-control ${id ? "disabled_input" : ""}`}
                      id="roleName"
                      placeholder="Enter Role Name"
                      value={state.roleName}
                      onChange={handleChange}
                      disabled={id ? true : false}
                    />
                  </div>
                </div>
                <div className="form-group clearfix form-refrance-cls">
                  <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                    Role Code:
                  </div>
                  <div className="col-sm-5">
                    <input
                      type="text"
                      name="roleCode"
                      className={`form-control ${id ? "disabled_input" : ""}`}
                      id="roleCode"
                      placeholder="Enter Role Code"
                      value={state.roleCode}
                      onChange={handleChange}
                      disabled={id ? true : false}
                    />
                  </div>
                </div>
                <div className="form-group clearfix form-refrance-cls">
                  <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                    Role Type:
                  </div>
                  <div className="col-sm-5">
                    <Select
                      className="selectpicker"
                      options={roleFilter}
                      onChange={(e) => roleTypeChange(e)}
                      value={
                        state.roleType === "admin"
                          ? { value: "admin", label: "Admin" }
                          : state.roleType === "merchant"
                          ? { value: "merchant", label: "Merchant" }
                          : ""
                      }
                      isDisabled={id ? true : false}
                    />
                  </div>
                </div>
                <div className="form-group clearfix form-refrance-cls">
                  <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                    User Type:
                  </div>
                  {state.roleType === "admin" ? (
                    <div className="col-sm-5">
                      <Select
                        className="selectpicker"
                        options={adminUserTypeFilter}
                        onChange={(e) => userTypeChange(e)}
                        //  value={
                        //    state.roleType === "merchant"
                        //      ? { value: "is_escrow_merchant", label: "Escrow" }
                        //      : { value: "is_connected_merchant", label: "Connected Banking" }

                        //  }
                        isDisabled={id ? true : false}
                      />
                      {/* <input
                      type="text"
                      name="userType"
                      className="form-control"
                      id="userType"
                      placeholder="Enter User Type"
                      value={
                        state.userType === "sub_admin"
                          ? "Sub Admin"
                          : state.userType === "sub_merchant"
                          ? "Sub Merchant"
                          : ""
                      }
                      onChange={handleChange}
                      disabled
                    /> */}
                    </div>
                  ) : (
                    <div className="col-sm-5">
                      <Select
                        className="selectpicker"
                        options={merchantUserTypeFilter}
                        onChange={(e) => userTypeChange(e)}
                        //  value={
                        //    state.roleType === "merchant"
                        //      ? { value: "is_escrow_merchant", label: "Escrow" }
                        //      : { value: "is_connected_merchant", label: "Connected Banking" }

                        //  }
                        isDisabled={id ? true : false}
                      />
                    </div>
                  )}
                </div>

                <div className="form-group clearfix form-refrance-cls">
                  <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                    Privileges:
                  </div>
                  <div className="col-sm-5 control-label ">
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
                  {id ? (
                    <button className="submitBtn" onClick={updateRole}>
                      Update
                    </button>
                  ) : (
                    <button className="submitBtn" onClick={addRole}>
                      Submit
                    </button>
                  )}

                  <button className="cancelBtn m-l-10" onClick={handleBack}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRole;
