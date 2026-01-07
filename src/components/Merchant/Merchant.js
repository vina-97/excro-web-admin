import React, { useEffect, useState, useRef } from "react";
import { imagePath } from "../../assets/ImagePath";
import ApexChart from "../Chart";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "../../constants/ActionTypes";
import { ToastProvider, useToasts } from "react-toast-notifications";
import ApiGateway from "../../DataServices/DataServices";
import {
  returnTimeZoneDate,
  textCapitalize,
  manipulateString,
  validate,
  getCookie,
} from "../../DataServices/Utils";
import Pagination from "../Pagination";
import { Link } from "react-router-dom";
import FilterList from "../FilterList";
import Select from "react-select";
import Switch from "react-switch";
import Loader from "../Loader";
import moment from "moment";
import { DateRangePicker } from "react-date-range";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AsyncPaginate } from "react-select-async-paginate";
import useRouteExist from "../../DataServices/useRouteExist";
import ResellerSelect from "../NodalAccount/components/ResellerSelect";

import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { get } from "lodash";

const Merchant = () => {
  const { payout_merchant, auth, nodal_account } = useSelector(
    (state) => state
  );
  const { pagination, loading } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };
  const stateChanges = (actionType, payload) => {
    return { type: actionType, payload };
  };
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };

  const [state, setState] = useState({
    reseller_id: null,
    reseller_name: null, // 👈 MUST be null
  });

  const latestValue = useRef({});

  latestValue.current = payout_merchant;
  const [pageno, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [recordsLength, setrecordLength] = useState([]);
  const [nodalOptions, SetNodalOptions] = useState([]);

  const accountType = [
    { value: "isConnectedBanking", label: "Connected Banking" },
    { value: "escrow", label: "Escrow" },
  ];

  const generateReportRoute = useRouteExist(["admin-merchant-generate-report"]);
  const merchantResellerRoute = useRouteExist(["admin-merchant-reseller-list"]);
  const merchantListRoute = useRouteExist(["admin-merchant-list"]);
  const merchantStatus = useRouteExist(["admin-merchant-status-update"]);
  const merchantNodalApprove = useRouteExist([
    "admin-merchant-activate-account",
  ]);
  const merchantPricingRoute = useRouteExist([
    "admin-merchant-pricing-settings",
  ]);
  const merchantaddRoute = useRouteExist(["admin-merchant-add"]);

  const getYesterdayDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Set to one day before today
    return yesterday;
  };
  const [selectDate, setSelectDate] = useState(getYesterdayDate());

  useEffect(() => {
    resetFilter();
  }, []);
  useEffect(() => {
    if (
      payout_merchant.openApproveModal &&
      payout_merchant.isConnectedBanking === "escrow"
    ) {
      nodalAccount();
    }
  }, [
    payout_merchant.openApproveModal &&
      payout_merchant.isConnectedBanking === "escrow",
  ]);

  useEffect(() => {
    SetNodalOptions(
      payout_merchant.nodalAccountList?.map((list, i) => {
        return { value: list.account_id, label: list.name };
      })
    );
  }, [payout_merchant.nodalAccountList]);

  useEffect(() => {
    getMerchantList(pageno);
  }, [payout_merchant.page, payout_merchant.filter]);
  const handleTextChange = (e) => {
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        [e.target.name]: e.target.value.toUpperCase(),
      })
    );
  };
  const handleNumberChange = (e) => {
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        [e.target.name]: e.target.value,
      })
    );
  };

  const handleChange = (list) => {
    var data = {
      status:
        list.status == "active"
          ? "inactive"
          : list.status == "inactive"
          ? "active"
          : list.status,
      merchantId: list.merchantId,
    };

    dispatch(updateState(userConstants.LOADER, { loading: true }));
    ApiGateway.patch(
      `/payout/admin/merchant/merchant-status`,
      data,
      function (response) {
        if (response.success) {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          getMerchantList(pageno);
          applyToast(response.message, "success");
        } else {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          applyToast(response.message, "error");
        }
      }
    );
  };

  const handleAddMerchant = () => {
    ApiGateway.get(`/payout/sso/code`, function (response) {
      if (response.success) {
        const data = response;
        console.log(data, data?.redirectTo);

        if (data?.code) {
          window.open(
            `${data.redirectTo}/auth/callback?code=${data.code}&from=merchant`,
            "_blank",
            "noopener,noreferrer"
          );
          return;
        }

        // if (data?.code) {
        //   window.open(
        //     `http://localhost:5173/auth/callback?code=${data.code}&from=merchant`,
        //     "_blank",
        //     "noopener,noreferrer"
        //   );
        //   return;
        // }
      } else {
        applyToast(response.message, "error");
      }
    });
  };

  const handleEditMerchant = (record) => {
    console.log("id console", record);
    ApiGateway.get(`/payout/sso/code`, function (response) {
      if (response.success) {
        const data = response;
        console.log(data, data?.redirectTo);

        if (data?.code) {
          window.open(
            `${data.redirectTo}/auth/callback?code=${data.code}&merchantId=${record?.onboarding_businessId}&from=merchant&onboardingStatus=${record?.onboarding_status}`,
            "_blank",
            "noopener,noreferrer"
          );
          return;
        }

        // if (data?.code) {
        //   window.open(
        //     `http://localhost:5173/auth/callback?code=${data.code}&merchantId=${record?.onboarding_businessId}&from=merchant&onboardingStatus=${record?.onboarding_status}`,
        //     "_blank",
        //     "noopener,noreferrer"
        //   );
        //   return;
        // }
      } else {
        applyToast(response.message, "error");
      }
    });
  };

  /*  const handleChange = (merchantId, idx, status) => {
    var data = {
      status: status,
      merchantId: merchantId,
    };
    ApiGateway.patch(
      `/payout/admin/merchant/merchant-status`,
      data,
      function (response) {
        if (response.success) {
          let merchant = payout_merchant.merchantList;
          merchant[idx].status = status ? "deactive" : "active";
          dispatch(
            stateChanges(userConstants.PAYOUT_MERCHANT, {
              merchantList: merchant,
            })
          );
        }
      }
    );
  }; */
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const handleClick = () => {
    setActive(true);
  };
  const Id_Filter = [
    { value: "merchantId", label: "Merchant Id" },
    { value: "search_term", label: "Business Name" },
    { value: "email", label: "Email" },
    { value: "phone.number", label: " Phone Number" },
  ];
  const Duration_Filter = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "3month", label: "Last 3 Months" },
    /*    { value: "6month", label: "Last 6 Months" },
        { value: "year", label: "Last year" }, */
  ];
  const status_filter = [
    { value: "", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "In Active" },
  ];

  const status_approve = [
    { value: "", label: "All" },
    { value: "activated", label: "Activated" },
    { value: "pending", label: "InActive" },
  ];
  const bank = [
    { value: "quadcast", label: "Quadcast", value: "axis", label: "Axis" },
  ];
  const showFilterList = () => {
    if (
      payout_merchant.searchTerm !== "" ||
      (payout_merchant[payout_merchant.search_type] !== undefined &&
        payout_merchant[payout_merchant.search_type] !== "")
    ) {
      dispatch(
        updateState(userConstants.PAYOUT_MERCHANT, {
          filterList: !payout_merchant.filterList,
        })
      );
      dispatch(updateState(userConstants.LOADER, { loading: true }));
    }
  };

  const submitFilter = () => {
    var queryParam = "";
    queryParam += !payout_merchant.reseller_id
      ? ""
      : `&reseller.id=${payout_merchant.reseller_id}`;
    queryParam +=
      !payout_merchant.status || payout_merchant.status === "all"
        ? ""
        : `&status=${payout_merchant.status}`;
    queryParam += !payout_merchant.selection
      ? ""
      : `&selection=${payout_merchant.selection}`;
    queryParam +=
      payout_merchant.fromDate === ""
        ? ""
        : "&from_date=" + payout_merchant.fromDate;

    queryParam +=
      payout_merchant.accountActivationStatus === ""
        ? ""
        : "&accountActivationStatus=" + payout_merchant.accountActivationStatus;
    queryParam += !payout_merchant.content_type_filter
      ? ""
      : `&contact_type=${payout_merchant.content_type_filter}`;
    queryParam +=
      payout_merchant.toDate === "" ? "" : "&to_date=" + payout_merchant.toDate;
    queryParam +=
      payout_merchant[payout_merchant.search_type] === undefined ||
      payout_merchant[payout_merchant.search_type] === ""
        ? ""
        : `&${payout_merchant.search_type}=` +
          payout_merchant[payout_merchant.search_type];
    queryParam += payout_merchant.searchTerm
      ? "&search_term=" + payout_merchant.searchTerm
      : "";
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, { filter: queryParam })
    );
    setPageNo(1);
  };

  const getMerchantList = (page) => {
    dispatch(updateState(userConstants.LOADER, { loading: true }));
    setPageNo(page);

    ApiGateway.get(
      `/payout/admin/merchant/list?page=${page}&limit=${limit}${
        payout_merchant.filter ? payout_merchant.filter : ""
      }`,
      function (response) {
        if (response.success) {
          dispatch(
            updateState(userConstants.PAYOUT_MERCHANT, {
              merchantList: response.data.merchants,
            })
          ).then(() => {
            dispatch(updateState(userConstants.LOADER, { loading: false }));
          });
          setrecordLength(response.data.merchants.length);
        } else {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          applyToast(response.message, "error");
        }
      }
    );
  };

  const onChange = (page) => {
    dispatch(stateChanges(userConstants.PAYOUT_MERCHANT, { page }));
  };
  const handleSearchChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    dispatch(updateState(userConstants.PAYOUT_MERCHANT, { [name]: value }));
  };

  const nodalAccount = () => {
    let queryParams = "";
    if (state?.reseller_id || state.reseller_id) {
      queryParams += `&reseller.id=${state?.reseller_id || state.reseller_id}`;
    } else {
      queryParams += `&is_reseller=false`;
    }
    ApiGateway.get(
      `/payout/admin/nodal/list?isConnectedBankingEnabled=false&status=active${queryParams}`,
      function (response) {
        if (response.success) {
          dispatch(
            updateState(userConstants.PAYOUT_MERCHANT, {
              nodalAccountList: response.data.accounts,
            })
          );
        } else {
          applyToast(response.message, "error");
        }
      }
    );
  };

  const onSelectNodal = (e) => {
    dispatch(
      stateChanges(userConstants.PAYOUT_MERCHANT, {
        nodal_account_id: e.value,
        nodal_account_name: e.label,
      })
    );
  };
  const onSelectAccount = (option) => {
    if (!option) {
      dispatch(
        stateChanges(userConstants.PAYOUT_MERCHANT, {
          isConnectedBanking: null,
          isConnectedBankingLabel: null,
        })
      );
      return;
    }

    dispatch(
      stateChanges(userConstants.PAYOUT_MERCHANT, {
        isConnectedBanking: option.value,
        isConnectedBankingLabel: option.label,
      })
    );
  };

  const [reseller, setReseller] = useState({
    id: "",
    name: "",
  });
  const openNodalModal = (merchant_id, index, selectedData) => {
    dispatch(
      stateChanges(userConstants.PAYOUT_MERCHANT, {
        openApproveModal: !payout_merchant.openApproveModal,
        merchantId: merchant_id,
        pan: "",
        nodal_account_name: "",
        isConnectedBanking: null,
        reseller_id: selectedData?.reseller?.id,
        reseller_name: selectedData?.reseller?.name,
      })
    );
    setReseller((prevState) => ({
      ...prevState,
      id: selectedData?.reseller?.id ? selectedData?.reseller?.id : "",
      name: selectedData?.reseller?.name ? selectedData?.reseller?.name : "",
    }));
  };

  const approveMerchant = () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (
      !payout_merchant.nodal_account_name &&
      !payout_merchant.isConnectedBankingLabel
    ) {
      applyToast("Please Select Any One Account Type", "error");
    } else if (
      payout_merchant.isConnectedBanking === "escrow" &&
      !payout_merchant.nodal_account_name
    ) {
      applyToast("Please Select the Account", "error");
    } else if (!payout_merchant.pan || !panRegex.test(payout_merchant.pan)) {
      applyToast("Please Enter Valid PAN Number", "error");
    } else if (
      payout_merchant.isConnectedBanking === "isConnectedBanking" &&
      !payout_merchant.connectedBankingLimit
    ) {
      applyToast("Please Enter the Bank Limit", "error");
    } else {
      let data = {
        business: {
          panNo: payout_merchant.pan,
        },
      };

      if (
        payout_merchant.nodal_account_id &&
        payout_merchant.isConnectedBanking === "escrow"
      ) {
        data.account_id = payout_merchant.nodal_account_id;
      }
      if (
        payout_merchant.connectedBankingLimit &&
        payout_merchant.isConnectedBanking === "isConnectedBanking" &&
        !payout_merchant.nodal_account_id
      ) {
        data.isConnectedBanking = true;
        data.connectedBankingLimit = payout_merchant.connectedBankingLimit;
      }

      if (state.reseller_id && state.reseller_id !== "select all") {
        data.reseller_id = state.reseller_id;
      }

      dispatch(updateState(userConstants.LOADER, { loading: true }));
      ApiGateway.patch(
        "/payout/admin/merchant/activateAccount?merchant_id=" +
          payout_merchant.merchantId,
        data,
        function (response) {
          if (response.success) {
            applyToast(response.message, "success");
            dispatch(updateState(userConstants.LOADER, { loading: false }));
            dispatch(
              stateChanges(userConstants.PAYOUT_MERCHANT, {
                openApproveModal: !payout_merchant.openApproveModal,
              })
            );
            getMerchantList(pageno);
            // let merchant = payout_merchant.merchantList;
            // merchant[idx].accountActivationStatus = "Activated";
            // dispatch(stateChanges(userConstants.PAYOUT_MERCHANT, { merchantList: merchant }))
          } else {
            applyToast(response.message, "error");
            dispatch(updateState(userConstants.LOADER, { loading: false }));
            dispatch(
              stateChanges(userConstants.PAYOUT_MERCHANT, {
                openApproveModal: !payout_merchant.openApproveModal,
              })
            );
          }
        }
      );
    }
  };
  console.log(state, payout_merchant);

  const [selectionRange, setSelectionRange] = useState([
    {
      startDate: payout_merchant.startDate,
      endDate: payout_merchant.endDate,
      key: "selection",
    },
  ]);

  const dateChange = (dates) => {
    setSelectionRange([dates.selection]);
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        startDate: dates.selection.startDate,
        endDate: dates.selection.endDate,
      })
    );
  };
  const [seacrhBox, setSeacrhBox] = useState(true);
  const selectFilter = (filter, e) => {
    setSeacrhBox(false);
    setActive(true);
    let str = manipulateString(filter);
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        [filter]: e.value,
        [str]: e,
        searchTerm:
          "filter" === "search_type" ? "" : payout_merchant.searchTerm,
      })
    );
  };

  const handleApproveStatus = (e) => {
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        accountActivationStatus: e.value,
        accountActivationStatusLabel: e,
      })
    );
  };
  const selectResellerFilter = (e) => {
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        reseller_id: e.reseller_id,
        reseller_name: e,
      })
    );
  };

  const selectApproveResellerFilter = (e) => {
    setState((prevState) => ({
      ...prevState,
      reseller_id: e.value,
      reseller_name: e,
    }));
  };
  const getAllResller = async (searchQuery, loadedOptions, { page }) => {
    return new Promise((resolve, reject) => {
      let queryParam = "";
      queryParam += !searchQuery ? "" : `&search_term=${searchQuery}`;
      ApiGateway.get(
        `/payout/admin/reseller/list?page=${page}&limit=10${queryParam}`,
        function (response) {
          if (response) {
            resolve({
              options: response.data.resellers,
              hasMore: response.data.resellers.length >= 10,
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

  const resetFilter = () => {
    if (selectionRange) {
      setSelectionRange([
        {
          startDate: null,
          endDate: new Date(""),
          key: "selection",
        },
      ]);
    }
    setPageNo(1);
    let payout_merchant_copy = payout_merchant;

    if (payout_merchant_copy.selection) {
      delete payout_merchant_copy.selection;
      delete payout_merchant_copy.Selection;
    }
    if (payout_merchant_copy.reseller_id) {
      delete payout_merchant_copy.reseller_id;
      delete payout_merchant_copy.reseller_name;
    }
    if (payout_merchant_copy.searchTerm) {
      payout_merchant_copy.searchTerm = "";
    }
    if (payout_merchant_copy.searchTerm) {
      delete payout_merchant_copy.searchTerm;
      payout_merchant_copy.searchTerm = "";
    }
    if (payout_merchant_copy.search_type) {
      delete payout_merchant_copy[payout_merchant_copy.search_type];
      delete payout_merchant_copy.SearchType;
      payout_merchant_copy.search_type = "";
      getMerchantList(pageno);
    }
    if (payout_merchant_copy.status) {
      delete payout_merchant_copy.status;
      delete payout_merchant_copy.Status;
    }

    if (payout_merchant_copy.businessName) {
      delete payout_merchant_copy.businessName;
      delete payout_merchant_copy.businessName;
    }
    if (payout_merchant_copy.email) {
      delete payout_merchant_copy.email;
      delete payout_merchant_copy.email;
    }
    if (payout_merchant_copy.number) {
      delete payout_merchant_copy.number;
      delete payout_merchant_copy.number;
    }

    if (payout_merchant_copy.merchantId) {
      delete payout_merchant_copy.merchantId;
      delete payout_merchant_copy.FullName;
    }
    if (payout_merchant_copy.from) {
      payout_merchant_copy.startDate = new Date();
      payout_merchant_copy.endDate = new Date();
      payout_merchant_copy.from = "";
      payout_merchant_copy.to = "";
      payout_merchant_copy.fromDate = "";
      payout_merchant_copy.toDate = "";
    }
    if (payout_merchant_copy.accountActivationStatus) {
      payout_merchant_copy.accountActivationStatus = "";
      payout_merchant_copy.accountActivationStatusLabel = "";
    }

    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        ...payout_merchant_copy,
      })
    );
    dispatch(
      updateState(userConstants.PAYOUT_MERCHANT, {
        filter: "",
      })
    );
    setActive(false);
    setSeacrhBox(true);
    setPageNo(1);
  };
  const submitDateFilter = () => {
    const payout_merchant = latestValue.current;

    if (payout_merchant.endDate > payout_merchant.startDate) {
      dispatch(
        updateState(userConstants.PAYOUT_MERCHANT, {
          from: moment(payout_merchant.startDate).format("DD/MM/YYYY"),
          to: moment(payout_merchant.endDate).format("DD/MM/YYYY"),
          fromDate: moment(payout_merchant.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(payout_merchant.endDate)
            .utc()
            .add(1, "days")
            .endOf("day")
            .format(),
          open_picker: false,
        })
      );
    } else {
      dispatch(
        updateState(userConstants.PAYOUT_MERCHANT, {
          from: moment(payout_merchant.startDate).format("DD/MM/YYYY"),
          to: moment(payout_merchant.startDate).format("DD/MM/YYYY"),
          fromDate: moment(payout_merchant.startDate)
            .utc()
            .add(1, "days")
            .startOf("day")
            .format(),
          toDate: moment(payout_merchant.startDate)
            .utc()
            .add(1, "days")
            .endOf("day")
            .format(),
          open_picker: false,
        })
      );
    }
  };

  const closePrefixModal = () => {
    dispatch(
      stateChanges(userConstants.PAYOUT_MERCHANT, { openApproveModal: false })
    );
  };

  const openGenModal = (id) => {
    dispatch(
      stateChanges(userConstants.PAYOUT_MERCHANT, {
        openGenReportModal: !payout_merchant.openGenReportModal,
        con_report_id: id?.merchantId,
        businessName: id?.businessName,
      })
    );
    setSelectDate(getYesterdayDate());
  };

  const generateConsolidateReport = () => {
    let data = {
      merchant_id: payout_merchant.con_report_id,
      date: moment(selectDate).utc().startOf("day").format(),
    };

    dispatch(updateState(userConstants.LOADER, { loading: true }));
    ApiGateway.post(
      `/payout/admin/transaction/generate/dayreport`,
      data,
      function (response) {
        if (response.success) {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          dispatch(
            stateChanges(userConstants.PAYOUT_MERCHANT, {
              openGenReportModal: !payout_merchant.openGenReportModal,
            })
          );
          applyToast(response.message, "success");
        } else {
          dispatch(updateState(userConstants.LOADER, { loading: false }));
          dispatch(
            stateChanges(userConstants.PAYOUT_MERCHANT, {
              openGenReportModal: !payout_merchant.openGenReportModal,
            })
          );
          applyToast(response.message, "error");
        }
      }
    );
  };

  const closeGenReportModal = () => {
    dispatch(
      stateChanges(userConstants.PAYOUT_MERCHANT, {
        openGenReportModal: !payout_merchant.openGenReportModal,
        con_report_id: "",
      })
    );
  };

  const openInvoiceModal = (id) => {
    dispatch(
      stateChanges(userConstants.PAYOUT_MERCHANT, {
        openGenReportModal: !payout_merchant.openGenReportModal,
        con_report_id: id?.merchantId,
        businessName: id?.businessName,
      })
    );
    setSelectDate(getYesterdayDate());
  };

  const generateInvoice = (id) => {
    let data = {
      merchant_id: id,
      date: moment(selectDate).utc().add(1, "days").startOf("day").format(),
    };

    // console.log(data, "data");
    return false;
    dispatch(updateState(userConstants.LOADER, { loading: true }));
    ApiGateway.post(`/generate/dayreport `, data, function (response) {
      if (response.success) {
        dispatch(updateState(userConstants.LOADER, { loading: false }));

        applyToast(response.message, "success");
      } else {
        dispatch(updateState(userConstants.LOADER, { loading: false }));
        applyToast(response.message, "error");
      }
    });
  };

  const closeInvoiceModal = () => {
    dispatch(
      stateChanges(userConstants.PAYOUT_MERCHANT, {
        openGenReportModal: !payout_merchant.openGenReportModal,
        con_report_id: "",
      })
    );
  };

  const handleChangeSelect = (selected, name) => {
    setReseller((prevState) => ({
      ...prevState,
      id: selected ? selected.value : "",
      name:
        selected && selected.label
          ? selected.label.replace(/^Reseller\s*/, "")
          : "",
    }));
    dispatch(
      updateState(userConstants.NODAL_ACCOUNT, {
        reseller: { [name]: selected ? selected.value : "" },
      })
    );
    // console.log("Selected Reseller ID:", name, selected ? selected.value : "");
  };

  return (
    <>
      <div className="content_wrapper dash_wrapper">
        {loading.loading && <Loader />}
        <div className="dash_merchent_welcome">
          <div className="merchent_wlcome_content">
            Merchants
            <div className="bread_crumb">
              <ul className="breadcrumb">
                <li>
                  <Link to="/dashboard" className="inactive_breadcrumb">
                    Home
                  </Link>
                </li>
                <li className="active_breadcrumb">Merchants</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="white_tab_wrap">
          <div className="white_tab_box">
            <div className="col-xs-12 m-b-20 p-0 ">
              <div className="col-md-6 p-l-0">
                <div className="trans-text m-b-5 color-grey font-semibold">
                  Select by Business Name / Email / Phone /Merchant Id
                </div>
                <div className="payout_popup_search ">
                  <div className="input-group">
                    <input
                      className="payout_popup_search_input"
                      type="text"
                      name={payout_merchant.search_type || "searchTerm"}
                      value={
                        payout_merchant[payout_merchant.search_type] ||
                        payout_merchant.searchTerm
                      }
                      onChange={handleSearchChange}
                      disabled={seacrhBox}
                      style={{ backgroundColor: active ? "#fff" : "#f1f1f1" }}
                    />

                    <div className="payout_popup_search_select">
                      <Select
                        className="selectpicker"
                        options={Id_Filter}
                        value={
                          payout_merchant.SearchType !== undefined &&
                          payout_merchant.SearchType
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
                  Select By Duration
                </div>
                <Select
                  className="selectpicker"
                  options={Duration_Filter}
                  onChange={(e) => selectFilter("selection", e)}
                  value={
                    payout_merchant.Selection !== undefined &&
                    payout_merchant.Selection
                  }
                />
              </div>

              {merchantaddRoute && (
                <div className="col-xs-12 col-md-3 m-t-25 add-merchant">
                  <button
                    className="submitBtn m-l-15 border-plain"
                    onClick={handleAddMerchant}
                  >
                    Add Merchant
                  </button>
                </div>
              )}
            </div>
            <div className="col-xs-12 m-b-15 p-0">
              <div className="col-xs-12 col-md-2 p-l-0 m-b-5">
                <label className="trans-text m-b-5  color-grey font-semibold">
                  Select By Status
                </label>
                <Select
                  className="selectpicker"
                  options={status_filter}
                  placeholder="Status"
                  onChange={(e) => selectFilter("status", e)}
                  value={
                    payout_merchant.Status !== undefined &&
                    payout_merchant.Status
                  }
                />
              </div>
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
                  onClick={() =>
                    dispatch(
                      updateState(userConstants.PAYOUT_MERCHANT, {
                        open_picker: !payout_merchant.open_picker,
                      })
                    )
                  }
                  value={
                    payout_merchant.from !== ""
                      ? `${payout_merchant.from} ~ ${payout_merchant.to}`
                      : ""
                  }
                />
                <div
                  className={
                    payout_merchant.open_picker
                      ? "react_date_range_picker"
                      : "react_date_range_picker hide"
                  }
                >
                  <DateRangePicker
                    months={2}
                    ranges={selectionRange}
                    onChange={(e) => dateChange(e)}
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

              <div className="col-xs-12 col-xs-2 p-0 m-l-20">
                <label className="trans-text m-b-5  color-grey font-semibold">
                  Select Approve Status
                </label>
                <Select
                  className="selectpicker"
                  options={status_approve}
                  placeholder="Approve Status"
                  onChange={(e) => handleApproveStatus(e)}
                  value={
                    payout_merchant.accountActivationStatusLabel !==
                      undefined && payout_merchant.accountActivationStatusLabel
                  }
                />
              </div>
              {merchantResellerRoute && (
                <div className="col-xs-12 col-md-2 p-0 m-l-20">
                  <label className="trans-text m-b-5  color-grey font-semibold">
                    Select Reseller Name
                  </label>
                  <div className="">
                    <AsyncPaginate
                      loadOptions={getAllResller}
                      getOptionValue={(option) => option?.reseller_id}
                      getOptionLabel={(option) => option?.reseller_name}
                      onChange={(e) => selectResellerFilter(e)}
                      isSearchable={true}
                      placeholder="Select Reseller"
                      additional={{
                        page: 1,
                      }}
                      classNamePrefix={"react-select"}
                      value={
                        payout_merchant.reseller_name !== undefined &&
                        payout_merchant.reseller_name
                      }
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="col-xs-12 p-0 m-t-25 m-b-15 textCenter">
              <div className="col-xs-12 m-t-25">
                <a className="submitBtn border-plain " onClick={submitFilter}>
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
            <div className="col-xs-12 p-0">
              <div className="table-responsive">
                <table className="table  table_customization">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Name</th>
                      <th>Business Name</th>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Created At</th>
                      <th>Reseller Name</th>
                      {/* <th>Account Type</th> */}
                      {merchantNodalApprove && <th>Approve</th>}
                      {merchantStatus && <th>Status</th>}

                      {merchantPricingRoute && <th>Action</th>}
                      {merchantStatus && <th>Settings</th>}
                      {generateReportRoute && <th>Generate Report</th>}
                      <th>Bank List</th>
                      <th>Velocity Check</th>
                      <th>Action</th>
                      {/* <th>Generate Invoice</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {merchantListRoute ? (
                      <>
                        {payout_merchant.merchantList.map((list, i) => {
                          return (
                            <tr className="payout_merchant" key={"list" + i}>
                              <td>{(pageno - 1) * limit + (i + 1)}</td>
                              <td>
                                {list?.fullName
                                  ? textCapitalize(list?.fullName.toLowerCase())
                                  : "-"}
                              </td>
                              <td>
                                {list?.businessName
                                  ? textCapitalize(
                                      list?.businessName.toLowerCase()
                                    )
                                  : "-"}
                              </td>
                              <td>
                                <Link
                                  to={`/merchant/merchant_edit/${list?.merchantId}`}
                                >
                                  {list?.merchantId}
                                </Link>
                              </td>
                              <td>{list?.email ? list?.email : "-"}</td>
                              <td>
                                {list?.phone?.number
                                  ? list?.phone?.number
                                  : "-"}
                              </td>
                              <td>
                                {list?.createdAt
                                  ? returnTimeZoneDate(list?.createdAt)
                                  : "-"}
                              </td>
                              <td>
                                {list?.reseller?.name
                                  ? list?.reseller?.name
                                  : "-"}
                              </td>
                              {/* <td >
                          <span className={
                                  list.isConnectedBanking
                                    ? "label_warning pointer-cursor" : "label_edit pointer-cursor"
                                }>{list?.isConnectedBanking ? "Connected Banking" : "Escrow"}</span>  
                          </td> */}
                              {merchantNodalApprove && (
                                <td>
                                  {list?.onboarding_status === "pending"
                                    ? "Pending"
                                    : list?.accountActivationStatus ===
                                        "pending" &&
                                      list?.onboarding_status === "completed"
                                    ? merchantNodalApprove && (
                                        <a
                                          onClick={() =>
                                            openNodalModal(
                                              list?.merchantId,
                                              i,
                                              list
                                            )
                                          }
                                          className="label_edit"
                                        >
                                          Approve
                                        </a>
                                      )
                                    : textCapitalize(
                                        list?.accountActivationStatus
                                      )}
                                </td>
                              )}

                              {merchantStatus && (
                                <>
                                  {/* <td>
                              <Switch
                                checked={
                                  list?.status === "active" ? true : false
                                }
                                onChange={() =>
                                  handleChange(
                                    list?.merchantId,
                                    i,
                                    list?.status === "active" ? true : false
                                  )
                                }
                                onColor="#86d3ff"
                                onHandleColor="#2693e6"
                                handleDiameter={30}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={20}
                                width={48}
                                className="react-switch"
                                id="material-switch"
                              />
                            </td> */}
                                  <td>
                                    {" "}
                                    <a
                                      className={
                                        list.status == "active"
                                          ? "label_success"
                                          : "label_warning"
                                      }
                                      onClick={() => handleChange(list)}
                                    >
                                      {textCapitalize(list?.status)}
                                    </a>
                                  </td>
                                </>
                              )}

                              {merchantPricingRoute && (
                                <td>
                                  <Link
                                    to={`/merchant/merchant_pricing/${list?.merchantId}`}
                                    className="label_edit"
                                  >
                                    Update Pricing
                                  </Link>
                                </td>
                              )}
                              {merchantStatus && (
                                <td>
                                  <Link
                                    to={`/merchant/merchant_edit/${list?.merchantId}`}
                                    className="label_primary"
                                  >
                                    Edit
                                  </Link>
                                </td>
                              )}
                              {generateReportRoute && (
                                <td>
                                  <span
                                    className="label_edit pointer-cursor"
                                    onClick={() => openGenModal(list)}
                                  >
                                    Generate Report
                                  </span>
                                </td>
                              )}
                              <td className="">
                                {list?.isConnectedBanking ? (
                                  <Link
                                    className="label_warning pointer-cursor"
                                    to={`/merchant/merchant-bank-list/${list?.merchantId}`}
                                  >
                                    View Bank List
                                  </Link>
                                ) : (
                                  <span className="label_edit pointer-cursor">
                                    No Connected Bank
                                  </span>
                                )}
                              </td>
                              <td>
                                <Link
                                  className="label_warning pointer-cursor"
                                  // to={`/merchant/velocity-check/${list?.merchantId}`}
                                  to={{
                                    pathname: `/merchant/velocity-check/${list?.merchantId}`,
                                    state: {
                                      merchantId: list?.merchantId,
                                      merchantName: list?.fullName,
                                    },
                                  }}
                                >
                                  Velocity Check
                                </Link>{" "}
                              </td>
                              {merchantStatus && (
                                <td>
                                  <button
                                    className="icon-btn edit-icon"
                                    onClick={() => handleEditMerchant(list)}
                                  >
                                    <Pencil />
                                  </button>
                                </td>
                              )}
                              {/* <td><span className="label_edit pointer-cursor" onClick={()=>generateInvoice(list?.merchantId)}>Generate Invoice</span></td> */}
                            </tr>
                          );
                        })}
                      </>
                    ) : (
                      <tr>
                        <td className="text-center" colSpan="15">
                          Access Denied
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="table-bottom-content">
                <Pagination
                  handle={getMerchantList}
                  list={recordsLength}
                  currentpage={pageno}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Modal
          className="customized_modal_new"
          isOpen={payout_merchant.openApproveModal}
          ariaHideApp={false}
        >
          <div
            className="modal modalbg fade in"
            style={{ display: "block", overflowX: "hidden", overflowY: "auto" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="close font-28"
                      onClick={closePrefixModal}
                    >
                      ×
                    </button>
                    <h4 className="modal-title modal-title-sapce">
                      Approve Merchant
                    </h4>
                  </div>
                </div>
                <div className="modal-body clearfix modal_label_right">
                  <div className="modal-body clearfix">
                    {/* <div className="form-group clearfix">
                      <label className="filter_label_left col-md-5 p-l-0">
                        Selected Reseller :
                      </label>
                      <div className="col-xs-12 col-md-6 p-0 mt-5">
                        <span>{reseller.name}</span>
                      </div>
                    </div> */}
                    <div className="form-group clearfix">
                      <label className="filter_label_left col-md-5 p-l-0">
                        Source From
                      </label>
                      <div className="col-xs-12 col-md-6 p-0 mt-5">
                        <AsyncPaginate
                          loadOptions={getAllResller}
                          getOptionValue={(option) => option.reseller_id}
                          getOptionLabel={(option) => option.reseller_name}
                          onChange={(option) => {
                            setState({
                              reseller_id: option?.reseller_id ?? null,
                              reseller_name: option ?? null,
                            });
                            dispatch(
                              stateChanges(userConstants.PAYOUT_MERCHANT, {
                                isConnectedBanking: null,
                                isConnectedBankingLabel: null,
                              })
                            );
                          }}
                          isSearchable
                          placeholder="Select Reseller"
                          additional={{ page: 1 }}
                          classNamePrefix="react-select"
                          value={state.reseller_name}
                        />
                      </div>
                    </div>
                    <div className="form-group clearfix">
                      <label className="filter_label_left col-md-5 p-l-0">
                        Select Account Type
                      </label>
                      <div className="col-xs-12 col-md-6 p-0">
                        <Select
                          className="selectpicker"
                          placeholder="Select"
                          options={accountType}
                          value={
                            payout_merchant.isConnectedBanking
                              ? accountType.find(
                                  (opt) =>
                                    opt.value ===
                                    payout_merchant.isConnectedBanking
                                )
                              : null
                          }
                          onChange={onSelectAccount}
                          isClearable
                        />
                      </div>
                    </div>
                    {payout_merchant.isConnectedBanking == "escrow" && (
                      <div className="form-group clearfix">
                        <label className="filter_label_left col-md-5 p-l-0">
                          Select Account
                        </label>
                        <div className="col-xs-12 col-md-6 p-0">
                          <Select
                            className="selectpicker"
                            placeholder="Select"
                            options={nodalOptions}
                            onChange={onSelectNodal}
                          />
                        </div>
                      </div>
                    )}

                    <div className="form-group clearfix">
                      <label className="filter_label_left col-md-5 p-l-0">
                        PAN
                      </label>
                      <div className="col-xs-12 col-md-6 p-0">
                        <input
                          type="text"
                          name="pan"
                          className="form-control"
                          id="pan"
                          placeholder="Enter PAN"
                          maxLength={10}
                          value={payout_merchant.pan}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                    {payout_merchant?.isConnectedBanking ==
                      "isConnectedBanking" && (
                      <>
                        {" "}
                        <div className="form-group clearfix">
                          <label className="filter_label_left col-md-5 p-l-0">
                            Bank Limit
                          </label>
                          <div className="col-xs-12 col-md-6 p-0">
                            <input
                              type="text"
                              name="connectedBankingLimit"
                              className="form-control"
                              id="connectedBankingLimit"
                              placeholder="Enter Number for Bank Limit"
                              value={payout_merchant.connectedBankingLimit}
                              maxLength={2}
                              onChange={handleNumberChange}
                              onKeyPress={validate}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="">
                      <div className="textCenter">
                        {/* <div></div> */}
                        <div className="m-t-15 ">
                          <button
                            type="button"
                            className="submitBtn"
                            onClick={approveMerchant}
                          >
                            Submit
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary m-l-10"
                            onClick={closePrefixModal}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          className="report_modal"
          isOpen={payout_merchant.openGenReportModal}
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
                    onClick={closeGenReportModal}
                  >
                    ×
                  </button>
                  <h4 className="modal-title modal-title-sapce">
                    Generate Report - {payout_merchant.businessName}
                  </h4>
                </div>
                <div className="modal-body clearfix ">
                  <div className=" clearfix">
                    <div className="col-xs-12">
                      <div className="row">
                        <div className="col-xs-3 m-t-5">Select Date</div>
                        <div className="col-xs-6 select_fund">
                          <DatePicker
                            selected={selectDate}
                            onChange={(date) => setSelectDate(date)}
                            maxDate={getYesterdayDate()}
                            className="fileter_form_input"
                          />
                        </div>
                      </div>
                      <div className="text-center m-t-10">
                        <span
                          className="submitBtn"
                          onClick={generateConsolidateReport}
                        >
                          Submit
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default React.memo(Merchant);
