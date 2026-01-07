import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import { imagePath } from "../assets/ImagePath";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { userConstants } from ".././constants/ActionTypes";
import { ToastProvider, useToasts } from "react-toast-notifications";
import ApiGateway from "../DataServices/DataServices";
import Pagination from "./Pagination";
import Select from "react-select";
import {
  manipulateString,
  textCapitalize,
  returnTimeZoneDate,
} from "../DataServices/Utils";
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import FilterList from "./FilterList";
import { AsyncPaginate } from "react-select-async-paginate";
import UPI from "../assets/images/upi-new.png";
import BANK from "../assets/images/bankaccount.png";
import useRouteExist from "../DataServices/useRouteExist";
import Loader from "./Loader";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Contact = () => {
  const { contact } = useSelector((state) => state);
  const dispatch = useDispatch();

  const latestValue = useRef({});

  latestValue.current = contact;
  const [loading,setLoading]=useState(false)
  const [pageno, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [recordsLength, setrecordLength] = useState([]);
  const contactListRoute = useRouteExist(["admin-contact-list"]);
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };

  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };
  const [active, setActive] = useState(false);
  const handleClick = () => {
    setActive(true);
  };
  useEffect(()=>{
    resetFilter()
  },[])
  useEffect(() => {
    getContactList(pageno);
  }, [
    contact.filter,
    pageno,
  ]);

  const updateReducer = (a) => {
    return function (b) {
      if (b) {
        return updateReducer({ ...a, ...b });
      }
      dispatch(updateState(userConstants.CONTACT_REQUEST, a));
    };
  };
  const getAllMerchant = async (searchQuery, loadedOptions, { page }) => {
    return new Promise((resolve, reject) => {
        let queryParam = "";
        queryParam += !searchQuery ? ""  : `&search_term=${searchQuery}`;
      ApiGateway.get(
        `/payout/admin/merchant/list?page=${page}&limit=10${queryParam}`,
        function (response) {
          if (response) {
            let merchantList = [];
            updateReducer({ merchantList })({
              isOpenMenu: !contact.isOpenMenu,
            })();
            resolve({
              options: response.data.merchants,
              hasMore: response.data.merchants.length >= 10,
              additional: {
                page: searchQuery ? 2 : page + 1,
              },
            });
          } else {
            reject(response);
          }
        }
      );
    });
  };
  const selectMerchantFilter = (filter,e) =>{
    let str = manipulateString(filter);
    dispatch(
      updateState(userConstants.CONTACT_REQUEST, {
        [filter]: e.merchantId,
        [str]: e,
        searchTerm:
          "filter" === "search_type" ? "" : contact.searchTerm,
      })
    );
  }
  const Id_Filter = [
    { value: "contact_id", label: "Contact ID" },
    { value: "email", label: "Contact Email" },
    { value: "mobile.national_number", label: "Contact Phone" },
    { value: "name.full", label: "Contact Name" },
  ];
  const Contact_Type = [
    { value: "all", label: "All" },
    { value: "customer", label: "Customer" },
    { value: "vendor", label: "Vendor" },
    { value: "merchant", label: "Merchant" },
    { value: "supplier", label: "Supplier" },
  ];
  const Status_Filter = [
    { value: "", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

const submitFilter=()=>{
  var queryParam = "";

  queryParam += !contact.national_number
    ? ""
    : `&mobile.national_number=${contact.national_number}`;
  queryParam += !contact.merchant_id
    ? ""
    : `&merchant_id=${contact.merchant_id}`;
  queryParam += contact.fromDate ? `&from_date=${contact.fromDate}` : "";
  queryParam += contact.toDate ? `&to_date=${contact.toDate}` : "";
  queryParam +=
    !contact.status || contact.status === "all"
      ? ""
      : `&status=${contact.status}`;
  queryParam += !contact.selection ? "" : `&selection=${contact.selection}`;
  queryParam +=
    !contact.contact_type || contact.contact_type === "all"
      ? ""
      : `&contact_type=${contact.contact_type}`;
  queryParam += contact.searchTerm
    ? "&search_term=" + contact.searchTerm
    : "";
  queryParam +=
    contact[contact.search_type] === undefined ||
    contact[contact.search_type] === ""
      ? ""
      : `&${contact.search_type}=` + contact[contact.search_type];
      dispatch(
        updateState(userConstants.CONTACT_REQUEST, {
          filter: queryParam,
        })
      );
      setPageNo(1);
}

  const getContactList = (page) => {
    setLoading(true)
    setPageNo(page);
    

    ApiGateway.get(
      `/payout/admin/contact/list?page=${page}&limit=${limit}${contact.filter ? contact.filter : ""}`,
      function (response) {
        if (response.success) {
          setLoading(false)
          dispatch(
            updateState(userConstants.CONTACT_REQUEST, {
              contactList: response.data.contacts,
            })
          ).then(() => {
            dispatch(updateState(userConstants.LOADER, { loading: false }));
          });
          setrecordLength(response.data.contacts.length);
        } else {
          setLoading(false)
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          applyToast(response.message, "error");
        }
        // // }
      }
    );
  };
  const showFilterList = () => {
    if (
      contact.searchTerm !== "" ||
      contact.searchTerm !== "" ||
      (contact[contact.search_type] !== undefined &&
        contact[contact.search_type] !== "")
    ) {
      dispatch(
        updateState(userConstants.CONTACT_REQUEST, {
          filterList: !contact.filterList,
        })
      );
      dispatch(updateState(userConstants.LOADER, { loading: true }));
      getContactList(pageno);
    }
  };
  const onChange = (page) => {
    updateReducer({ page })();
  };

  const openDetail = (contact_id) => {
    ApiGateway.get(
      `/payout/admin/contact/detail?contact_id=${contact_id}`,
      function (response) {
        if (response.success) {
          dispatch(
            updateState(userConstants.CONTACT_REQUEST, {
              conatctDetail: response.data.contact,
              merchantDetail: response.data.merchant,
              accountDetail: response.data.account,
              openDetail: !contact.openDetail,
            })
          );
          // updateReducer({ "conatctDetail": response.data.contact })({ "merchantDetail": response.data.merchant })({ "accountDetail": response.data.account })({ "openDetail": !contact.openDetail })();
        }
      }
    );
  };

  const handleChange = useCallback((merchant) => {
    updateReducer({ selectedMerchant: merchant !== null ? merchant : {} })({
      merchant_id: merchant !== null ? merchant.value : "",
    })();
  }, []);

  const stateChanges = (payload) => {
    return { type: userConstants.CREATE_CONTACT, payload };
  };
  const handleSelect = (value) => {
    dispatch(
      stateChanges({
        contact_type: value,
        drop_down_open: false,
        itemSearchTerm: "",
      })
    );
  };

  const resetFilter = () => {
    setPageNo(1);
    if(selectionRange){
      setSelectionRange([
          {
            startDate: null,
            endDate: new Date(""),
            key: "selection",
          },
      ]);
    }
    let contact_copy = contact;

    if (contact_copy.contact_type) {
      delete contact_copy.contact_type;
      delete contact_copy.ContactType;
    }
    if (contact_copy.selection) {
      delete contact_copy.selection;
      delete contact_copy.Selection;
    }
    if (contact_copy.searchTerm) {
      contact_copy.searchTerm = "";
    }
    if (contact_copy.searchTerm) {
      delete contact_copy.searchTerm;
      contact_copy.searchTerm = "";
    }
    if (contact_copy.search_type) {
      delete contact_copy[contact_copy.search_type];
      delete contact_copy.SearchType;
      contact_copy.search_type = "";
      getContactList(pageno);
    }
    if (contact_copy.status) {
      delete contact_copy.status;
      delete contact_copy.Status;
    }
    if (contact_copy.merchant_id) {
      delete contact_copy.merchant_id;
      delete contact_copy.MerchantId;
    }
    if (contact_copy.from) {
      contact_copy.startDate = new Date();
      contact_copy.endDate = new Date();
      contact_copy.from = "";
      contact_copy.to = "";
      contact_copy.fromDate = "";
      contact_copy.toDate = "";
    }
    if (contact_copy.merchant_id) {
      contact_copy.merchant_id = "";
      contact_copy.selectedMerchant = {};
    }
    dispatch(updateState(userConstants.CONTACT_REQUEST, { ...contact_copy }));
    dispatch(updateState(userConstants.CONTACT_REQUEST, { filter:"" }));
    setActive(false);
    setSeacrhBox(true);
  };

  const selectFilter = (filter, e) => {
    setActive(true);
    setSeacrhBox(false);
    let str = manipulateString(filter);
    dispatch(
      updateState(userConstants.CONTACT_REQUEST, {
        [filter]: e.value,
        [str]: e,
        searchTerm: "filter" === "search_type" ? "" : contact.searchTerm,
      })
    );
  };
  
 const submitDateFilter = () => {
    const contact = latestValue.current;
    if (contact.endDate > contact.startDate) {
      dispatch(
        updateState(userConstants.CONTACT_REQUEST, {
          from: moment(contact.startDate).format("DD/MM/YYYY"),
          to: moment(contact.endDate).format("DD/MM/YYYY"),
          fromDate: moment(contact.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(contact.endDate)
            .utc()
            .add(1, "days")
            .endOf("day")
            .format(),
          open_picker: false,
        })
      );
    } else {
      dispatch(
        updateState(userConstants.CONTACT_REQUEST, {
          from: moment(contact.startDate).format("DD/MM/YYYY"),
          to: moment(contact.startDate).format("DD/MM/YYYY"),
          fromDate: moment(contact.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(contact.startDate)
            .utc()
            .add(1, "days")
            .endOf("day")
            .format(),
          open_picker: false,
        })
      );
    }
  }; 
  const handleSearchChange = useCallback((e) => {
    var name = e.target.name;
    var value = e.target.value;
    dispatch(updateState(userConstants.CONTACT_REQUEST, { [name]: value }));
  }, []);

  const [selectionRange, setSelectionRange] = useState([
    {
      startDate: contact.startDate,
      endDate: contact.endDate,
      key: "selection",
    },
  ]);

 const dateChange = (dates) => {
    setSelectionRange([dates.selection]);
    dispatch(
      updateState(userConstants.CONTACT_REQUEST, {
        startDate: dates.selection.startDate,
        endDate: dates.selection.endDate,
        
      })
    )
  }; 

  

  
  
/*   const dateChange = (dates) => {
    setSelectionRange([dates.selection]);
    dispatch(
      updateState(userConstants.CONTACT_REQUEST, {
        startDate: dates.selection.startDate,
        endDate: dates.selection.endDate,
      })
    ).then(()=>{
      const contact = latestValue.current;
      if (dates.selection.endDate > dates.selection.startDate) {
        dispatch(
          updateState(userConstants.CONTACT_REQUEST, {
            startDate: dates.selection.startDate,
        endDate: dates.selection.endDate,
            from: moment(contact.startDate).format("DD/MM/YYYY"),
            to: moment(contact.endDate).format("DD/MM/YYYY"),
            fromDate: moment(contact.startDate)
              .utc()
              .add(1, "days")
              .startOf("day")
              .format(),
            toDate: moment(contact.endDate)
              .utc()
              .add(1, "days")
              .endOf("day")
              .format(),
            open_picker: false,
          })
        );
      }else {
        dispatch(
          updateState(userConstants.CONTACT_REQUEST, {
            startDate: dates.selection.startDate,
            endDate: dates.selection.endDate,
            from: moment(contact.startDate).format("DD/MM/YYYY"),
            to: moment(contact.startDate).format("DD/MM/YYYY"),
            fromDate: moment(contact.startDate)
              .utc()
              .add(1, "days")
              .startOf("day")
              .format(),
            toDate: moment(contact.startDate)
              .utc()
              .add(1, "days")
              .endOf("day")
              .format(),
            open_picker: false,
            
          })
        );
      }
    });
 
     } */


  const [seacrhBox, setSeacrhBox] = useState(true);
  const memoizedFilterValue = useMemo(() => {
    return {
      searchTerm: contact.searchTerm,
      selectedMerchant: contact.selectedMerchant,
      merchantList: contact.merchantList,
      isOpenMenu: contact.isOpenMenu,
      more_filters: contact.more_filters,
      Selection: contact.Selection,
      ContactType: contact.ContactType,
      open_picker: contact.open_picker,
      selectionRange: selectionRange,
      from: contact.from,
      to: contact.to,
      status_filter: true,
      Status: contact.Status,
    };
  }, [
    contact.searchTerm,
    contact.selectedMerchant,
    contact.merchantList,
    contact.isOpenMenu,
    contact.more_filters,
    contact.Selection,
    contact.ContactType,
    contact.open_picker,
    selectionRange,
    contact.fromDate,
    contact.Status,
  ]);

  const onMenuClose = useCallback(() => {
    dispatch(updateState(userConstants.CONTACT_REQUEST, { isOpenMenu: false }));
  }, []);

  const showToggle = useCallback(
    (name) => {
      dispatch(
        updateState(userConstants.CONTACT_REQUEST, { [name]: !contact[name] })
      );
    },
    [contact.more_filters]
  );

  const openPicker = useCallback(() => {
    dispatch(
      updateState(userConstants.CONTACT_REQUEST, {
        open_picker: !contact.open_picker,
      })
    );
  }, []);
  const handleDate = () => {
    dispatch(
      updateState(userConstants.CONTACT_REQUEST, {
        open_picker: !contact.open_picker,
      })
    );
  };
  return (
    <div className="content_wrapper dash_wrapper">
 
      {contactListRoute ? <>
        {loading && <Loader />}
        <div className="dash_merchent_welcome">
        <div className="merchent_wlcome_content">Contacts 
              <div className="bread_crumb">
                  <ul className="breadcrumb">
                  <li ><Link to="/dashboard" className="inactive_breadcrumb">Home</Link></li>
                  <li className="active_breadcrumb">Contacts</li>
              
                  </ul>
                  </div>
                  </div>
      </div>
      <div className="white_tab_wrap">
        <div className="white_tab_box">
          <div className="col-xs-12 p-0 ">
            <div className="col-md-6 p-l-0 p-r-0">
              <div className="trans-text m-b-5 color-grey font-semibold">
                Search by ID / Email / Name / Phone / Name
              </div>
              <div className="payout_popup_search ">
                <div className="input-group">
                  <input
                    className="payout_popup_search_input"
                    type="text"
                    name={contact.search_type || "searchTerm"}
                    value={contact[contact.search_type] || contact.searchTerm}
                    onChange={handleSearchChange}
                    disabled={seacrhBox}
                    style={{ backgroundColor: active ? "#fff" : "#f1f1f1" }}
                  />

                  <div className="payout_popup_search_select">
                    <Select
                      className="selectpicker"
                      options={Id_Filter}
                      value={
                        contact.SearchType !== undefined && contact.SearchType
                      }
                      onChange={(e) => {
                        selectFilter("search_type", e);
                      }}
                    />
                  </div>
                  <span className="input-group-addon" onClick={submitFilter}>
                    <i className="fa fa-search"></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-md-3 p-r-0">
                <div className="trans-text m-b-5 color-grey font-semibold">
                  Select by Business Name
                </div>

                <>
                  <AsyncPaginate
                    loadOptions={getAllMerchant}
                    getOptionValue={(option) => option.merchantId}
                    getOptionLabel={(option) => option.businessName}
                    onChange={(e) => selectMerchantFilter("merchant_id",e)}   
                    value={
                        contact.MerchantId !== undefined &&
                        contact.MerchantId
                      }                    
                    isSearchable={true}
                    placeholder="Select Business"
                    additional={{
                      page: 1,
                    }}
                    classNamePrefix={"react-select"}
                  />
                </>
              </div>

            <div className="col-xs-12 col-md-3 p-r-0 payout_select_picker">
              <div className="trans-text m-b-5 color-grey font-semibold">
                Select by Contact Type
              </div>
              <Select
                className="selectpicker"
                placeholder="Contact Type"
                options={Contact_Type}
                onChange={(e) => selectFilter("contact_type", e)}
                value={contact.ContactType !== undefined && contact.ContactType}
              />
            </div>
        
            <div className="col-xs-12 m-b-30 p-0 m-t-30">
              <div className="col-xs-12 col-md-2 p-0 m-b-5 ">
                <div className="trans-text m-b-5 color-grey font-semibold">
                  Select By Dates
                </div>
                <input
                  className="fileter_form_input"
                  id="from_date"
                  name="date"
                  placeholder=""
                  type="text"
                  onClick={handleDate}
                  value={
                    contact.from !== "" ? `${contact.from} ~ ${contact.to}` : ""
                  }
                />
                <div
                  className={
                    contact.open_picker
                      ? "react_date_range_picker"
                      : "react_date_range_picker hide"
                  }
                >
                  <DateRangePicker
                    months={2}
                    ranges={selectionRange}
                    onChange={dateChange}
                    direction="horizontal"
                    maxDate={new Date()}
                    showMonthAndYearPickers={false}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    showPreview={false}
                    showDateDisplay={false}
                  />
                  <span className="submitDateBtn" onClick={submitDateFilter}>
                    Submit
                  </span>
                </div>
              </div>
              
              <div className="col-xs-12 col-md-3 p-l-0  payout_select_picker m-l-20 p-r-0">
                <div className="trans-text m-b-5 color-grey font-semibold">
                  Select By Status
                </div>
                <Select
                  className="selectpicker"
                  placeholder="Status"
                  options={Status_Filter}
                  onChange={(e) => selectFilter("status", e)}
                  value={contact.Status !== undefined && contact.Status}
                />
              </div>
             <div className="col-xs-12 textCenter">
            <div className="col-xs-12 m-b-10 p-0 textCenter">
            <label className="col-xs-12 m-t-25">
              <a
                  className="submitBtn m-l-15 border-plain "
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
              </label>
            </div>
             </div>
            </div>
            <div className="col-xs-12 p-0">
              <div className="table-responsive">
                <table className="table  table_customization">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Phone No.</th>
                      <th>Email</th>
                      <th>Created At</th>
                      <th>Contact ID</th>
                      <th>Business Name</th>
                      <th>Merchant ID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactListRoute ? <>
                      {contact.contactList.length > 0
                      ? contact.contactList.map((list, i) => {
                          return (
                            <tr key={i}>
                              <td>{(pageno - 1) * limit + (i + 1)}</td>
                              <td>{textCapitalize(list?.name.full)}</td>
                              <td>{textCapitalize(list?.contact_type)}</td>
                              <td>{list?.mobile.national_number}</td>
                              <td>{list.email}</td>
                              <td>{returnTimeZoneDate(list?.createdAt)}</td>
                              <td>
                                <a className="label_edit">{list?.contact_id}</a>
                              </td>
                              <td>
                                {list?.merchant_name !== undefined &&
                                  list?.merchant_name}
                              </td>
                              <td>
                                {list?.merchant_id ? list?.merchant_id : "-"}
                              </td>
                              <td>
                                <span
                                  className={
                                    list.status == "active"
                                      ? "label_success"
                                      : list?.status == "inactive"
                                      ? "label_danger"
                                      : ""
                                  }
                                >
                                  {textCapitalize(list?.status)}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      : ""}</> :   <tr>
                      <td className="text-center" colSpan="10">
                        Access Denied
                      </td>
                    </tr> }
                    
                  </tbody>
                </table>
              </div>

              <div className="table-bottom-content">
                <Pagination
                  handle={getContactList}
                  list={recordsLength}
                  currentpage={pageno}
                />
              </div>
            </div>
          </div>
        </div>
      </div></> : 
      
    <>
      <div className="dash_merchent_welcome">
      <div className="merchent_wlcome_content">Contacts 
            <div className="bread_crumb">
                <ul className="breadcrumb">
                <li ><Link to="/dashboard" className="inactive_breadcrumb">Home</Link></li>
                <li className="active_breadcrumb">Contacts</li>
            
                </ul>
                </div>
                </div>
    </div>
      <div className="white_tab_wrap">
  <div className="white_tab_box">
    <div className="col-xs-12 text-center p-0 access-denied">
      Access Denied to view this Section. Contact Admin.
    </div>
  </div>
</div></> }
   


      {contact.openDetail ? (
        <div
          id="contact_details"
          className={
            contact.openDetail ? "modal modalbg fade in" : "modal fade"
          }
          style={{ display: contact.openDetail ? "block" : "none" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  onClick={() =>
                    updateReducer({ conatctDetail: {} })({
                      merchantDetail: {},
                    })({ accountDetail: {} })({
                      openDetail: !contact.openDetail,
                    })()
                  }
                >
                  ×
                </button>
                <h4 className="modal-title">Contact Details</h4>
              </div>
              <div className="modal-body clearfix modal_label_right">
                <div className="sub_heading_new m-t-5 m-b-20">
                  Contact Details :
                </div>
                <div className="col-xs-12">
                  <div className="col-xs-12 col-md-6 p-r-0">
                    <div className="info_title">Type</div>
                    <div className="info_value">
                      {contact.conatctDetail.contact_type}
                    </div>
                  </div>
                </div>
                <div className="sub_heading_new m-t-5 m-b-20">
                  Merchant Details :
                </div>
                <div className="col-xs-12">
                  <div className="row">
                    <div className="col-xs-12 col-md-6">
                      <div className="info_title">Name</div>
                      <div className="info_value">
                        {contact.merchantDetail?.fullName}
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6">
                      <div className="info_title">Email</div>
                      <div className="info_value">
                        {contact.merchantDetail?.email}
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 ">
                      <div className="info_title">Created By</div>
                      <div className="info_value">
                        {contact.merchantDetail?.audit?.createdBy?.name}
                      </div>
                    </div>
                  </div>
                </div>
                {/*  <div className="sub_heading_new m-t-5 m-b-20">Fund Account Details :</div>
                                    <div className="col-xs-12 contact_details_account">
                                        <div className="row">
                                            <div className="col-xs-12 col-sm-6">
                                                <div className="payout_added_section_list">
                                                    <div className="info_title"><img src={UPI} height="17" /> UPI Account</div>
                                                    <div className="info_value">987654321@paytm</div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-sm-6">
                                                <div className="payout_added_section_list">
                                                    <div className="info_title"><img src={BANK} height="17" /> Bank Account</div>
                                                    <div className="info_value">HDFC Bank, 50100261476277</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Contact;
