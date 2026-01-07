import React, { useCallback, useEffect } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import ApiGateway from "../../../DataServices/DataServices";
import { useToasts } from "react-toast-notifications";

function ResellerSelect({
  value,
  onChange,
  placeholder = "Select Reseller Name",
  isDisabled = false,
  from,
}) {
  const { addToast } = useToasts();

  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  };

  const loadOptions = useCallback(
    async (inputValue, loadedOptions, { page } = { page: 1 }) => {
      if (inputValue?.length < 3 && inputValue?.length > 0) {
        return {
          options: [],
          hasMore: false,
          additional: { page },
        };
      }

      let queryParams = "";
      if (inputValue) {
        queryParams += `&search_term=${inputValue}`;
      }

      try {
        const response = await new Promise((resolve, reject) => {
          ApiGateway.get(
            `/payout/admin/reseller/list?page=${page}&limit=10&status=active${queryParams}`,
            function (res) {
              if (res.success) {
                resolve(res);
              } else {
                reject(res);
              }
            }
          );
        });

        const transactions = response?.data?.resellers || [];

        return {
          options: transactions
            .filter(
              (item) => item.reseller_name && item.reseller_name.trim() !== ""
            )
            .map((item) => ({
              value: item.reseller_id,
              label: item.reseller_name,
            })),
          hasMore: transactions.length >= 10,
          additional: { page: inputValue ? 2 : page + 1 },
        };
      } catch (err) {
        console.error("Error fetching resellers", err);
        applyToast(err.message || "Something went wrong", "error");
        return {
          options: [],
          hasMore: false,
          additional: { page },
        };
      }
    },
    []
  );

  useEffect(() => {
    from === "reseller" && loadOptions();
  }, []);

  return (
    <AsyncPaginate
      className="w-full"
      value={value}
      loadOptions={loadOptions}
      onChange={onChange}
      placeholder={placeholder}
      isSearchable={true}
      additional={{ page: 1 }}
      isDisabled={isDisabled}
      isClearable={true}
      styles={{
        control: (base, state) => ({
          ...base,
          borderColor: state.isFocused ? "#2563eb" : "#d1d5db", // Tailwind: blue-600 / gray-300
          boxShadow: "none",
          "&:hover": { borderColor: "#2563eb" },
          minHeight: "38px",
        }),
        menu: (base) => ({
          ...base,
          borderRadius: "0.5rem", // Tailwind rounded-lg
          padding: "0.25rem", // Tailwind p-1
          fontSize: "1.35rem", // Tailwind text-sm
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#e5e7eb" : "white", // gray-200
          color: "#111827", // gray-900
          padding: "0.5rem 0.75rem", // Tailwind px-3 py-2
          textTransform: "capitalize", // 🔑 Capitalize dropdown text
        }),
        singleValue: (base) => ({
          ...base,
          textTransform: "capitalize",
          color: "#111827",
        }),
      }}
    />
  );
}

export default ResellerSelect;
