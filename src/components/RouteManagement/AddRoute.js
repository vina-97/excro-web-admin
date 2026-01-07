import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { AsyncPaginate } from 'react-select-async-paginate'
import ApiGateway from "../../DataServices/DataServices";
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useToasts } from 'react-toast-notifications';
import Loader from '../Loader';
import { load } from 'react-cookies';
import { textCapitalize } from '../../DataServices/Utils';
function AddRoutes() {
    const history = useHistory();
    const {parentId}=useParams();
    
        const { addToast } = useToasts();
        const applyToast = (msg, type) => { return addToast(msg, { appearance: type }); }
        const[state,setState]=useState({
            loading: false,
        is_parent: "",
        display_name:"",
        group_name:"",
        route:"",
        method:"",
        user:"",
        route_id:"",
        is_default:"",
        parent_id:"",
        parent_name:"",
        is_side_bar: "",
        selectedParentRoute:"",
        is_escrow_merchant:null,
        is_connected_merchant:null,
        routeList:[]})

        useEffect(()=>{
            if(parentId){
                routeDetail(parentId)
            }
        },[parentId])
        const [originalState, setOriginalState] = useState({});
    const parentOptions = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
    ]
    const sideBarOptions = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
    ]
    const defaultOptions = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
    ]

    const userOption = [
        { value: 'admin', label: 'Admin' },
        { value: 'merchant', label: 'Merchant' },
    ]
    const merchantType = [
      { value: "is_connected_merchant", label: 'Connected Bank' },
      { value: "is_escrow_merchant", label: 'Escrow Account' },
  ]
    const statusOption = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'InActive' },
    ]
    const reqMethod = [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'PATCH', label: 'PATCH' },
        { value: 'DELETE', label: 'DELETE' },
    ]


    const handleSubmit=()=>{

        
   


        if (!state.display_name) {
            applyToast("Display Name should not be empty.", "error");
            return;
          }
          if (state.is_parent !== false && !state.is_parent) {
            applyToast("Please Select Create as Parent Option", "error");
            return;
          }
          if (state.is_parent === false && !state.parent_id ) {
            applyToast("Please Select Parent", "error");
            return;
          }
          if (!state.user) {
            applyToast("Please Select User", "error");
            return;
          }
          if (!state.group_name) {
            applyToast("Group Name should not be empty.", "error");
            return;
          }
        if (!state.method) {
            applyToast("Request Method should not be empty.", "error");
            return;
          }
          if (!state.route.startsWith("/")) {
            applyToast("Route must start with '/'.");
            return;
          }
          if (state.route.trim() === "/") {
          
            applyToast("Route cannot be just '/'");
            return;
          }
          if (!state.route) {
            applyToast("Route should not be empty.", "error");
            return;
          }
        
          if (state.is_default !== false && !state.is_default) {
            applyToast("Default ACL should not be empty.", "error");
            return;
          }
          if (state.is_side_bar !== false && !state.is_side_bar) {
            applyToast("Please Select Display in Sidebar Option", "error");
            return;
          }

          if (!state.status) {
            applyToast("Status should not be empty.", "error");
            return;
          }
        
        



         
          const data={
            is_parent: state.is_parent, 
            parent:{
                id:state?.parent_id,
            },
            user: state.user,
            display_name: state?.display_name,
            group: state?.group_name,
            route: state?.route,
            method: state?.method,
            is_enabled:state?.is_default,
            status:state?.status,
            is_side_bar:state?.is_side_bar,
        }
    
          if(state?.user === "merchant"){
            data.is_escrow_merchant = state?.is_escrow_merchant;
            data.is_connected_merchant = state?.is_connected_merchant;
          }



        setState((prevState)=>({
          ...prevState,
          loading: true,
        }))



ApiGateway.post(`/payout/admin/apiroutes/create`,data, function (response) {
    if (response.success) {
      setState((prevState)=>({
        ...prevState,
        routeList: response.data.apiRoutes,
        loading: false,
      }))
      history.push("/route-list");
    } else {
      applyToast(response.message, "error");
      setState((prevState)=>({
        ...prevState,
        loading: false,
      }))
    }
  });
    }

    const handleBack=()=>{
        history.push("/route-list");
    }

    const handleUpdateSubmit = () => {
        if (!state.display_name) {
            applyToast("Display Name should not be empty.", "error");
            return;
          }
        
          if (!state.group_name) {
            applyToast("Group Name should not be empty.", "error");
            return;
          }
        
          if (!state.route) {
            applyToast("Route should not be empty.", "error");
            return;
          }
          if (!state.route.startsWith("/")) {
            applyToast("Route must start with '/'.");
            return;
          }
          if (state.route.trim() === "/") {
            applyToast("Route cannot be just '/'");
            return;
          }
          if (state.is_default === "" || state.is_default === null || state.is_default === undefined) {
            applyToast("Default ACL should not be empty.", "error");
            return;
          }
        
          if (!state.status) {
            applyToast("Status should not be empty.", "error");
            return;
          }
        
          if (state.is_side_bar === "" || state.is_side_bar === null || state.is_side_bar === undefined) {
            applyToast("Please Select Display in Sidebar Option.", "error");
            return;
          }
        const changes = {};
      
        if (state.is_parent !== originalState.is_parent) {
          changes.is_parent = state.is_parent;
        }
      
        if (state.parent_id !== originalState.parent_id) {
          changes.parent = { id: state.parent_id };
        }
      
        if (state.user !== originalState.user) {
          changes.user = state.user;
        }
      
        if (state.display_name !== originalState.display_name) {
          changes.display_name = state.display_name;
        }
      
        if (state.group_name !== originalState.group_name) {
          changes.group = state.group_name;
        }
      
        if (state.route !== originalState.route) {
          changes.route = state.route;
        }
      
        if (state.method !== originalState.method) {
          changes.method = state.method;
        }
      
        if (state.is_default !== originalState.is_default) {
          changes.is_enabled = state.is_default;
        }
      
        if (state.status !== originalState.status) {
          changes.status = state.status;
        }
      
        if (state.is_side_bar !== originalState.is_side_bar) {
          changes.is_side_bar = state.is_side_bar;
        }
        if (state.is_escrow_merchant !== originalState.is_side_bar) {
          changes.is_escrow_merchant = state.is_escrow_merchant;
        }
        if (state.is_connected_merchant !== originalState.is_side_bar) {
          changes.is_connected_merchant = state.is_connected_merchant;
        }

        if (Object.keys(changes).length === 0) {
          applyToast("No changes made.", "info");
          return;
        }
      
        setState((prev) => ({ ...prev, loading: true }));
      
        ApiGateway.patch(`/payout/admin/apiroutes/update/${parentId}`, changes, function (response) {
          if (response.success) {
            setState((prev) => ({
              ...prev,
     
              loading: false,
            }));
            history.push("/route-list");
          } else {
            applyToast(response.message, "error");
            setState((prev) => ({ ...prev, loading: false }));
          }
        });
      };
      


    const handleChange=(e)=>{
        setState((prevState) => ({
            ...prevState,
            [e.target.name]:e.target.value
          }));
        }

        const handleSelectOptions = (e, id) => {
          if(id=== "is_parent" && e?.value === true) {
            setState((prevState) => ({
                ...prevState,
                [id]: "",
              }));
          }
            setState((prevState) => ({
              ...prevState,
              [id]: e ? e.value : "",
            }));
          };

  const getAllRoute = async (searchQuery, loadedOptions, { page }) => {
        return new Promise((resolve, reject) => {
                    let queryParam = "";
                    queryParam += !searchQuery ? ""  : `&search_term=${searchQuery}`;
                    ApiGateway.get(`/payout/admin/apiroutes/list?is_parent=true&page=${page}&limit=10${queryParam}`, function (response) {
                if (response) {                 
                
                    resolve({
                        options: response.data.apiRoutes,
                        hasMore: response.data.apiRoutes.length >= 10,
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
  

    const selectParentRoute=(e)=>{
      // console.log("selected parent",e?.route_id)
        setState((prevState) => ({
            ...prevState,
            parent_id: e?.route_id,
            parent_name: e?.group,
            selectedParentRoute:e
          }));
    }


    const routeDetail = () => {
            setState((prevState)=>({
            ...prevState,
            loading: true,
            }))

    ApiGateway.get(`/payout/admin/apiroutes/details/${parentId}`, function (response) {
      if (response.success) {
   
       
        const apiData = response.data.apiRoute;

        const formatted = {
          is_parent: apiData?.is_parent,
          parent_id: apiData?.parent?.id,
          parent_name:apiData?.parent?.name,
          user: apiData?.user,
          display_name: apiData?.display_name,
          group_name: apiData?.group,
          route: apiData?.route,
          method: apiData?.method,
          is_default: apiData?.is_enabled,
          status: apiData?.status,
          is_side_bar: apiData?.is_side_bar,
          selectedParentRoute: apiData?.parent
          ? { route_id: apiData.parent.id, group: apiData.parent.name }
          : null,
        };
        setState(formatted);
        setOriginalState(formatted);
      } else {
        applyToast(response.message, "error");
        setState((prevState)=>({
          ...prevState,
          loading: false,
        }))
      }
    });
  };



  return (
    <>
    <div className="content_wrapper dash_wrapper">
        <div className="dash_merchent_welcome">
         {state.loading && <Loader />}
            <div className="merchent_wlcome_content add-user">Route Management</div>
        </div>
        <div className="col-xs-12 bg-white">
            <div className="white_tab_wrap">
                <div className="white_tab_box">
                    <div className="clearfix">
                        <ul className="nav nav-tabs customized_tab m-b-20">
                            <li className="page_title">
                             {parentId ? "Edit Route" : "Add Route"} 
                            </li>
                            <li className="pull-right">
                                <button className="submitBtn" onClick={handleBack}>Back</button>
                            </li>
                        </ul>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                               Display Name:
                            </div>
                            <div className="col-sm-5">
                                <input
                                    type="text"
                                    name="display_name"
                                    className="form-control"
                                    id="display_name"
                                    placeholder="Enter Display Name"
                                    value={state?.display_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
           
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                               Create as Parent:
                            </div>
                            <div className="col-sm-5">
                               <Select
                               options={parentOptions}
                               isClearable={true}
                               onChange={(e)=>handleSelectOptions(e,"is_parent")}
                               value={
                                state?.is_parent === true
                                  ? { value: true, label: "Yes" }
                                  : state?.is_parent === false
                                  ? { value: false, label: "No" }
                                  : null
                              }
                              isDisabled={parentId ? true : false}
                               />
                            </div>
                        </div>


                        {(parentId && !state?.is_parent ) ?
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                               Select Parent :
                            </div>
                            <div className="col-sm-5">
                                <AsyncPaginate
                                        loadOptions={getAllRoute}
                                        getOptionValue={(option) => option?.route_id}
                                        getOptionLabel={(option) => option?.group}
                                        onChange={(e) => selectParentRoute(e,"parent_id")}   
                                        isSearchable={true}
                                        placeholder="Select"
                                        additional={{
                                            page: 1,
                                        }}
                                        classNamePrefix={"react-select"}
                                        isDisabled={state.is_parent === true ? true : false}
                                        value={state.selectedParentRoute || null} 
                                    />
                            </div>
                        </div> : !parentId ?  <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                               Select Parent :
                            </div>
                            <div className="col-sm-5">
                                <AsyncPaginate
                                        loadOptions={getAllRoute}
                                        getOptionValue={(option) => option?.route_id}
                                        getOptionLabel={(option) => option?.group}
                                        onChange={(e) => selectParentRoute(e,"parent_id")}   
                                        isSearchable={true}
                                        placeholder="Select"
                                        additional={{
                                            page: 1,
                                        }}
                                        classNamePrefix={"react-select"}
                                        isDisabled={state.is_parent === true ? true : false}
                                    />
                            </div>
                        </div> : null}
                   
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                               User:
                            </div>
                            <div className="col-sm-5">
                               <Select
                               options={userOption}
                               isClearable={true}
                               className="disabled_input"
                               onChange={(e)=>handleSelectOptions(e,"user")}
                               value={
                                state?.user === "admin"
                                  ? { value: "admin", label: "Admin" }
                                  : state?.user === "merchant"
                                  ?      { value: 'merchant', label: 'Merchant' }
                                  : null
                              }
                              isDisabled={parentId ? true : false}
                               />
                            
                            </div>
                        </div>
                        {state?.user === "merchant" ?
                      <>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                Connected Bank Merchant:
                            </div>
                            <div className="col-sm-5">
                               <Select
                               options={parentOptions}
                               isClearable={true}
                               className="disabled_input"
                               onChange={(e)=>handleSelectOptions(e,"is_connected_merchant")}
                               value={
                                state?.is_connected_merchant === true
                                  ? { value: true, label: "Yes" }
                                  : state?.is_connected_merchant === false
                                  ? { value: false, label: "No" }
                                  : null
                              }
                              isDisabled={parentId ? true : false}
                               />
                            
                            </div>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                Escrow Merchant:
                            </div>
                            <div className="col-sm-5">
                               <Select
                               options={parentOptions}
                               isClearable={true}
                               className="disabled_input"
                               onChange={(e)=>handleSelectOptions(e,"is_escrow_merchant")}
                               value={
                                state?.is_escrow_merchant === true
                                  ? { value: true, label: "Yes" }
                                  : state?.is_escrow_merchant === false
                                  ? { value: false, label: "No" }
                                  : null
                              }
                              isDisabled={parentId ? true : false}
                               />
                            
                            </div>
                        </div></>
                        :""}
                    
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                Group Name:
                            </div>
                            <div className="col-sm-5">
                                <input
                                    type="text"
                                    name="group_name"
                                    className={`form-control ${parentId ? "disabled_input" : ""}`}
                                    id="group_name"
                                    placeholder="Enter Group Name"
                                    value={state.group_name}
                                    onChange={handleChange}
                                    disabled={parentId ? true : false}
                                />
                            </div>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                Request Method:
                            </div>
                            <div className="col-sm-5">
                            <Select
                               options={reqMethod}
                               isClearable={true}
                        
                               onChange={(e)=>handleSelectOptions(e,"method")}
                               value={
                                state?.method === "GET"
                                  ? { value: 'GET', label: 'GET' }
                                  : state?.method === "POST"
                                  ? { value: 'POST', label: 'POST' }  : state?.method === "PUT"
                                  ? { value: 'PUT', label: 'PUT' }
                                  : state?.method === "PATCH"
                                  ? { value: 'PATCH', label: 'PATCH' } : state?.method === "DELETE"
                                  ? { value: 'DELETE', label: 'DELETE' }
                                  : null
                              }
                              isDisabled={parentId ? true : false}
                               />
                            </div>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                Route:
                            </div>
                            <div className="col-sm-5">
                                <input
                                    type="text"
                                    name="route"
                            
                                    className={`form-control ${parentId ? "disabled_input" : ""}`}
                                    id="route"
                                    placeholder="Enter Route"
                                    value={state.route}
                                    onChange={handleChange}
                                    disabled={parentId ? true : false}
                                    
                                />
                            </div>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                               Add Default in ACL:
                            </div>
                            <div className="col-sm-5">
                               <Select
                               options={defaultOptions}
                               onChange={(e)=>handleSelectOptions(e,"is_default")}
                               isClearable={true}
                               value={
                                state?.is_default === true
                                  ? { value: true, label: "Yes" }
                                  : state?.is_default === false
                                  ? { value: false, label: "No" }
                                  : null
                              }
                               />
                            </div>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                Display in SideBar:
                            </div>
                            <div className="col-sm-5">
                               <Select
                               options={sideBarOptions}
                               onChange={(e)=>handleSelectOptions(e,"is_side_bar")}
                               isClearable={true}
                               value={
                                state?.is_side_bar === true
                                  ? { value: true, label: "Yes" }
                                  : state?.is_side_bar === false
                                  ? { value: false, label: "No" }
                                  : null
                              }
                               />
                            </div>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                               Status:
                            </div>
                            <div className="col-sm-5">
                               <Select
                               options={statusOption}
                               isClearable={true}
                               onChange={(e)=>handleSelectOptions(e,"status")}
                                value={state?.status === "active"
                                  ? { value: 'active', label: 'Active' }
                                  : state?.status === "inactive"
                                  ? { value: 'inactive', label: 'InActive' }
                                  : null
                              }
                               />
                            </div>
                        </div>
                        <div className="col-md-12 text-center">
                        {parentId ? <button className="submitBtn m-r-10" onClick={handleUpdateSubmit}>Update</button> : 
                            <button className="submitBtn m-r-10" onClick={handleSubmit}>Submit</button>}
                            <button className="cancelBtn" onClick={handleBack}>Cancel</button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    </div>

</>
  )
}

export default AddRoutes