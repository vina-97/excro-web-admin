import { useEffect, useState, useCallback, useMemo } from "react";
import ApiGateway from "../../../DataServices/DataServices";
import { AsyncPaginate } from "react-select-async-paginate";
import { uniqByValue } from "../../../DataServices/Utils";
import { useToasts } from "react-toast-notifications";
import { Info } from "lucide-react";
import Select from "react-select";
import DatePicker from "react-datepicker";
// Constants
const STATUS = {
  ENABLE: "enable",
  DISABLE: "disable",
};
const STATUS_BOOL = {
  [STATUS.ENABLE]: true,
  [STATUS.DISABLE]: false,
};

const SPLIT_MODES = {
  MANUAL: "manual",
  WITH_PRIMARY: "withPrimary",
  WITHOUT_PRIMARY: "withoutPrimary",
};

const ACCOUNT_TYPES = {
  MASTER: "master",
  MERCHANT: "merchant",
};

const SPLIT_TYPES = {
  PERCENTAGE: "percentage",
  VALUE: "value",
};

// Custom hooks
const useSplitConfiguration = () => {
  const [allMerchants, setAllMerchants] = useState([]);
  const [allBeneficiaries, setAllBeneficiaries] = useState([]);

  const [removedSubAccounts, setRemovedSubAccounts] = useState([]);
  const [removedBeneficiaryAccounts, setRemovedBeneficiaryAccounts] = useState(
    []
  );
  const [splitConfig, setSplitConfig] = useState(SPLIT_TYPES.PERCENTAGE);

  const [masterRecord, setMasterRecord] = useState({
    account_id: "",
    acc_type: ACCOUNT_TYPES.MASTER,
    split_type: splitConfig,
    value: "100",
    error: "",
    is_residual: true,
  });
  const [accounts, setAccounts] = useState([]);
  const [beneficiaryAccounts, setBeneficiaryAccounts] = useState([]);

  const [profileData, setProfileData] = useState({});
  const [masterData, setMasterData] = useState({});
  const [masterValue, setMasterValue] = useState({});
  const [statusConfig, setStatusConfig] = useState(STATUS.DISABLE);
  const [splitMode, setSplitMode] = useState(SPLIT_MODES.MANUAL);
  const [settings, setSettings] = useState(undefined);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);
  const [accumulated, setAccumulated] = useState(false);
  const [timelySplit, setTimelySplit] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSettlementDate, setSelectedSettlementDate] = useState("");

  const [timelySplitIsEnabled, setTimelySplitIsEnabled] = useState(
    STATUS.DISABLE
  );
  const { addToast } = useToasts();

  const applyToast = useCallback(
    (msg, type) => {
      return addToast(msg, { appearance: type });
    },
    [addToast]
  );

  const fetchData = useCallback((getProps) => {
    Promise.all([
      new Promise((resolve) => {
        ApiGateway.get(
          `/payout/admin/merchant/detail?merchant_id=${getProps?.match?.params?.merchant_id}`,
          (res) => resolve(res)
        );
      }),
      new Promise((resolve) => {
        ApiGateway.get(
          `/payout/admin/account/master/detail?merchant_id=${getProps?.match?.params?.merchant_id}`,
          (res) => resolve(res)
        );
      }),
      new Promise((resolve) => {
        ApiGateway.get(
          `/payout/admin/account/splitted/accounts?merchant_id=${getProps?.match?.params?.merchant_id}`,
          (res) => resolve(res)
        );
      }),

      new Promise((resolve) => {
        ApiGateway.get(
          `/payout/admin/beneficiary/bank/list?merchant_id=${getProps?.match?.params?.merchant_id}`,
          (res) => resolve(res)
        );
      }),
      new Promise((resolve) => {
        ApiGateway.get(
          `/payout/admin/account/list?merchant_id=${getProps?.match?.params?.merchant_id}&search_term=merchant`,
          (res) => resolve(res)
        );
      }),
    ])
      .then(
        ([profileRes, detailRes, splittedRes, beneficiaryListRes, listRes]) => {
          console.log(
            profileRes,
            "profileRes",
            detailRes,
            splittedRes,
            "splittedRes",

            beneficiaryListRes,
            "beneficiaryListRes",
            listRes,
            "listResweeeefrfkvhiufrhvi"
          );

          if (profileRes.success) {
            setStatusConfig(
              profileRes.data.merchant?.is_split_enabled
                ? STATUS.ENABLE
                : STATUS.DISABLE
            );
            setProfileData(profileRes.data);
            console.log(
              profileRes,
              profileRes?.data?.merchant?.delay_split?.interval,
              "profileRes",
              profileRes?.data?.merchant?.delay_split?.start_date
            );
            setSelectedDate(
              profileRes?.data?.merchant?.delay_split?.start_date
                ? new Date(profileRes?.data?.merchant?.delay_split?.start_date)
                : new Date()
            );

            setSelectedSettlementDate(
              profileRes?.data?.merchant?.delay_split?.next_settlement
                ? new Date(
                    profileRes?.data?.merchant?.delay_split?.next_settlement
                  )
                    .toISOString()
                    .split("T")[0]
                : new Date().toISOString().split("T")[0]
            );
            setAccumulated(
              profileRes?.data?.merchant?.delay_split?.settle_accumulated_credit
            );

            setTimelySplitIsEnabled(
              profileRes.data.merchant?.delay_split?.is_enabled
                ? STATUS.ENABLE
                : STATUS.DISABLE
            );
            setTimelySplit(profileRes?.data?.merchant?.delay_split?.interval);
          } else {
            // applyToast(splittedRes.message, "error");
          }

          let masterBase = {};
          if (detailRes.success) {
            const data = detailRes.data?.account || {};
            console.log(data, "detailRes");
            setMasterData(data);
            setMasterValue({
              ...data?.split,
              is_residual: data?.split?.is_residual ?? true,
            });
            setSplitConfig(data?.split?.split_type || "");
            masterBase = {
              account_id: data.account_id || "",
              acc_type: ACCOUNT_TYPES.MASTER,
              split_type: splitConfig,
              label: data.businessName || "Primary",
              error: "",
              // value: "100",
              value: data?.split?.value || "100",
              is_residual: true,
            };
          } else {
            // applyToast(detailRes.message, "error");
          }
          setMasterRecord(masterBase);
          console.log(masterBase, "masterBase");
          let all = [];
          if (listRes?.success) {
            all = listRes.data.accounts?.map(createOption) || [];
            setAllMerchants(all);
          } else {
            // applyToast(listRes.message, "error");
          }
          let beneficiaryAll = [];
          if (beneficiaryListRes?.success) {
            beneficiaryAll =
              beneficiaryListRes.data.beneficiariesList.map(
                createBeneficiaryOption
              ) || [];
            setAllBeneficiaries(beneficiaryAll);
          } else {
            // applyToast(beneficiaryListRes.message, "error");
          }
          if (splittedRes.success && splittedRes.data) {
            setSettings(splittedRes?.data?.settings);
            if (splittedRes.data?.accounts?.length > 0) {
              const accountsFromAPI =
                splittedRes.data.accounts.map(transformAccountData);
              console.log(accountsFromAPI, "called");

              const merchants = accountsFromAPI.filter(
                (a) => a.acc_type === ACCOUNT_TYPES.MERCHANT
              );
              console.log(merchants);

              const master = accountsFromAPI.find(
                (a) => a.acc_type === ACCOUNT_TYPES.MASTER
              );
              setAccounts(
                merchants.length > 0
                  ? merchants.map((m) => ({
                      ...m,
                      arrayList: all,
                    }))
                  : [
                      // {
                      //   account_id: "",
                      //   acc_type: ACCOUNT_TYPES.MERCHANT,
                      //   split_type: splitConfig,
                      //   value: "",
                      //   label: "",
                      //   error: "",
                      //   arrayList: all,
                      //   accountNumber: "",
                      // },
                    ]
              );
              console.log(shouldShowAddAccount(all, merchants), "vinay");

              setShowAddAccount(shouldShowAddAccount(all, merchants));
            }
            // else {
            //   const merchants = [
            //     {
            //       account_id: "",
            //       acc_type: ACCOUNT_TYPES.MERCHANT,
            //       split_type: splitConfig,
            //       value: "",
            //       label: "",
            //       error: "",
            //       arrayList: all,
            //       accountNumber: "",
            //     },
            //   ];
            //   setAccounts(merchants);
            //   setShowAddAccount(false);
            // }
            if (splittedRes.data?.beneficiaries?.length > 0) {
              const beneficiaryFromAPI = splittedRes.data?.beneficiaries.map(
                transformBeneficiaryData
              );
              setBeneficiaryAccounts(
                beneficiaryFromAPI.length > 0
                  ? beneficiaryFromAPI.map((b) => ({
                      ...b,
                      arrayList: beneficiaryAll,
                    }))
                  : [
                      // {
                      //   beneficiary_id: "",
                      //   acc_type: "beneficiary",
                      //   split_type: splitConfig,
                      //   value: "",
                      //   label: "",
                      //   error: "",
                      //   arrayList: beneficiaryAll,
                      //   beneficiaryNumber: "",
                      // },
                    ]
              );
              setShowAddBeneficiary(
                shouldShowAddBeneficiary(beneficiaryAll, beneficiaryFromAPI)
              );
            }
            // else {
            //   const beneficiaries = [
            //     {
            //       beneficiary_id: "",
            //       acc_type: "beneficiary",
            //       split_type: splitConfig,
            //       value: "",
            //       label: "",
            //       error: "",
            //       arrayList: beneficiaryAll,
            //       beneficiaryNumber: "",
            //     },
            //   ];
            //   setBeneficiaryAccounts(beneficiaries);
            // }
          } else {
            // applyToast(splittedRes.message, "error");
          }
        }
      )
      .catch((error) => {
        console.error("Error fetching data:", error);
        // applyToast(error.message, "error");
      });
  }, []);

  console.log(
    selectedDate,
    masterData,
    "masterData",
    profileData,
    "profileDatasssss",
    allBeneficiaries,
    "allBeneficiaries",
    "beneficiaryAccounts",
    beneficiaryAccounts,
    "Accounts",
    accounts,
    allMerchants,
    "allMer",
    masterValue,
    "masterValue",
    selectedSettlementDate,
    "selectedSettlementDate"
  );

  const shouldShowAddAccount = (allMerchants, accountsMerchant) => {
    console.log(accountsMerchant);
    if (accountsMerchant?.length > 0) {
      const accountIds = accountsMerchant.map((a) => a.account_id);
      const missing = allMerchants.filter(
        (m) => !accountIds?.includes(m.value) // m.value comes from createOption()
      );
      return accountIds && missing.length > 0;
    }
    return false;
  };

  const shouldShowAddBeneficiary = (
    allBeneficiaries,
    beneficiaryGetAccounts
  ) => {
    if (beneficiaryGetAccounts?.length > 0) {
      const beneficiaryIds = beneficiaryGetAccounts.map(
        (a) => a.beneficiary_id
      );
      const missing = allBeneficiaries.filter(
        (m) => !beneficiaryIds.includes(m.value) // m.value comes from createBeneficiaryOption()
      );
      return missing.length > 0;
    }
    return false;
  };

  return {
    allMerchants,
    accounts,
    profileData,
    statusConfig,
    splitConfig,
    setSplitConfig,
    splitMode,
    setAccounts,
    masterRecord,
    setMasterRecord,
    setStatusConfig,
    setSplitMode,
    masterData,
    masterValue,
    showAddAccount,
    setRemovedSubAccounts,
    removedSubAccounts,
    setShowAddAccount,
    fetchData,
    beneficiaryAccounts,
    applyToast,
    allBeneficiaries,
    setRemovedBeneficiaryAccounts,
    removedBeneficiaryAccounts,
    showAddBeneficiary,
    setShowAddBeneficiary,
    setBeneficiaryAccounts,
    settings,
    setTimelySplit,
    timelySplit,
    timelySplitIsEnabled,
    setTimelySplitIsEnabled,
    setMasterValue,
    selectedDate, // ✅ Add this
    setSelectedDate,
    selectedSettlementDate,
    setSelectedSettlementDate,
    accumulated,
    setAccumulated,
  };
};

// Utility functions
const transformAccountData = (item) => ({
  account_id: item.account_id || "",
  split_type: item.split?.split_type || "percentage",
  value: item.split?.value ?? "",
  label: item.name || item.account_id || null,

  // arrayList: [
  //   {
  //     value: item?.account_id ?? "",
  //     label: item.name || item.account_id || null,
  //     number: item.virtual_account_number,
  //   },
  // ],
  acc_type: item.acc_type || ACCOUNT_TYPES.MERCHANT,
  error: "",
  accountNumber: item?.virtual_account_number,
  is_residual: item?.split?.is_residual || false,
});

const transformBeneficiaryData = (item) => ({
  beneficiary_id: item.beneficiary_id || "",
  split_type: item.split?.split_type || "percentage",
  value: item.split?.value ?? "",
  label: item.name?.full || item.beneficiary_id || null,
  // arrayList: [
  //   {
  //     value: item?.beneficiary_id ?? "",
  //     label: item.name?.full || item.beneficiary_id || null,
  //     number: item.account?.number,
  //   },
  // ],
  acc_type: "beneficiary",
  error: "",
  beneficiaryNumber: item?.account?.number,
  is_residual: item?.split?.is_residual || false,
});

const createOption = (acc) => ({
  value: acc.account_id,
  label: acc.name || acc.account_id,
  number: acc?.virtual_account_number,
});

const createEmptyMerchantAccount = (arrayList) => ({
  account_id: "",
  split_type: "percentage",
  value: "",
  arrayList,
  acc_type: ACCOUNT_TYPES.MERCHANT,
  error: "",
  accountNumber: "",
  is_residual: false,
});

const createBeneficiaryOption = (acc) => ({
  value: acc.beneficiary_id,
  label: acc.name?.full,
  number: acc?.account?.number,
});

const createEmptyBeneficiaryAccount = (arrayList) => ({
  beneficiary_id: "",
  split_type: "percentage",
  acc_type: "beneficiary",
  value: "",
  arrayList,
  error: "",
  beneficiaryNumber: "",
  is_residual: false,
});

const SplitDetails = ({ getProps }) => {
  console.log(getProps,'getPropsinSplitDetails');

  const {
    allMerchants,
    accounts,
    profileData,
    masterData,
    masterValue,
    statusConfig,
    splitConfig,
    setSplitConfig,
    splitMode,
    setAccounts,
    setStatusConfig,
    setSplitMode,
    setMasterRecord,
    masterRecord,
    showAddAccount,
    setRemovedSubAccounts,
    setShowAddAccount,
    removedSubAccounts,
    fetchData,
    beneficiaryAccounts,
    applyToast,
    allBeneficiaries,
    setRemovedBeneficiaryAccounts,
    showAddBeneficiary,
    removedBeneficiaryAccounts,
    setShowAddBeneficiary,
    setBeneficiaryAccounts,
    settings,
    setTimelySplit,
    timelySplit,
    timelySplitIsEnabled,
    setTimelySplitIsEnabled,
    setMasterValue,
    selectedDate,
    setSelectedDate,
    selectedSettlementDate,
    setSelectedSettlementDate,
    accumulated,
    setAccumulated,
  } = useSplitConfiguration();
  console.log(masterRecord, "masterRecord");

  useEffect(() => {
    fetchData(getProps);
  }, [fetchData, getProps]);

  const merchantAccounts = useMemo(
    () => accounts?.filter((acc) => acc.acc_type === ACCOUNT_TYPES.MERCHANT),
    [accounts]
  );

  const hasValidationErrors = useMemo(() => {
    const anyMissingAccountId = merchantAccounts.some((acc) => !acc.account_id);
    const anyMissingAccountValue = merchantAccounts.some((acc) => !acc.value);
    const anyMissingBeneficiaryId = beneficiaryAccounts.some(
      (acc) => !acc.beneficiary_id
    );
    const anyMissingBeneficiaryValue = beneficiaryAccounts.some(
      (acc) => !acc.value
    );
    console.log(
      anyMissingAccountId,
      anyMissingAccountValue,
      anyMissingBeneficiaryId,
      anyMissingBeneficiaryValue
    );

    if (
      (splitConfig === "percentage" && anyMissingAccountId) ||
      (splitConfig === "percentage" && anyMissingAccountValue) ||
      (splitConfig === "percentage" &&
        splitMode === SPLIT_MODES.MANUAL &&
        anyMissingBeneficiaryId) ||
      (splitConfig === "percentage" &&
        splitMode === SPLIT_MODES.MANUAL &&
        anyMissingBeneficiaryValue)
    )
      return true;

    if (
      splitConfig === "value" &&
      (anyMissingAccountId ||
        anyMissingAccountValue ||
        anyMissingBeneficiaryId ||
        anyMissingBeneficiaryValue)
    ) {
      return true;
    }

    const merchantSum = merchantAccounts.reduce(
      (sum, acc) => sum + (parseFloat(acc.value) || 0),
      0
    );
    const beneficiarySum = beneficiaryAccounts.reduce(
      (sum, acc) => sum + (parseFloat(acc.value) || 0),
      0
    );

    const masterValueNum = parseFloat(masterRecord?.value) || 0;

    const totalSum = Math.round(
      (splitMode !== SPLIT_MODES.MANUAL ? 0 : beneficiarySum) +
        merchantSum +
        masterValueNum
    );

    console.log(
      totalSum,
      merchantSum,
      beneficiarySum,
      masterValueNum,
      "nir",
      splitMode === SPLIT_MODES.MANUAL,
      splitMode,
      SPLIT_MODES
    );

    if (splitConfig === "percentage" && totalSum !== 100) {
      console.log("true");

      return true;
    }

    return false;
  }, [
    merchantAccounts,
    splitConfig,
    masterRecord,
    beneficiaryAccounts,
    splitMode,
  ]);

  const totalPercentage = useMemo(() => {
    if (splitMode === SPLIT_MODES.WITHOUT_PRIMARY) {
      console.log(
        merchantAccounts.reduce(
          (total, acc) => total + (parseFloat(acc.value) || 0),
          0
        ),
        "torlap"
      );

      return merchantAccounts.reduce(
        (total, acc) => total + (parseFloat(acc.value) || 0),
        0
      );
    }
    // const merchantVal = accounts?.reduce(
    //   (total, acc) => total + (parseFloat(acc.value) || 0),
    //   0
    // );
    const merchantSum = accounts
      .filter((acc) => acc.acc_type === ACCOUNT_TYPES.MERCHANT)
      .reduce((sum, acc) => sum + (parseFloat(acc.value) || 0), 0);
    const beneficiaryVal = beneficiaryAccounts?.reduce(
      (total, acc) => total + (parseFloat(acc.value) || 0),
      0
    );
    console.log(
      merchantSum +
        (splitMode !== SPLIT_MODES.MANUAL ? 0 : beneficiaryVal) +
        Number(masterRecord?.value),
      "ttutlap"
    );

    return (
      merchantSum +
      (splitMode !== SPLIT_MODES.MANUAL ? 0 : beneficiaryVal) +
      Number(masterRecord?.value)
    );
  }, [
    accounts,
    merchantAccounts,
    splitMode,
    beneficiaryAccounts,
    masterRecord,
  ]);

  const remainingPercentage = useMemo(() => {
    if (splitMode === SPLIT_MODES.WITHOUT_PRIMARY) {
      const rem = Math.max(0, 100 - totalPercentage);
      return Number(rem.toFixed(2));
    }
    if (splitMode === SPLIT_MODES.WITH_PRIMARY) {
      const mv = parseFloat(masterRecord?.value || "0") || 0;
      return Number(mv.toFixed(2));
    }
    const masterVal = parseFloat(masterRecord?.value || "0") || 0;
    return Number(masterVal.toFixed(2));
  }, [splitMode, totalPercentage, masterRecord]);

  console.log(remainingPercentage, masterRecord, "masterRecordout");
  // Event handlers
  const handleStatusChange = useCallback(
    (newStatus) => {
      setStatusConfig(newStatus);

      if (!profileData?.merchant?.merchantId) return;

      ApiGateway.patch(
        `/payout/admin/merchant/split/status/${profileData?.merchant?.merchantId}`,
        {},
        (response) => {
          if (response.success) {
            setSplitMode(SPLIT_MODES.MANUAL);
          } else {
            applyToast(response.message, "error");
          }
        }
      );
    },
    [profileData, setStatusConfig, setSplitMode, applyToast]
  );

  const handleSubmitTimelySplit = async () => {
    if (!timelySplit) {
      applyToast("Please select a frequency first", "error");
      return;
    }

    if (!selectedDate) {
      applyToast("Please select date and time", "error");
      return;
    }
    const payload = {
      delay_split: {
        is_enabled: true,
        interval: timelySplit,
        start_date: new Date(
          Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            0,
            0,
            0,
            0
          )
        ).toISOString(),
        // settle_accumulated_amount: accumulated === true,
        settle_accumulated_credit: accumulated === true,
      },
    };

    try {
      ApiGateway.patch(
        `/payout/admin/merchant/delay/split/${
          getProps?.match?.params?.merchant_id || ""
        }`,
        payload,
        (response) => {
          if (response.success) {
            applyToast(response.message, "success");
          } else {
            applyToast(response.message, "error");
          }
        }
      );
    } catch (error) {
      applyToast("Error saving data", "error");
    }
  };

  //   const handleDateChange = (date) => {
  //     setSelectedDate(date);

  //     // if (date) {
  //     //   // Convert to ISO string format: "2025-11-14T18:30:00.000Z"
  //     //   const isoString = date.toISOString();

  //     //   // Call handleSelect with the current timelySplit value and the ISO string
  //     //   handleSelect({ value: timelySplit }, isoString);
  //     // }
  //   };
  const handleDateChange = (date) => {
    if (date) {
      const normalizedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
        0
      );

      setSelectedDate(normalizedDate);

      // FIX: ensure next settlement is always a future date
      const next = getNextSettlementDate(
        new Date(normalizedDate.getTime() + 24 * 60 * 60 * 1000),
        timelySplit
      );

      setSelectedSettlementDate(next);
    } else {
      setSelectedDate(null);
      setSelectedSettlementDate("");
    }
  };

  const getFilteredDate = (date, timelySplit) => {
    console.log(date, "datecheck");
    if (!timelySplit) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let frequencyMin = new Date(today);

    switch (timelySplit) {
      case "daily":
        return checkDate >= yesterday;

      case "weekly":
        frequencyMin.setDate(today.getDate() - 7);
        break;

      case "fortnight":
        frequencyMin.setDate(today.getDate() - 14);
        break;

      case "monthly":
        frequencyMin.setMonth(today.getMonth() - 1);
        break;

      default:
        return false;
    }

    const allowedMinDate = checkDate >= yesterday ? yesterday : frequencyMin;

    return checkDate >= allowedMinDate;
  };

  const getNextSettlementDate = (selectedDate, timelySplit) => {
    if (!selectedDate || !timelySplit) return "";

    const date = new Date(selectedDate);

    switch (timelySplit) {
      case "daily":
        date.setDate(date.getDate() + 1);
        break;

      case "weekly":
        date.setDate(date.getDate() + 7);
        break;

      case "fortnight":
        date.setDate(date.getDate() + 14);
        break;

      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;

      default:
        return "";
    }

    // Format YYYY-MM-DD
    return date.toISOString().split("T")[0];
  };

  const handleDropdownChange = useCallback(
    (selected, index) => {
      setAccounts((prev) => {
        const merchants = prev.filter(
          (acc) => acc.acc_type === ACCOUNT_TYPES.MERCHANT
        );

        const nextMerchants = merchants.map((row, i) => {
          if (i === index) {
            const prevAccountId = row.account_id;

            if (prevAccountId && prevAccountId !== (selected?.value || "")) {
              setRemovedSubAccounts((prevRemoved) => [
                ...prevRemoved,
                { ...row, value: "0" },
              ]);
            }

            return {
              ...row,
              account_id: selected?.value || "",
              label: selected?.label || "",
              arrayList: row.arrayList,
              error: "",
              accountNumber: selected?.number,
            };
          }
          return row;
        });

        const selectedAccountId = selected?.value;
        if (selectedAccountId) {
          nextMerchants.forEach((row, i) => {
            if (i !== index) {
              row.arrayList = (row.arrayList || []).filter(
                (opt) => opt.value !== selectedAccountId
              );
            }
          });
        }

        const usedAccountIds = new Set(
          nextMerchants.map((acc) => acc.account_id).filter(Boolean)
        );

        const availableOptions = allMerchants.filter(
          (opt) => !usedAccountIds.has(opt.value)
        );

        // ✅ Update arrayList for empty rows with available options
        nextMerchants.forEach((row) => {
          if (!row.account_id) {
            // Empty rows get all available options
            row.arrayList = availableOptions;
          }
          // else {
          //   const selectedOption = allMerchants.find(
          //     (opt) => opt.value === row.account_id
          //   );
          //   if (selectedOption) {
          //     row.arrayList = [selectedOption];
          //   }
          // }
        });

        const hasEmptyRow = nextMerchants.some((acc) => !acc.account_id);
        const allAccountsUsed = usedAccountIds.size === allMerchants.length;

        setShowAddAccount(
          !hasEmptyRow && !allAccountsUsed && availableOptions.length > 0
        );
        console.log(nextMerchants);

        return nextMerchants;
      });
    },
    [allMerchants, setAccounts, setShowAddAccount, setRemovedSubAccounts]
  );

  const handleBeneficiaryDropdownChange = useCallback(
    (selected, index) => {
      setBeneficiaryAccounts((prev) => {
        const nextBeneficiary = prev.map((row, i) => {
          if (i === index) {
            const prevBeneficiaryId = row.beneficiary_id;

            // If account_id changed, push previous row with value = "0" to remainingAccounts
            if (
              prevBeneficiaryId &&
              prevBeneficiaryId !== (selected?.value || "")
            ) {
              setRemovedBeneficiaryAccounts((prevRemoved) => [
                ...prevRemoved,
                { ...row, value: "0" },
              ]);
            }

            // Apply the new selection
            return {
              ...row,
              beneficiary_id: selected?.value || "",
              label: selected?.label || "",
              arrayList: row.arrayList,
              error: "",
              beneficiaryNumber: selected?.number,
            };
          }
          return row;
        });

        // ✅ Remove the selected account_id from all other rows' arrayList
        const selectedBeneficiaryId = selected?.value;
        if (selectedBeneficiaryId) {
          nextBeneficiary.forEach((row, i) => {
            if (i !== index) {
              // Don't modify the currently selected row
              // Remove the selected account_id from this row's arrayList
              row.arrayList = (row.arrayList || []).filter(
                (opt) => opt.value !== selectedBeneficiaryId
              );
            }
          });
        }

        // ✅ Recalculate ALL used beneficiary IDs
        const usedBeneficiaryIds = new Set(
          nextBeneficiary.map((acc) => acc.beneficiary_id).filter(Boolean)
        );

        const availableOptions = allBeneficiaries.filter(
          (opt) => !usedBeneficiaryIds.has(opt.value)
        );

        // ✅ Update arrayList for ALL rows that don't have beneficiary_id
        nextBeneficiary.forEach((row) => {
          if (!row.beneficiary_id) {
            // Empty rows get all available options
            row.arrayList = availableOptions;
          }
          // else {
          //   const selectedOption = allBeneficiaries.find(
          //     (opt) => opt.value === row.beneficiary_id
          //   );
          //   if (selectedOption) {
          //     row.arrayList = [selectedOption];
          //   }
          // }
        });

        const hasEmptyRow = nextBeneficiary.some((acc) => !acc.beneficiary_id);
        const allBeneficiariesUsed =
          usedBeneficiaryIds.size === allBeneficiaries.length;

        setShowAddBeneficiary(
          !hasEmptyRow && !allBeneficiariesUsed && availableOptions.length > 0
        );
        console.log(nextBeneficiary);

        return nextBeneficiary;
      });
    },
    [
      allBeneficiaries,
      setShowAddBeneficiary,
      setRemovedBeneficiaryAccounts,
      setBeneficiaryAccounts,
    ]
  );

  console.log(accounts, "accounts");

  const handleMasterPercentageChange = useCallback(
    (value) => {
      // Allow only numbers with optional decimal point (max 2 decimal places)
      if (!/^\d*(\.\d{0,2})?$/.test(value) && value !== "") return;

      // Don't allow values with more than 2 decimal places
      if (value.includes(".")) {
        const decimalParts = value.split(".");
        if (decimalParts[1] && decimalParts[1].length > 2) {
          return; // Don't allow more than 2 decimal places
        }
      }

      setMasterValue((prev) => ({
        ...(prev || {}),
        value: value,
      }));
      setMasterRecord((prev) => ({
        ...(prev || {}),
        value: value,
      }));
    },
    [setMasterValue, setMasterRecord]
  );

  const handleCheckboxChange = useCallback(
    (e) => {
      const isChecked = e.target.checked;

      if (isChecked) {
        // If master is checked, uncheck all virtual and beneficiary accounts
        setAccounts((prevList) =>
          prevList.map((acc) => ({ ...acc, is_residual: false }))
        );

        setBeneficiaryAccounts((prevList) =>
          prevList.map((acc) => ({ ...acc, is_residual: false }))
        );
      }

      setMasterValue((prev) => ({
        ...(prev || {}),
        is_residual: isChecked,
      }));

      setMasterRecord((prev) => ({
        ...(prev || {}),
        is_residual: isChecked,
      }));
    },
    [setMasterValue, setMasterRecord, setAccounts, setBeneficiaryAccounts]
  );

  const handleVirtualCheckboxChange = useCallback(
    (index, isChecked) => {
      if (isChecked) {
        // Uncheck master
        setMasterValue((prev) => ({
          ...(prev || {}),
          is_residual: false,
        }));

        setMasterRecord((prev) => ({
          ...(prev || {}),
          is_residual: false,
        }));

        // Uncheck all beneficiary accounts
        setBeneficiaryAccounts((prevList) =>
          prevList.map((acc) => ({ ...acc, is_residual: false }))
        );
      }

      // Update virtual accounts - only the selected one is checked
      setAccounts((prevList) =>
        prevList.map((acc, i) =>
          i === index
            ? { ...acc, is_residual: isChecked }
            : { ...acc, is_residual: false }
        )
      );
    },
    [setAccounts, setBeneficiaryAccounts, setMasterValue, setMasterRecord]
  );

  const handleBeneficiaryCheckboxChange = useCallback(
    (index, isChecked) => {
      if (isChecked) {
        // Uncheck master
        setMasterValue((prev) => ({
          ...(prev || {}),
          is_residual: false,
        }));

        setMasterRecord((prev) => ({
          ...(prev || {}),
          is_residual: false,
        }));

        // Uncheck all virtual accounts
        setAccounts((prevList) =>
          prevList.map((acc) => ({ ...acc, is_residual: false }))
        );
      }

      // Update beneficiary accounts - only the selected one is checked
      setBeneficiaryAccounts((prevList) =>
        prevList.map((acc, i) =>
          i === index
            ? { ...acc, is_residual: isChecked }
            : { ...acc, is_residual: false }
        )
      );
    },
    [setBeneficiaryAccounts, setAccounts, setMasterValue, setMasterRecord]
  );

  const handleSecondaryPercentageChange = useCallback(
    (value, index) => {
      // Allow only numbers with optional decimal point (max 2 decimal places)
      if (!/^\d*(\.\d{0,2})?$/.test(value) && value !== "") return;

      // Don't allow values with more than 2 decimal places
      if (value.includes(".")) {
        const decimalParts = value.split(".");
        if (decimalParts[1] && decimalParts[1].length > 2) {
          return; // Don't allow more than 2 decimal places
        }
      }

      setAccounts((prev) => {
        const updated = [...prev];
        updated[index].value = value;

        const beneficiarySum = beneficiaryAccounts.reduce(
          (sum, acc) => sum + (parseFloat(acc.value) || 0),
          0
        );

        const merchantSum = updated
          .filter((acc) => acc.acc_type === ACCOUNT_TYPES.MERCHANT)
          .reduce((sum, acc) => sum + (parseFloat(acc.value) || 0), 0);

        const remainder = Math.max(0, 100 - (merchantSum + beneficiarySum));
        const remainderFixed = Number(remainder.toFixed(2));

        if (splitConfig === SPLIT_TYPES.PERCENTAGE) {
          setMasterRecord((prevMaster) => ({
            ...(prevMaster || {}),
            value: String(remainderFixed),
          }));
        }

        const masterIdx = updated.findIndex(
          (acc) => acc.acc_type === ACCOUNT_TYPES.MASTER
        );
        if (masterIdx !== -1) {
          updated[masterIdx].value = String(remainderFixed);
        }

        return updated;
      });
    },
    [setAccounts, splitConfig, beneficiaryAccounts, setMasterRecord]
  );

  const handleBeneficiaryPercentageChange = useCallback(
    (value, index) => {
      // Allow only numbers with optional decimal point (max 2 decimal places)
      if (!/^\d*(\.\d{0,2})?$/.test(value) && value !== "") return;

      // Don't allow values with more than 2 decimal places
      if (value.includes(".")) {
        const decimalParts = value.split(".");
        if (decimalParts[1] && decimalParts[1].length > 2) {
          return; // Don't allow more than 2 decimal places
        }
      }

      setBeneficiaryAccounts((prev) => {
        const updated = [...prev];
        updated[index].value = value;

        const beneficiarySum = updated.reduce(
          (sum, acc) => sum + (parseFloat(acc.value) || 0),
          0
        );
        const merchantSum = accounts
          .filter((acc) => acc.acc_type === ACCOUNT_TYPES.MERCHANT)
          .reduce((sum, acc) => sum + (parseFloat(acc.value) || 0), 0);

        const remainder = Math.max(0, 100 - (merchantSum + beneficiarySum));
        const remainderFixed = Number(remainder.toFixed(2));
        if (splitConfig === SPLIT_TYPES.PERCENTAGE) {
          setMasterRecord((prevMaster) => ({
            ...(prevMaster || {}),
            value: String(remainderFixed),
          }));
        }

        const masterIdx = updated.findIndex(
          (acc) => acc.acc_type === ACCOUNT_TYPES.MASTER
        );
        if (masterIdx !== -1) {
          updated[masterIdx].value = String(remainderFixed);
        }

        return updated;
      });
    },
    [setBeneficiaryAccounts, splitConfig, accounts, setMasterRecord]
  );

  const handleCheckboxAccumulatedChange = useCallback(
    (e) => {
      const isChecked = e.target.checked;
      //   console.log("Checkbox value Sakthiiiii:", isChecked);
      setAccumulated(e.target.checked);
    },
    [setAccumulated]
  );

  const applySplitWithPrimary = useCallback(() => {
    const merchantList = (allMerchants || []).map((opt) => ({
      account_id: opt.value,
      split_type: splitConfig,
      value: "",
      arrayList: [{ value: opt.value, label: opt.label, number: opt?.number }],
      acc_type: ACCOUNT_TYPES.MERCHANT,
      error: "",
      label: opt.label,
    }));

    const totalCount = merchantList.length + 1; // +1 for master
    if (totalCount <= 0) return;

    const to2 = (n) => Number(n.toFixed(2));

    // Equal raw split
    const equalRaw = 100 / totalCount;

    // Assign initial rounded values
    let sum = 0;
    for (let i = 0; i < merchantList.length; i++) {
      const val = to2(equalRaw);
      merchantList[i].value = val;
      sum += val;
    }

    // Compute master (remaining value)
    const masterValue = to2(100 - sum);

    // Fix any rounding drift on the last merchant if total != 100
    const total = to2(
      merchantList.reduce((acc, cur) => acc + Number(cur.value), 0) +
        masterValue
    );

    if (total !== 100) {
      const diff = to2(100 - total);
      // adjust master slightly to correct drift
      const adjustedMaster = to2(masterValue + diff);
      masterRecord.value = String(adjustedMaster);
    } else {
      masterRecord.value = String(masterValue);
    }

    // Convert merchant values to strings
    const updatedMerchants = merchantList.map((m) => ({
      ...m,
      value: String(m.value),
    }));
    const usedAfterRemove = new Set(
      updatedMerchants.map((acc) => acc.account_id).filter(Boolean)
    );
    const remainingOptions = allMerchants.filter(
      (opt) => !usedAfterRemove.has(opt.value)
    );
    setShowAddAccount(remainingOptions.length > 0);

    setAccounts(updatedMerchants);
    setMasterRecord({ ...masterRecord });
    setSplitMode(SPLIT_MODES.WITH_PRIMARY);
    const beneficiary =
      beneficiaryAccounts.length > 0
        ? beneficiaryAccounts.map((list) => ({
            ...list,
            value: 0,
          }))
        : [];
    setBeneficiaryAccounts(beneficiary);
  }, [
    allMerchants,
    masterRecord,
    setAccounts,
    setSplitMode,
    setMasterRecord,
    beneficiaryAccounts,
    setBeneficiaryAccounts,
    setShowAddAccount,
    splitConfig,
  ]);

  const applySplitWithoutPrimary = useCallback(() => {
    setAccounts((prev) => {
      const merchants = (allMerchants || []).map((opt) => ({
        account_id: opt.value,
        split_type: splitConfig,
        value: "",
        arrayList: [
          { value: opt.value, label: opt.label, number: opt?.number },
        ],
        acc_type: ACCOUNT_TYPES.MERCHANT,
        error: "",
        label: opt.label,
        accountNumber: opt.number,
      }));

      const n = merchants.length;
      if (n === 0) return [];

      // Equal split (raw)
      const raw = 100 / n;
      const to2 = (x) => Number(x.toFixed(2));

      // Assign rounded values
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const val = to2(raw);
        merchants[i].value = val;
        sum += val;
      }

      // Correct rounding difference on last item
      const diff = to2(100 - sum);
      merchants[n - 1].value = to2(merchants[n - 1].value + diff);

      // Convert to strings (if required downstream)
      merchants.forEach((m) => (m.value = String(m.value)));

      // Ensure last adjustment doesn’t cause 100.01
      const finalSum = merchants.reduce(
        (acc, cur) => acc + Number(cur.value),
        0
      );
      if (finalSum !== 100) {
        const last = merchants[merchants.length - 1];
        last.value = String(to2(Number(last.value) + to2(100 - finalSum)));
      }

      const used = new Set();
      const basePool = allMerchants.slice();

      const next = merchants.map((row) => {
        used.add(row.account_id);
        return {
          ...row,
          arrayList: [
            {
              value: row.account_id,
              label: row.label || row.account_id,
              number: row.accountNumber,
            },
          ],
        };
      });

      const remaining = basePool.filter((opt) => !used.has(opt.value));
      if (remaining.length > 0) {
        next.push(createEmptyMerchantAccount(remaining));
      }

      setMasterRecord((prev) => ({
        ...prev,
        value: 0,
      }));

      const beneficiary =
        beneficiaryAccounts.length > 0
          ? beneficiaryAccounts.map((list) => ({
              ...list,
              value: 0,
            }))
          : [];
      setBeneficiaryAccounts(beneficiary);
      const usedAfterRemove = new Set(
        next.map((acc) => acc.account_id).filter(Boolean)
      );
      const remainingOptions = allMerchants.filter(
        (opt) => !usedAfterRemove.has(opt.value)
      );
      setShowAddAccount(remainingOptions.length > 0);
      return next;
    });

    setSplitMode(SPLIT_MODES.WITHOUT_PRIMARY);
  }, [
    allMerchants,
    setAccounts,
    setSplitMode,
    setMasterRecord,
    beneficiaryAccounts,
    setBeneficiaryAccounts,
    setShowAddAccount,
    splitConfig,
  ]);

  const handleSplitConfigChange = useCallback(
    (newConfig) => {
      if (
        newConfig === "percentage" &&
        splitMode === SPLIT_MODES.WITH_PRIMARY
      ) {
        applySplitWithPrimary();
        return;
      } else if (
        newConfig === "percentage" &&
        splitMode === SPLIT_MODES.WITHOUT_PRIMARY
      ) {
        applySplitWithoutPrimary();
        return;
      }
      const beneficiary =
        beneficiaryAccounts.length > 0
          ? beneficiaryAccounts.map((list) => ({
              ...list,
              split_type: newConfig,
            }))
          : [];
      setBeneficiaryAccounts(beneficiary);
      const totalMerchantValue = merchantAccounts.reduce(
        (sum, acc) => sum + Number(acc.value || 0),
        0
      );
      const totalBeneficiaryValue = beneficiaryAccounts.reduce(
        (sum, acc) => sum + Number(acc.value || 0),
        0
      );
      const masterVal = Math.max(
        0,
        Math.round((100 - (totalMerchantValue + totalBeneficiaryValue)) * 100) /
          100
      );

      const masterRow = {
        account_id: masterRecord?.account_id,
        split_type: splitConfig,
        value: String(masterVal),
        acc_type: ACCOUNT_TYPES.MASTER,
        error: "",
      };
      setMasterRecord(masterRow);
      setSplitConfig(newConfig);
    },
    [
      setSplitConfig,
      applySplitWithoutPrimary,
      masterRecord,
      setMasterRecord,
      splitConfig,
      applySplitWithPrimary,
      beneficiaryAccounts,
      setBeneficiaryAccounts,
      merchantAccounts,
      splitMode,
    ]
  );

  const handleSplitModeChange = useCallback(
    (value) => {
      console.log(value, "splimodechange");
      if (value === SPLIT_MODES.WITH_PRIMARY) {
        applySplitWithPrimary();
      } else if (value === SPLIT_MODES.WITHOUT_PRIMARY) {
        applySplitWithoutPrimary();
      } else if (value === SPLIT_MODES.MANUAL) {
        fetchData(getProps);
      }
      setSplitMode(value);
    },
    [
      applySplitWithPrimary,
      getProps,
      setSplitMode,
      fetchData,
      applySplitWithoutPrimary,
    ]
  );

  // ✅ Submit – always send master row with account_id fallback

  const handleSubmit = useCallback(() => {
    if (
      splitConfig === "percentage" &&
      merchantAccounts.some((acc) => acc.error || !acc.account_id)
    ) {
      applyToast(
        "Please fix all validation errors before submitting.",
        "error"
      );
      return;
    }

    const merchants = accounts.filter(
      (acc) => acc.acc_type === ACCOUNT_TYPES.MERCHANT
    );

    const totalMerchantValue = merchants.reduce(
      (sum, acc) => sum + Number(acc.value || 0),
      0
    );
    const totalBeneficiaryValue = beneficiaryAccounts.reduce(
      (sum, acc) => sum + Number(acc.value || 0),
      0
    );
    const masterValue =
      merchants.length > 0
        ? Math.round(
            100 -
              (totalMerchantValue +
                (splitMode !== SPLIT_MODES.MANUAL ? 0 : totalBeneficiaryValue))
          )
        : masterRecord?.value;

    console.log(
      masterValue,
      totalBeneficiaryValue,
      totalMerchantValue,
      beneficiaryAccounts,
      "vddfe"
    );

    const payloadAccounts = [
      ...merchants.map((acc) => ({
        account_id: acc.account_id,
        split_type: splitConfig,
        value: String(acc.value),
        is_enabled: true,
        is_residual: acc.is_residual,
      })),
      {
        account_id: masterRecord.account_id,
        split_type: splitConfig,
        value: String(masterRecord.value),
        is_enabled: true,
        is_residual: masterRecord.is_residual,
      },
      ...removedSubAccounts.map((acc) => ({
        account_id: acc.account_id,
        split_type: splitConfig,
        value: "0",
        is_enabled: false,
      })),
    ];

    const payloadBeneficiaryAccounts = [
      ...beneficiaryAccounts.map((acc) => ({
        beneficiary_id: acc.beneficiary_id,
        split_type: splitConfig,
        value: String(acc.value),
        is_enabled: true,
        is_residual: acc.is_residual,
      })),
      ...removedBeneficiaryAccounts.map((acc) => ({
        beneficiary_id: acc.beneficiary_id,
        split_type: splitConfig,
        value: "0",
        is_enabled: false,
        is_residual: acc.is_residual,
      })),
    ];

    // ✅ Remove duplicates by keeping the FIRST occurrence (remove later ones)
    const seen = new Set();
    const uniqueAccounts = [];
    for (const acc of payloadAccounts) {
      if (!seen.has(acc.account_id)) {
        seen.add(acc.account_id);
        uniqueAccounts.push(acc);
      }
    }

    const beneficiarySeen = new Set();
    const uniqueBeneficiary = [];
    for (const acc of payloadBeneficiaryAccounts) {
      if (!beneficiarySeen.has(acc.beneficiary_id)) {
        beneficiarySeen.add(acc.beneficiary_id);
        uniqueBeneficiary.push(acc);
      }
    }
    console.log(payloadAccounts, uniqueAccounts);

    const payload = {
      accounts: uniqueAccounts || [],
    };
    payload.beneficiaries = uniqueBeneficiary || [];
    console.log(payload, "payload");
    // return;
    ApiGateway.post(
      `/payout/admin/account/split/account/${getProps?.match?.params?.merchant_id}`,
      payload,
      (response) => {
        if (response.success) {
          applyToast(response.message, "success");
        } else {
          applyToast(response.message, "error");
        }
      }
    );
  }, [
    accounts,
    getProps,
    merchantAccounts,
    masterRecord,
    applyToast,
    removedSubAccounts,
    beneficiaryAccounts,
    removedBeneficiaryAccounts,
    splitConfig,
    splitMode,
  ]);

  const removeAccount = useCallback(
    (index) => {
      // console.log(accounts, "accountsremove");
      setAccounts((prev) => {
        const merchants = prev.filter(
          (acc) => acc.acc_type === ACCOUNT_TYPES.MERCHANT
        );
        console.log(merchants, "merchants");

        const removedRow = merchants[index];
        console.log(removedRow);

        if (removedRow && removedRow.account_id) {
          setRemovedSubAccounts((prevRemoved) => {
            const alreadyRemoved = prevRemoved.some(
              (acc) => acc.account_id === removedRow.account_id
            );
            if (!alreadyRemoved) {
              return [...prevRemoved, removedRow];
            }
            return prevRemoved;
          });
        }

        let nextMerchants = merchants.filter((_, i) => i !== index);

        const removedAccountId = removedRow?.account_id;
        if (removedAccountId) {
          const removedOption = allMerchants.find(
            (opt) => opt.value === removedAccountId
          );
          if (removedOption) {
            console.log(removedOption);

            nextMerchants.forEach((row) => {
              if (!row.account_id) {
                const alreadyExists = row.arrayList?.some(
                  (opt) => opt.value === removedAccountId
                );
                if (!alreadyExists) {
                  row.arrayList = [...(row.arrayList || []), removedOption];
                }
              }
            });
          }
        }

        if (removedRow?.arrayList?.length > 0 && nextMerchants.length > 0) {
          nextMerchants.forEach((row) => {
            const currentOptions = row.account_id
              ? [
                  {
                    value: row.account_id,
                    label: row.label || row.account_id,
                    number: row.accountNumber,
                  },
                ]
              : row.arrayList || [];

            const mergedOptions = [
              ...currentOptions,
              ...removedRow.arrayList.filter(
                (opt) => !currentOptions.some((o) => o.value === opt.value)
              ),
            ];

            mergedOptions.sort((a, b) => a.label.localeCompare(b.label));

            row.arrayList = mergedOptions;
          });
        }

        if (
          splitConfig === SPLIT_TYPES.PERCENTAGE &&
          splitMode === SPLIT_MODES.WITHOUT_PRIMARY
        ) {
          const count = nextMerchants?.length;

          if (count > 0) {
            const baseValue = Number((100 / count).toFixed(2));
            let sum = 0;

            // Assign base value for all except last
            nextMerchants = nextMerchants.map((row, index) => {
              if (index < count - 1) {
                sum += baseValue;
                return { ...row, value: baseValue };
              }

              // Last merchant gets remaining value (fix rounding)
              const lastValue = Number((100 - sum).toFixed(2));
              return { ...row, value: lastValue };
            });
          }
        }

        const totalMerchantValue = nextMerchants.reduce(
          (sum, acc) => sum + Number(acc.value || 0),
          0
        );
        const totalBeneficiaryValue = beneficiaryAccounts.reduce(
          (sum, acc) => sum + Number(acc.value || 0),
          0
        );
        const masterVal = Math.max(
          0,
          Math.round(
            (100 - (totalMerchantValue + totalBeneficiaryValue)) * 100
          ) / 100
        );

        console.log(
          Math.round(masterVal),
          totalBeneficiaryValue,
          totalMerchantValue,
          "vddfe"
        );
        if (splitConfig === SPLIT_TYPES.PERCENTAGE) {
          console.log("inside", splitMode, masterVal);
          const masterRow = {
            account_id: masterRecord?.account_id,
            split_type: splitConfig,
            value: String(masterVal),
            acc_type: ACCOUNT_TYPES.MASTER,
            error: "",
          };
          setMasterRecord(masterRow);
          // setMasterRecord((prev) => ({
          //   ...(prev || {}),
          //   value: 0,
          // }));
        }

        const usedAfterRemove = new Set(
          nextMerchants.map((acc) => acc.account_id).filter(Boolean)
        );
        const remainingOptions = allMerchants.filter(
          (opt) => !usedAfterRemove.has(opt.value)
        );
        setShowAddAccount(remainingOptions.length > 0);

        return [...nextMerchants];
      });
    },
    [
      allMerchants,
      setAccounts,
      setRemovedSubAccounts,
      beneficiaryAccounts,
      masterRecord,
      setMasterRecord,
      setShowAddAccount,
      splitConfig,
      splitMode,
    ]
  );

  const onRemoveBeneficiaryAccount = useCallback(
    (index) => {
      setBeneficiaryAccounts((prev) => {
        const removedRow = prev[index];
        console.log(removedRow);

        // Add to removed accounts
        if (removedRow && removedRow.beneficiary_id) {
          setRemovedBeneficiaryAccounts((prevRemoved) => {
            const alreadyRemoved = prevRemoved.some(
              (acc) => acc.beneficiary_id === removedRow.beneficiary_id
            );
            if (!alreadyRemoved) {
              return [...prevRemoved, removedRow];
            }
            return prevRemoved;
          });
        }

        // Remove the row
        const nextBeneficiary = prev.filter((_, i) => i !== index);

        // ✅ When removing an account, add it back to other rows' arrayList
        const removedBeneficiaryId = removedRow?.beneficiary_id;
        if (removedBeneficiaryId) {
          const removedOption = allBeneficiaries.find(
            (opt) => opt.value === removedBeneficiaryId
          );
          if (removedOption) {
            nextBeneficiary.forEach((row) => {
              console.log(removedOption, row.arrayList);

              if (!row.beneficiary_id) {
                // Add the removed account back to available options
                const alreadyExists = row.arrayList?.some(
                  (opt) => opt.value === removedBeneficiaryId
                );
                if (!alreadyExists) {
                  row.arrayList = [...(row.arrayList || []), removedOption];
                }
              }
            });
          }
        }

        if (removedRow?.arrayList?.length > 0 && nextBeneficiary.length > 0) {
          console.log(removedRow, nextBeneficiary, "ins");

          nextBeneficiary.forEach((row) => {
            console.log(row);

            const currentOptions = row.beneficiary_id
              ? [
                  {
                    value: row.beneficiary_id,
                    label: row.label || row.beneficiary_id,
                    number: row.beneficiaryNumber,
                  },
                ]
              : row.arrayList || [];
            console.log(currentOptions, "fds");

            const mergedOptions = [
              ...currentOptions,
              ...removedRow.arrayList.filter(
                (opt) => !currentOptions.some((o) => o.value === opt.value)
              ),
            ];

            mergedOptions.sort((a, b) => a.label.localeCompare(b.label));
            console.log(mergedOptions);

            row.arrayList = mergedOptions;
          });
        }

        const totalBeneficiaryValue = nextBeneficiary.reduce(
          (sum, acc) => sum + Number(acc.value || 0),
          0
        );
        const totalMerchantValue = accounts.reduce(
          (sum, acc) => sum + Number(acc.value || 0),
          0
        );
        const masterVal = Math.max(
          0,
          Math.round(
            (100 - (totalMerchantValue + totalBeneficiaryValue)) * 100
          ) / 100
        );
        if (splitConfig === SPLIT_TYPES.PERCENTAGE) {
          const masterRow = {
            account_id: masterRecord?.account_id,
            split_type: splitConfig,
            value: String(masterVal),
            acc_type: ACCOUNT_TYPES.MASTER,
            error: "",
          };

          setMasterRecord(masterRow);
        }

        const usedAfterRemove = new Set(
          nextBeneficiary.map((acc) => acc.beneficiary_id).filter(Boolean)
        );
        const remainingOptions = allBeneficiaries.filter(
          (opt) => !usedAfterRemove.has(opt.value)
        );
        setShowAddBeneficiary(remainingOptions.length > 0);

        return [...nextBeneficiary];
      });
    },
    [
      allBeneficiaries,
      masterRecord,
      setBeneficiaryAccounts,
      setMasterRecord,
      setShowAddBeneficiary,
      setRemovedBeneficiaryAccounts,
      accounts,
      splitConfig,
    ]
  );

  const onAddAccount = useCallback(() => {
    setAccounts((prev) => {
      const merchants = prev.filter(
        (acc) => acc.acc_type === ACCOUNT_TYPES.MERCHANT
      );

      // Get all currently used account_ids
      const usedAccountIds = new Set(
        merchants.map((acc) => acc.account_id).filter(Boolean)
      );

      // Check if all merchants from allMerchants are already used
      const allAccountsUsed = allMerchants.every((merchant) =>
        usedAccountIds.has(merchant.value)
      );

      // Check if there's already an empty row
      const hasEmptyRow = merchants.some((acc) => !acc.account_id);

      // Don't add if all accounts are used or there's already an empty row
      if (allAccountsUsed || hasEmptyRow) {
        setShowAddAccount(false);
        return prev;
      }

      // Get available options
      const availableOptions = allMerchants.filter(
        (opt) => !usedAccountIds.has(opt.value)
      );

      const newAccount = createEmptyMerchantAccount(availableOptions);
      const nextAccounts = [...prev, newAccount];

      // Update showAddAccount based on new state
      const newUsedAccountIds = new Set(
        nextAccounts
          .filter((acc) => acc.acc_type === ACCOUNT_TYPES.MERCHANT)
          .map((acc) => acc.account_id)
          .filter(Boolean)
      );

      const newHasEmptyRow = nextAccounts.some(
        (acc) => acc.acc_type === ACCOUNT_TYPES.MERCHANT && !acc.account_id
      );

      const newAllAccountsUsed = allMerchants.every((merchant) =>
        newUsedAccountIds.has(merchant.value)
      );

      setShowAddAccount(!newHasEmptyRow && !newAllAccountsUsed);

      return nextAccounts;
    });
  }, [allMerchants, setAccounts, setShowAddAccount]);

  const onAddBeneficiaryAccount = useCallback(() => {
    setBeneficiaryAccounts((prev) => {
      const useBeneficiaryIds = new Set(
        prev.map((acc) => acc.beneficiary_id).filter(Boolean)
      );

      const allBeneficiaryUsed = allBeneficiaries.every((beneficiary) =>
        useBeneficiaryIds.has(beneficiary.value)
      );

      const hasEmptyRow = prev.some((acc) => !acc.beneficiary_id);

      if (allBeneficiaryUsed || hasEmptyRow) {
        setShowAddBeneficiary(false);
        return prev;
      }

      // Get available options
      const availableOptions = allBeneficiaries.filter(
        (opt) => !useBeneficiaryIds.has(opt.value)
      );

      const newBeneficiary = createEmptyBeneficiaryAccount(availableOptions);
      const nextBeneficiary = [...prev, newBeneficiary];

      const newUsedBeneficiaryIds = new Set(
        nextBeneficiary.map((acc) => acc.beneficiary_id).filter(Boolean)
      );

      const newHasEmptyRow = nextBeneficiary.some((acc) => !acc.beneficiary_id);

      const newAllBeneficiariesUsed = allBeneficiaries.every((beneficiary) =>
        newUsedBeneficiaryIds.has(beneficiary.value)
      );

      setShowAddBeneficiary(!newHasEmptyRow && !newAllBeneficiariesUsed);

      return nextBeneficiary;
    });
  }, [allBeneficiaries, setBeneficiaryAccounts, setShowAddBeneficiary]);

  if (statusConfig === STATUS.DISABLE) {
    return (
      <div className="card form-card">
        <div className="card-header">
          <h5 className="card-title">Configuration Settings</h5>
        </div>
        <div className="card-body">
          <StatusRadioSection
            statusConfig={statusConfig}
            onStatusChange={handleStatusChange}
          />
          <div className="alert alert-warning mt-3">
            <strong>Split configuration is disabled.</strong> Enable it to
            configure account splitting.
          </div>
        </div>
      </div>
    );
  }

  const handleSelect = async (selectedOption) => {
    if (selectedOption) {
      setTimelySplit(selectedOption?.value || "");
      // Don't reset date - keep the previously selected date visible
      // User can change it if needed, but it stays displayed
    }
  };

  const getFilteredDateIncludingToday = (date, timelySplit) => {
    if (!timelySplit) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    // Don't allow future dates
    if (checkDate > today) return false;

    switch (timelySplit) {
      case "daily":
        // Allow today only
        return checkDate.getTime() === today.getTime();

      case "weekly":
        // Allow dates from 7 days ago to today
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return checkDate >= weekAgo && checkDate <= today;

      case "fortnight":
        // Allow dates from 14 days ago to today
        const fortnightAgo = new Date(today);
        fortnightAgo.setDate(fortnightAgo.getDate() - 14);
        return checkDate >= fortnightAgo && checkDate <= today;

      case "monthly":
        // Allow dates from 1 month ago to today
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return checkDate >= lastMonth && checkDate <= today;

      default:
        return false;
    }
  };

  const handleSplitRadioChange = (newStatus) => {
    if (newStatus === "enable") {
      setTimelySplitIsEnabled(newStatus);
      return;
    } else {
      const payload = {
        delay_split: {
          is_enabled: STATUS_BOOL[newStatus],
          // is_enabled: true,
          interval: timelySplit,
        },
      };
      try {
        ApiGateway.patch(
          `/payout/admin/merchant/delay/split/${
            getProps?.match?.params?.merchant_id || ""
          }`,
          payload,
          (response) => {
            if (response.success) {
              setTimelySplitIsEnabled(newStatus);
              applyToast(response.message, "success");
            } else {
              applyToast(response.message, "error");
            }
          }
        );
      } catch (error) {
        applyToast("Error saving data:", error);
      }
    }
  };

  console.log(
    allMerchants,
    "allMerchants",
    splitMode,
    "splitMode",
    SPLIT_MODES
  );

  console.log(
    hasValidationErrors,
    "hasValidationErrors",
    merchantAccounts,
    masterRecord,
    totalPercentage,
    beneficiaryAccounts
  );

  // return !masterRecord?.value ? (
  //   <div className="row form-group">
  //     <div className="col-xs-12">
  //       <div className="alert alert-danger">
  //         <strong className="m-r-5">
  //           ⚠ Could not able to configure split settings at the moment!
  //         </strong>
  //       </div>
  //     </div>
  //   </div>
  // )
  return beneficiaryAccounts?.length === 0 && merchantAccounts?.length === 0 ? (
    <div className="row form-group">
      <div className="col-xs-12">
        <div className="alert alert-danger">
          <strong className="m-r-5">
            ⚠ Could not able to configure split settings at the moment!
          </strong>
        </div>
      </div>
    </div>
  ) : (
    <div className="card form-card">
      <div className="card-header">
        <h5 className="card-title">Configuration Settings</h5>
      </div>
      {console.log(timelySplit)}
      <div className="card-body">
        <StatusRadioSection
          statusConfig={statusConfig}
          onStatusChange={handleStatusChange}
          settings={settings}
        />
        {accounts.length > 0 && splitConfig === SPLIT_TYPES.PERCENTAGE && (
          <SplitModeSection
            splitMode={splitMode}
            onSplitModeChange={handleSplitModeChange}
          />
        )}

        {statusConfig === STATUS?.ENABLE && (
          <>
            <PercentageSummary
              profileData={profileData}
              masterData={masterData}
              totalPercentage={totalPercentage}
              remainingPercentage={remainingPercentage}
              splitMode={splitMode}
              splitConfig={splitConfig}
              onSplitStatusChange={handleSplitConfigChange}
              handleSelect={handleSelect}
              getFilteredDateIncludingToday={getFilteredDateIncludingToday}
              handleDateChange={handleDateChange}
              timelySplit={timelySplit}
              masterRecord={masterRecord}
              merchantAccounts={merchantAccounts}
              beneficiaryAccounts={beneficiaryAccounts}
              handleSplitRadioChange={handleSplitRadioChange}
              timelySplitIsEnabled={timelySplitIsEnabled}
              setTimelySplitIsEnabled={setTimelySplitIsEnabled}
              selectedDate={selectedDate}
              selectedSettlementDate={selectedSettlementDate}
              handleSubmitTimelySplit={handleSubmitTimelySplit}
              PercentageSummary={PercentageSummary}
              masterValue={masterValue}
              handleCheckboxChange={handleCheckboxChange}
              getFilteredDate={getFilteredDate}
              getNextSettlementDate={getNextSettlementDate}
              handleCheckboxAccumulatedChange={handleCheckboxAccumulatedChange}
              accumulated={accumulated}
            />

            <AccountConfiguration
              profileData={profileData}
              masterData={masterData}
              masterValue={masterValue}
              merchantAccounts={merchantAccounts}
              onDropdownChange={handleDropdownChange}
              onPercentageChange={handleSecondaryPercentageChange}
              onChangeMasterPercentage={handleMasterPercentageChange}
              handleCheckboxChange={handleCheckboxChange}
              handleVirtualCheckboxChange={handleVirtualCheckboxChange}
              handleBeneficiaryCheckboxChange={handleBeneficiaryCheckboxChange}
              handleDateChange={handleDateChange}
              splitConfig={splitConfig}
              onRemoveVirtualAccount={removeAccount}
              onRemoveBeneficiaryAccount={onRemoveBeneficiaryAccount}
              remainingPercentage={remainingPercentage}
              splitMode={splitMode}
              onAddVirtualAccount={onAddAccount}
              allMerchants={allMerchants}
              masterRecord={masterRecord}
              showAddAccount={showAddAccount}
              beneficiaryAccounts={beneficiaryAccounts}
              allBeneficiaries={allBeneficiaries}
              handleBeneficiaryDropdownChange={handleBeneficiaryDropdownChange}
              showAddBeneficiary={showAddBeneficiary}
              setBeneficiaryAccounts={setBeneficiaryAccounts}
              setShowAddBeneficiary={setShowAddBeneficiary}
              PercentageSummary={PercentageSummary}
              handleBeneficiaryPercentageChange={
                handleBeneficiaryPercentageChange
              }
              onAddBeneficiaryAccount={onAddBeneficiaryAccount}
              getFilteredDate={getFilteredDate}
              getNextSettlementDate={getNextSettlementDate}
              accumulated={accumulated}
              handleCheckboxAccumulatedChange={handleCheckboxAccumulatedChange}
            />

            <SubmitSection
              hasValidationErrors={hasValidationErrors}
              totalPercentage={totalPercentage}
              onSubmit={handleSubmit}
              splitConfig={splitConfig}
              masterRecord={masterRecord}
            />
          </>
        )}
      </div>
    </div>
  );
};

const StatusRadioSection = ({ statusConfig, onStatusChange, settings }) => {
  console.log(settings);

  const creditAmount = 100; // example base amount
  const commission = settings?.VAN?.value || 0; // e.g., 1% commission

  // Calculate rounded values
  const commissionValue = Math.round((creditAmount * commission) / 100);
  const afterCommission = creditAmount - commissionValue;

  return (
    <div className="radio-section">
      <div className="radio-title fw-bold mb-2">Status Configuration</div>

      {/* Left: Radio Group */}
      <div className="radio-group d-flex gap-3">
        {[STATUS.ENABLE, STATUS.DISABLE].map((status) => (
          <div key={status} className="form-check">
            <input
              className="form-check-input cursor-pointer"
              type="radio"
              name="statusConfig"
              id={status}
              value={status}
              checked={statusConfig === status}
              onChange={(e) => onStatusChange(e.target.value)}
            />
            <label className="form-check-label cursor-pointer" htmlFor={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </label>
          </div>
        ))}
      </div>

      {/* Right: Notification Section (only if ENABLED) */}
      {statusConfig === STATUS.ENABLE && (
        <div className="notification-box d-flex align-items-start p-3 rounded-2 bg-light border mt-3">
          <Info size={20} className="text-primary me-3 mt-3 flex-shrink-0" />
          <div className="notification-content flex-grow-1">
            <p className="mb-2 fw-semibold text-dark m-l-5">
              Split Calculation
            </p>
            <p className="mb-3 small text-muted lh-base">
              {`Split percentage is applied on the credit amount after commission deduction (e.g., ₹${creditAmount} - ₹${commission} (${commissionValue}₹ commission) = ₹${afterCommission}).`}
            </p>

            <div className="split-types">
              <p className="mb-2 small text-muted lh-base">
                <strong className="text-dark">Virtual Account Splits:</strong>{" "}
                No commission is deducted for virtual account-based splits.
              </p>
              <p className="mb-0 small text-muted lh-base">
                <strong className="text-dark">
                  Beneficiary Account Splits:
                </strong>{" "}
                Commission is deducted as per the merchant's debit transaction
                settings.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SplitRadioSection = ({
  profileData,
  splitConfig,
  onStatusChange,
  handleSelect,
  handleDateChange,
  timelySplit,
  beneficiaryAccounts,
  merchantAccounts,
  timelySplitIsEnabled,
  handleSplitRadioChange,
  selectedDate,
  handleSubmitTimelySplit,
  selectedSettlementDate,
  masterRecord,
  getFilteredDateIncludingToday,
  getFilteredDate,
  getNextSettlementDate,
  handleCheckboxAccumulatedChange,
  accumulated,
}) => {
  // Calculate rounded values
  console.log(splitConfig, "splitConfig", timelySplit, selectedSettlementDate);

  return (
    <div className="radio-section">
      <div className="radio-title fw-bold mb-2">Split Configuration</div>

      <div className="radio-group d-flex gap-3">
        {[SPLIT_TYPES.PERCENTAGE, SPLIT_TYPES.VALUE].map((status) => (
          <div key={status} className="form-check">
            <input
              className="form-check-input cursor-pointer"
              type="radio"
              name="splitConfig"
              id={status}
              value={status}
              checked={splitConfig === status}
              onChange={(e) => onStatusChange(e.target.value)}
            />
            <label className="form-check-label cursor-pointer" htmlFor={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </label>
          </div>
        ))}
      </div>

      <div className="timely-split-section mt-4">
        <div className="timely-split-title fw-bold mb-2">Timely Split</div>
        <div className="radio-group d-flex gap-3 mb-3">
          {[STATUS.ENABLE, STATUS.DISABLE].map((status) => {
            const inputId = `timelySplitIsEnabled-${status}`;
            const isRadioDisabled =
              merchantAccounts?.length === 0 &&
              beneficiaryAccounts?.length === 0;

            return (
              <div key={status} className="form-check">
                <input
                  className="form-check-input cursor-pointer"
                  type="radio"
                  name="timelySplitIsEnabled"
                  id={inputId}
                  value={status}
                  checked={timelySplitIsEnabled === status}
                  onChange={(e) => {
                    handleSplitRadioChange(e.target.value);
                  }}
                  disabled={isRadioDisabled}
                />
                <label className="form-check-label" htmlFor={inputId}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </label>
              </div>
            );
          })}
        </div>

        {/* Single row for Select, Date Picker, and Submit Button */}

        <div className="d-flex flex-wrap gap-3 align-items-end">
          {/* Frequency Select */}
          <div className="form-group mb-0" style={{ minWidth: "250px" }}>
            <label className="d-block mb-2">Select Frequency</label>
            <Select
              className="w-100"
              options={[
                { label: "Daily", value: "daily" },
                { label: "Weekly", value: "weekly" },
                { label: "Fortnight", value: "fortnight" },
                { label: "Monthly", value: "monthly" },
              ]}
              value={
                timelySplit
                  ? {
                      label:
                        timelySplit?.charAt(0)?.toUpperCase() +
                        timelySplit?.slice(1),
                      value: timelySplit,
                    }
                  : null
              }
              onChange={handleSelect}
              classNamePrefix="react-select"
              placeholder="Select frequency"
              isDisabled={
                timelySplitIsEnabled === STATUS.DISABLE ||
                (timelySplitIsEnabled === STATUS.ENABLE &&
                  !merchantAccounts.length &&
                  !beneficiaryAccounts.length)
              }
            />
          </div>

          <div className="form-group mb-0" style={{ maxWidth: "200px" }}>
            <label className="d-block mb-2" style={{ marginLeft: "10px" }}>
              Select Date and Time
            </label>

            <DatePicker
              className="form-control m-l-10 custom-datepicker"
              selected={selectedDate}
              onChange={handleDateChange}
              filterDate={(date) => getFilteredDate(date, timelySplit)}
              dateFormat="yyyy-MM-dd h:mm aa"
              disabled={
                !timelySplit ||
                timelySplitIsEnabled === STATUS.DISABLE ||
                (timelySplitIsEnabled === STATUS.ENABLE &&
                  !merchantAccounts.length &&
                  !beneficiaryAccounts.length)
              }
              placeholderText={
                timelySplit ? "Select date" : "Select frequency first"
              }
            />
          </div>

          {profileData?.merchant?.delay_split?.next_settlement && (
            <div className="form-group mb-0 m-l-10">
              <label className="d-block mb-3" style={{ marginLeft: "10px" }}>
                Next Settlement Date{" "}
              </label>

              <input
                type="text"
                className="form-control"
                value={
                  selectedSettlementDate
                    ? `${selectedSettlementDate} 12:00 AM`
                    : ""
                }
                readOnly
                style={{ marginLeft: "10px", height: "38px" }}
              />
            </div>
          )}

          {/* <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "20px",
                marginLeft: "30px",
              }}
            >
              <input
                type="checkbox"
                checked={accumulated || false}
                onChange={handleCheckboxAccumulatedChange}
              />
              <span className="m-t-10">
                Settle accumulated amount upto start time
              </span>
            </label>
            {selectedDate && (
              <p
                className="text-muted"
                style={{ marginLeft: "30px", fontSize: "0.9em" }}
              >
                (ex: Amount Accumulated from{" "}
                <strong>
                  {(() => {
                    const today = new Date();
                    const hours = String(today.getHours()).padStart(2, "0");
                    const minutes = String(today.getMinutes()).padStart(2, "0");
                    const ampm = today.getHours() >= 12 ? "PM" : "AM";
                    const displayHours = today.getHours() % 12 || 12;
                    return `${today.getFullYear()}-${String(
                      today.getMonth() + 1
                    ).padStart(2, "0")}-${String(today.getDate()).padStart(
                      2,
                      "0"
                    )} ${String(displayHours).padStart(
                      2,
                      "0"
                    )}:${minutes} ${ampm}`;
                  })()}
                </strong>{" "}
                to{" "}
                <strong>
                  {(() => {
                    const date = new Date(selectedDate);
                    const hours = String(date.getHours()).padStart(2, "0");
                    const minutes = String(date.getMinutes()).padStart(2, "0");
                    const ampm = date.getHours() >= 12 ? "PM" : "AM";
                    const displayHours = date.getHours() % 12 || 12;
                    return `${date.getFullYear()}-${String(
                      date.getMonth() + 1
                    ).padStart(2, "0")}-${String(date.getDate()).padStart(
                      2,
                      "0"
                    )} ${String(displayHours).padStart(
                      2,
                      "0"
                    )}:${minutes} ${ampm}`;
                  })()}
                </strong>{" "}
                will be Settled during{" "}
                <strong>
                  {(() => {
                    const date = new Date(selectedDate);
                    const hours = String(date.getHours()).padStart(2, "0");
                    const minutes = String(date.getMinutes()).padStart(2, "0");
                    const ampm = date.getHours() >= 12 ? "PM" : "AM";
                    const displayHours = date.getHours() % 12 || 12;
                    return `${date.getFullYear()}-${String(
                      date.getMonth() + 1
                    ).padStart(2, "0")}-${String(date.getDate()).padStart(
                      2,
                      "0"
                    )} ${String(displayHours).padStart(
                      2,
                      "0"
                    )}:${minutes} ${ampm}`;
                  })()}
                </strong>
                )
              </p>
            )}
          </div> */}

          {/* Submit Button */}
          {/* <div className="form-group mb-0">
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginLeft: "30px", marginTop: "25px" }}
              onClick={handleSubmitTimelySplit}
              disabled={
                timelySplitIsEnabled === STATUS.DISABLE ||
                (timelySplitIsEnabled === STATUS.ENABLE &&
                  !merchantAccounts.length &&
                  !beneficiaryAccounts.length) ||
                !timelySplit ||
                !selectedDate
              }
            >
              Submit
            </button>
          </div> */}
        </div>

        <div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              // marginTop: "20px",
              marginLeft: "10px",
            }}
          >
            <input
              type="checkbox"
              checked={accumulated || false}
              onChange={handleCheckboxAccumulatedChange}
            />
            <span className="m-t-10">
              Settle accumulated amount upto start time
            </span>
          </label>
          {selectedDate && (
            <p
              className="text-muted"
              style={{ marginLeft: "30px", fontSize: "0.9em" }}
            >
              (ex: Amount Accumulated from{" "}
              <strong>
                {(() => {
                  const today = new Date();
                  const hours = String(today.getHours()).padStart(2, "0");
                  const minutes = String(today.getMinutes()).padStart(2, "0");
                  const ampm = today.getHours() >= 12 ? "PM" : "AM";
                  const displayHours = today.getHours() % 12 || 12;
                  return `${today.getFullYear()}-${String(
                    today.getMonth() + 1
                  ).padStart(2, "0")}-${String(today.getDate()).padStart(
                    2,
                    "0"
                  )} ${String(displayHours).padStart(
                    2,
                    "0"
                  )}:${minutes} ${ampm}`;
                })()}
              </strong>{" "}
              to{" "}
              <strong>
                {/* {(() => {
                  const date = new Date(selectedSettlementDate);
                  const hours = String(date.getHours()).padStart(2, "0");
                  const minutes = String(date.getMinutes()).padStart(2, "0");
                  const ampm = date.getHours() >= 12 ? "PM" : "AM";
                  const displayHours = date.getHours() % 12 || 12;
                  return `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                  ).padStart(2, "0")}-${String(date.getDate()).padStart(
                    2,
                    "0"
                  )} ${String(displayHours).padStart(
                    2,
                    "0"
                  )}:${minutes} ${ampm}`;
                })()} */}
                {selectedSettlementDate + " 12:00 AM"}
              </strong>{" "}
              will be Settled during{" "}
              <strong>
                {/* {(() => {
                  const date = new Date(selectedDate);
                  const hours = String(date.getHours()).padStart(2, "0");
                  const minutes = String(date.getMinutes()).padStart(2, "0");
                  const ampm = date.getHours() >= 12 ? "PM" : "AM";
                  const displayHours = date.getHours() % 12 || 12;
                  return `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                  ).padStart(2, "0")}-${String(date.getDate()).padStart(
                    2,
                    "0"
                  )} ${String(displayHours).padStart(
                    2,
                    "0"
                  )}:${minutes} ${ampm}`;
                })()} */}
                {selectedSettlementDate + " 12:00 AM"}
              </strong>
              )
            </p>
          )}
        </div>
        <div className="form-group mb-0">
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginLeft: "10px", marginTop: "10px" }}
            onClick={handleSubmitTimelySplit}
            disabled={
              timelySplitIsEnabled === STATUS.DISABLE ||
              (timelySplitIsEnabled === STATUS.ENABLE &&
                !merchantAccounts.length &&
                !beneficiaryAccounts.length) ||
              !timelySplit ||
              !selectedDate
            }
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const SplitModeSection = ({ splitMode, onSplitModeChange }) => (
  <div className="radio-section m-t-20">
    <div className="align-start">
      <span className="radio-title">Split Details</span>
      <span className="text-muted m-l-5">
        <div className="align-center">
          [ <Info size={15} className="text-primary m-r-5" />
          <strong>
            Split equally mode only applicable for virtual accounts
          </strong>
          ]
        </div>
      </span>
    </div>

    <div className="form-check-group gap-4 align-items-center mt-2">
      {/* Split with Primary Account */}
      <div className="form-check">
        <input
          className="form-check-input cursor-pointer"
          type="checkbox"
          id="splitWithPrimary"
          checked={splitMode === SPLIT_MODES.WITH_PRIMARY}
          onChange={() => {
            onSplitModeChange(
              splitMode === SPLIT_MODES.WITH_PRIMARY
                ? SPLIT_MODES.MANUAL // uncheck → reset
                : SPLIT_MODES.WITH_PRIMARY // check → activate
            );
          }}
        />
        <label
          className="form-check-label cursor-pointer"
          htmlFor="splitWithPrimary"
        >
          Split with Primary Account
        </label>
      </div>

      {/* Split without Primary Account */}
      <div className="form-check">
        <input
          className="form-check-input cursor-pointer"
          type="checkbox"
          id="splitWithoutPrimary"
          checked={splitMode === SPLIT_MODES.WITHOUT_PRIMARY}
          onChange={() => {
            onSplitModeChange(
              splitMode === SPLIT_MODES.WITHOUT_PRIMARY
                ? SPLIT_MODES.MANUAL // uncheck → reset
                : SPLIT_MODES.WITHOUT_PRIMARY // check → activate
            );
          }}
          // onChange={() => {
          //   if (splitMode === SPLIT_MODES.WITHOUT_PRIMARY) {
          //     // Uncheck → return to default (manual)
          //     onSplitModeChange(SPLIT_MODES.MANUAL);
          //   } else {
          //     // Check this → set to WITHOUT_PRIMARY
          //     onSplitModeChange(SPLIT_MODES.WITHOUT_PRIMARY);
          //   }
          // }}
        />
        <label
          className="form-check-label cursor-pointer"
          htmlFor="splitWithoutPrimary"
        >
          Split without Primary Account
        </label>
      </div>
    </div>

    {splitMode === SPLIT_MODES.MANUAL && (
      <div className="text-muted mt-2">
        Default mode is active — no split applied.
      </div>
    )}
  </div>
);

const PercentageSummary = ({
  profileData,
  masterData,
  remainingPercentage,
  splitMode,
  splitConfig,
  onSplitStatusChange,
  handleSelect,
  handleDateChange,
  timelySplit,
  masterRecord,
  beneficiaryAccounts,
  merchantAccounts,
  setTimelySplitIsEnabled,
  timelySplitIsEnabled,
  handleSplitRadioChange,
  selectedDate,
  handleSubmitTimelySplit,
  selectedSettlementDate,
  handleCheckboxChange,
  masterValue,
  getFilteredDateIncludingToday,
  getFilteredDate,
  getNextSettlementDate,
  handleCheckboxAccumulatedChange,
  accumulated,
}) => (
  <>
    <div className="row p-15">
      {splitConfig === "percentage" && (
        <div className="alert alert-info">
          <strong>
            Primary Account: {masterData?.name} [
            {masterData?.virtual_account_number || "N/A"}] -{" "}
            {splitMode === "withoutPrimary" ? 0 : remainingPercentage}%
          </strong>
          <br />
          {splitMode === SPLIT_MODES.WITHOUT_PRIMARY && (
            <span>
              Remaining for sub-accounts:{" "}
              {splitMode === "withoutPrimary" ? 0 : remainingPercentage}%
            </span>
          )}
          <div>
            <label
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <input
                type="checkbox"
                checked={masterValue?.is_residual || false}
                onChange={handleCheckboxChange}
              />
              <span className="m-t-10">Select as Residual</span>
            </label>
          </div>
        </div>
      )}
    </div>
    <div className="m-t-10">
      {merchantAccounts?.length === 0 &&
      beneficiaryAccounts?.length === 0 &&
      !masterRecord?.value ? (
        <div className="row form-group">
          <div className="col-xs-12">
            <div className="alert alert-danger">
              <strong className="m-r-5">
                ⚠ Split configuration not selected. Select a configuration to
                proceed.!
              </strong>
            </div>
          </div>
        </div>
      ) : (
        <SplitRadioSection
          splitConfig={splitConfig}
          onStatusChange={onSplitStatusChange}
          handleSelect={handleSelect}
          timelySplit={timelySplit}
          masterRecord={masterRecord}
          beneficiaryAccounts={beneficiaryAccounts}
          merchantAccounts={merchantAccounts}
          timelySplitIsEnabled={timelySplitIsEnabled}
          setTimelySplitIsEnabled={setTimelySplitIsEnabled}
          handleSplitRadioChange={handleSplitRadioChange}
          handleDateChange={handleDateChange}
          selectedDate={selectedDate}
          handleSubmitTimelySplit={handleSubmitTimelySplit}
          selectedSettlementDate={selectedSettlementDate}
          profileData={profileData}
          getFilteredDateIncludingToday={getFilteredDateIncludingToday}
          getFilteredDate={getFilteredDate}
          getNextSettlementDate={getNextSettlementDate}
          handleCheckboxAccumulatedChange={handleCheckboxAccumulatedChange}
          accumulated={accumulated}
        />
      )}
    </div>
  </>
);

const AccountConfiguration = ({
  masterData,
  masterValue,
  merchantAccounts,
  beneficiaryAccounts,
  onDropdownChange,
  onPercentageChange,
  onRemoveVirtualAccount,
  onRemoveBeneficiaryAccount,
  onAddVirtualAccount,
  onAddBeneficiaryAccount,
  splitMode,
  allMerchants,
  allBeneficiaries,
  handleBeneficiaryDropdownChange,
  handleBeneficiaryPercentageChange,
  showAddBeneficiary,
  splitConfig,
  masterRecord,
  onChangeMasterPercentage,
  handleCheckboxChange,
  handleVirtualCheckboxChange,
  handleBeneficiaryCheckboxChange,
  handleDateChange,
  getFilteredDate,
  getNextSettlementDate,
  handleCheckboxAccumulatedChange,
}) => {
  const getMaxForRow = (type, currentIndex) => {
    // Calculate total of all other values except the current one
    let totalUsed = 0;

    // Sum all merchant accounts except the current one (if type is merchant)
    merchantAccounts.forEach((acc, index) => {
      if (type === "merchant" && index === currentIndex) {
        // Skip the current merchant row we're calculating for
        return;
      }
      totalUsed += parseFloat(acc.value) || 0;
    });

    // Sum all beneficiary accounts except the current one (if type is beneficiary)
    beneficiaryAccounts.forEach((acc, index) => {
      if (type === "beneficiary" && index === currentIndex) {
        // Skip the current beneficiary row we're calculating for
        return;
      }
      totalUsed += parseFloat(acc.value) || 0;
    });

    const maxAllowed = 100 - totalUsed;
    return Number(Math.max(0, maxAllowed).toFixed(2));
  };
  console.log(
    allBeneficiaries,
    splitMode === SPLIT_MODES.MANUAL,
    beneficiaryAccounts.length
  );
  console.log(
    merchantAccounts,
    beneficiaryAccounts,
    "merchantAccountsbeneficiaryAccounts"
  );
  return (
    <>
      {splitConfig === "value" && (
        <>
          <div className="row fw-bold mb-2 m-t-10">
            <div className="col-xs-5">
              <span className="bold-text filter_label col-xs-12 p-l-0">
                Primary Account
              </span>
            </div>
            <div className="col-xs-5">
              <label className="filter_label col-xs-12 p-l-0">
                Enter Value
              </label>
            </div>
            {splitMode === SPLIT_MODES.MANUAL && <div className="col-xs-2" />}
          </div>

          {/* FLEX ROW */}
          <div
            style={{
              display: "flex",
              //   alignItems: "center",
              gap: "20px",
              width: "100%",
            }}
          >
            {/* Primary account label */}
            <div style={{ flex: 1 }}>
              {masterData?.name} - {masterData?.virtual_account_number || "N/A"}
            </div>

            {/* Value input */}
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className="fileter_form_input"
                placeholder="Enter Value"
                value={masterValue?.value}
                maxLength={6}
                onChange={(e) => onChangeMasterPercentage(e.target.value)}
                style={{ marginLeft: "-7%", width: "93%" }}
              />
            </div>

            {/* Residual checkbox */}
            <label
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <input
                type="checkbox"
                checked={masterValue?.is_residual || false}
                onChange={handleCheckboxChange}
              />
              <span className="m-t-10">Select as Residual</span>
            </label>
          </div>
        </>
      )}

      <>
        {(allMerchants?.length > 0 || merchantAccounts?.length > 0) && (
          <>
            <div className="row fw-bold mb-2 m-t-10">
              <div className="col-xs-5">
                <label className="bold-text filter_label col-xs-12 p-l-0">
                  Virtual Accounts
                </label>
              </div>
              {merchantAccounts.length > 0 && (
                <div className="col-xs-5">
                  <label className="filter_label col-xs-12 p-l-0">
                    {splitConfig === "value"
                      ? "Enter Value"
                      : "Enter Percentage"}
                  </label>
                </div>
              )}
              {splitMode === SPLIT_MODES.MANUAL && <div className="col-xs-2" />}
            </div>

            {merchantAccounts.map((acc, index) => {
              const maxAllowed = getMaxForRow("merchant", index, acc.value);
              return (
                <div
                  key={`v-${index}`}
                  className="row m-b-10"
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  {/* Virtual Account Dropdown */}
                  <div style={{ flex: 1 }}>
                    <AsyncPaginate
                      key={`${index}-${acc.arrayList?.length || 0}`}
                      value={
                        acc.account_id
                          ? (acc.arrayList || []).find(
                              (opt) => opt.value === acc.account_id
                            ) || null
                          : null
                      }
                      options={uniqByValue(acc.arrayList || [])}
                      onChange={(selected) =>
                        onDropdownChange(selected, index, "virtual")
                      }
                      placeholder="Select virtual account"
                      formatOptionLabel={(option) => (
                        <div className="align-center">
                          <div className="text-capitalize">{option.label}</div>
                          {option.number && (
                            <div>
                              <span className="m-l-5">-</span> {option.number}
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  {/* Value Input */}
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      className={`fileter_form_input ${
                        acc.error ? "is-invalid" : ""
                      }`}
                      placeholder={
                        splitConfig === "value"
                          ? `Enter Value`
                          : `Max: ${maxAllowed}%`
                      }
                      value={acc.value}
                      maxLength={6}
                      onChange={(e) =>
                        onPercentageChange(e.target.value, index, "virtual")
                      }
                      disabled={
                        splitMode !== SPLIT_MODES.MANUAL &&
                        splitConfig === "percentage"
                      }
                    />
                    {acc.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {acc.error}
                      </div>
                    )}
                  </div>

                  {/* Remove button + Residual Checkbox */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => onRemoveVirtualAccount(index)}
                    >
                      Remove
                    </button>

                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!acc.is_residual}
                        onChange={(e) =>
                          handleVirtualCheckboxChange(index, e.target.checked)
                        }
                      />
                      <span className="m-t-10">Select as Residual</span>
                    </label>
                  </div>
                </div>
              );
            })}

            {allMerchants?.length > 0 && (
              <div className="row form-group">
                <div className="col-xs-12">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={onAddVirtualAccount}
                  >
                    Add Virtual Account
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </>
      {/* )} */}
      <hr></hr>
      {(allBeneficiaries.length > 0 || beneficiaryAccounts.length) > 0 && (
        <>
          <div className="row fw-bold mb-2 mt-4">
            <div className="col-xs-5">
              <label className="bold-text filter_label col-xs-12 p-l-0">
                Beneficiary Accounts
              </label>
            </div>
            {splitMode === SPLIT_MODES.MANUAL &&
              allBeneficiaries.length > 0 &&
              beneficiaryAccounts.length > 0 && (
                <div className="col-xs-5">
                  <label className="filter_label col-xs-12 p-l-0">
                    {splitConfig === "value"
                      ? "Enter Value"
                      : "Enter Percentage"}
                  </label>
                </div>
              )}
            {splitMode === SPLIT_MODES.MANUAL && <div className="col-xs-2" />}
          </div>

          {beneficiaryAccounts.map((acc, index) => {
            const maxAllowed = getMaxForRow("beneficiary", index, acc.value);
            return (
              <div
                key={`b-${index}`}
                className="row m-b-10"
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                {/* Beneficiary Account Dropdown */}
                <div style={{ flex: 1 }}>
                  <AsyncPaginate
                    key={`${index}-${acc.arrayList?.length || 0}`}
                    value={
                      acc.beneficiary_id
                        ? (acc.arrayList || []).find(
                            (opt) => opt.value === acc.beneficiary_id
                          ) || null
                        : null
                    }
                    defaultOptions={uniqByValue(acc.arrayList || [])}
                    onChange={(selected) =>
                      handleBeneficiaryDropdownChange(
                        selected,
                        index,
                        "beneficiary"
                      )
                    }
                    placeholder="Select beneficiary account"
                    formatOptionLabel={(option) => (
                      <div className="align-center">
                        <div className="text-capitalize">{option.label}</div>
                        {option.number && (
                          <div>
                            <span className="m-l-5">-</span> {option.number}
                          </div>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Value Input */}
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    className={`fileter_form_input ${
                      acc.error ? "is-invalid" : ""
                    }`}
                    placeholder={
                      splitConfig === "value"
                        ? `Enter Value`
                        : `Max: ${maxAllowed}%`
                    }
                    value={acc.value}
                    maxLength={6}
                    onChange={(e) =>
                      handleBeneficiaryPercentageChange(
                        e.target.value,
                        index,
                        "beneficiary"
                      )
                    }
                    disabled={
                      splitMode !== SPLIT_MODES.MANUAL &&
                      splitConfig === "percentage"
                    }
                  />
                  {acc.error && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block" }}
                    >
                      {acc.error}
                    </div>
                  )}
                </div>

                {/* Remove Button + Residual Checkbox */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onRemoveBeneficiaryAccount(index)}
                  >
                    Remove
                  </button>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!acc.is_residual}
                      onChange={(e) =>
                        handleBeneficiaryCheckboxChange(index, e.target.checked)
                      }
                    />
                    <span className="m-t-10">Select as Residual</span>
                  </label>
                </div>
              </div>
            );
          })}

          {allBeneficiaries?.length > 0 && (
            <div className="row form-group">
              <div className="col-xs-12">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onAddBeneficiaryAccount}
                >
                  Add Beneficiary Account
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

const SubmitSection = ({
  hasValidationErrors,
  totalPercentage,
  onSubmit,
  splitConfig,
  masterRecord,
}) => (
  <>
    <div className="d-flex justify-content-end mt-3 m-b-5 p-0">
      <button
        className={`btn ${
          hasValidationErrors ? "btn-success" : "btn-secondary"
        }`}
        onClick={onSubmit}
        disabled={
          (splitConfig === "percentage" || splitConfig === "value") &&
          hasValidationErrors
        }
        title={
          (splitConfig === "percentage" || splitConfig === "value") &&
          hasValidationErrors
            ? "Please fix all validation errors"
            : ""
        }
      >
        Submit
      </button>
    </div>
    {splitConfig === "percentage" && !hasValidationErrors && (
      <div className="row form-group">
        <div className="col-xs-12">
          <div className="alert alert-success">
            <strong>✓ 100% allocation completed!</strong> Ready to submit.
          </div>
        </div>
      </div>
    )}
    {console.log(
      Number(masterRecord?.value),
      "masterRecord?.value",
      totalPercentage
    )}
    {splitConfig === "percentage" &&
      hasValidationErrors &&
      totalPercentage !== 100 && (
        <div className="row form-group">
          <div className="col-xs-12">
            <div className="alert alert-danger">
              <strong className="m-r-5">
                ⚠ Total allocation is {totalPercentage?.toFixed(1)}%!.
              </strong>
              Please adjust to not exceed 100%.
            </div>
          </div>
        </div>
      )}
  </>
);

export default SplitDetails;
