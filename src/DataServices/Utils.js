import cookie from "react-cookies";
import moment from "moment";
import BASE_URL from "../Global Variables/GlobalVariables";
import {
  LayoutDashboard,
  FileText,
  Handshake,
  Store,
  Users,
  Wallet,
  UserCog,
  ArrowLeftRight,
  ShieldCheck,
  FileQuestion,
  ShieldUser,
  FileCheck,
  Route,
  Download,
  BrickWallShield,
} from "lucide-react";

export default function getAuthToken() {
  var token = cookie.load("AdminWeb", { path: "/" });
  return token;
}

const getDomain = () => {
  if (window.location.hostname === "localhost") return undefined;
  return "." + window.location.hostname.split(".").slice(-2).join(".");
};

export function setCookie(key, value) {
  cookie.save(key, value, {
    path: "/",
    domain: getDomain(), // 👈 frontend-allowed
    maxAge: 19900000,
    secure: window.location.protocol === "https:",
    sameSite: "lax",
  });
}

// export function setCookie(key, value) {
//   cookie.save(key, value, {
//     path: "/",
//     maxAge: 19900000,
//     secure: false,
//   });
// }

export function getCookie(key) {
  var token = cookie.load(key, { path: "/" });
  return token;
}
export function currencyFormatter(amount, code) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: code.code,
  }).format(amount);
}

export function saveUserShowHome(response, from_where) {
  if (response.success) {
    if (from_where === "from_signin") {
      var data = response.data;
      setCookie("AdminWeb", data.authorization);
      setCookie("SubAdminRoutes", data.userRoleCode);
      setCookie("EnabledRoutes", data.userRoleCode);
      window.location.reload();
    }
  }
}

const resellerLogin = getCookie("UserType");

export const getLinkPath = (displayName) => {
  switch (displayName) {
    case "admin-account":
      return "/account-list";
    case "admin-approval":
      return "/approval-list";
    case "admin-consolidate":
      return "/consolidate-reports";
    case "admin-contacts":
      return "/contact";
    case "admin-dashboard":
      return "/dashboard";
    case "admin-merchant":
      return "/merchant";
    case "admin-reseller":
      return "/reseller";
    case "admin-role":
      return "/role-list";
    case "admin-route-management":
      return "/route-list";
    case "admin-transaction":
      return "/accountstatement";
    case "admin-download-manager":
      return "/report-list";
    default:
      return resellerLogin === "RESELLER" ? "/merchant" : "/dashboard";
  }
};

export const getIconForRoute = (group) => {
  switch (group) {
    case "admin-dashboard":
      return <LayoutDashboard className="w-5 h-5" />;
    case "admin-invoice":
    case "admin-consolidate":
      return <FileText className="w-5 h-5" />;
    case "admin-route-management":
      return <Route className="w-5 h-5" />;
    case "admin-approval":
      return <FileCheck className="w-5 h-5" />;
    case "admin-role":
      return <ShieldUser className="w-5 h-5" />;
    case "admin-reseller":
      return <Handshake className="w-5 h-5" />;
    case "admin-merchant":
      return <Store className="w-5 h-5" />;
    case "admin-contacts":
      return <Users className="w-5 h-5" />;
    case "admin-account":
      return <Wallet className="w-5 h-5" />;
    case "admin-users":
      return <UserCog className="w-5 h-5" />;
    case "admin-transaction":
      return <ArrowLeftRight className="w-5 h-5" />;
    case "admin-role-permission":
      return <ShieldCheck className="w-5 h-5" />;
    case "admin-download-manager":
      return <Download className="w-5 h-5" />;
    case "admin-route-entity":
      return <BrickWallShield />;
    default:
      return <FileQuestion className="w-5 h-5" />;
  }
};
export function getAWSLink() {
  return `${BASE_URL}/s3/sign`;
}

export function randomString(len) {
  var charSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var randomString = "";
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export function GET_AWS_LINK(result) {
  return "https://localhost.s3.amazonaws.com/assets" + result.filename;
}

export function twelveHourDateTimeFormat(dateString) {
  // Parse the "dd-MM-yyyy HH:mm:ss" format manually
  const [day, month, yearAndTime] = dateString.split("-");
  const [year, time] = yearAndTime.split(" ");
  const formattedDate = `${year}-${month}-${day}T${time}`; // Convert to ISO format (yyyy-MM-ddTHH:mm:ss)

  const date = new Date(formattedDate); // Create the Date object
  if (isNaN(date)) {
    return "Invalid Date"; // Handle invalid date input
  }

  // Extract Date Components
  const formattedDay = date.getDate().toString().padStart(2, "0"); // Add leading zero to day
  const formattedMonth = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const formattedYear = date.getFullYear();

  // Extract Time Components
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM"; // Determine AM/PM

  hours = hours % 12 || 12; // Convert to 12-hour format (0 becomes 12)
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero to minutes
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds; // Add leading zero to seconds

  // Combine Date and Time
  const formattedTime = `${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  const formattedDateString = `${formattedDay}-${formattedMonth}-${formattedYear}`;

  return `${formattedDateString} ${formattedTime}`; // Return Date and Time
}

export function returnTimeZoneDate(date) {
  if (date === "" || date === undefined || date === null || date === "-") {
    return "";
  }
  var date = moment(date);
  return moment.utc(date).local().format("DD-MM-YYYY h:mm a");
}

export function returnZoneDate(date) {
  if (date === "" || date === undefined || date === null || date === "-") {
    return "";
  }
  var date = moment(date);
  return moment.utc(date).local().format("DD/MM/YYYY");
}

export function textCapitalize(data) {
  if (data !== undefined && data !== null && data !== "") {
    return data.charAt(0).toUpperCase() + data.slice(1);
  } else {
    return data;
  }
}

export function checkImageType(
  self,
  name,
  is_name,
  file,
  next,
  progress,
  isFrom
) {
  var imageType = "image/*";
  if (!file.type.match(imageType)) {
    //message.error("Please upload image only");
  } else {
    if (isFrom === "international") {
      self.onUploadPrimaryStart(file, next, name, is_name, progress);
    } else {
      self.onUploadPrimaryStart(file, next, name);
    }
  }
}

export function validate(e) {
  var theEvent = e || window.event;
  if (theEvent.type === "paste") {
    key = e.clipboardData.getData("text/plain");
  } else {
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
  }
  var regex = /^[0-9]+$/;
  if (!regex.test(key)) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
}

export function escape(str) {
  var tagsToReplace = {
    // '&': '&amp;',
    "<": "&lt;",
    ">": "&gt;",
  };
  return str.replace(/[&<>]/g, function (tag) {
    return tagsToReplace[tag] || tag;
  });
}

export function manipulateString(str) {
  var i,
    frags = str.split("_");
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join("");
}
export function handlePaste(e) {
  e.preventDefault();
}
export const validateIPAddress = (ip) => {
  const regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return !regex.test(ip);
};

export function formatName(name) {
  return textCapitalize(name.replace(/_/g, " "));
}
export function formatLabelWithCaps(text) {
  return text.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
}

export function formatDate(dateString) {
  // Extract year, month, and day from the string
  const year = dateString.toString().substring(0, 4);
  const month = dateString.toString().substring(4, 6);
  const day = dateString.toString().substring(6, 8);

  // Format and return as 'DD-MM-YYYY'

  // toString().moment(new(data)).format('DD/MM/YYYY') another method dateString in newDate
  return `${day}-${month}-${year}`;
}
export function formatDateToYYYYMMDD(dateString) {
  // Create a Date object from the input string
  const date = new Date(dateString);

  // Extract the year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(date.getDate()).padStart(2, "0");

  // Return the formatted date
  return `${year}${month}${day}`;
}

export const removeUnderScore = (value) => {
  return value
    ?.replaceAll("-", " ")
    ?.replaceAll("_", " ")
    ?.replaceAll("?", " for ")
    ?.replaceAll(" ", " ")
    ?.replaceAll(".", " ")
    ?.replaceAll("%20", " ")
    ?.replace(/(\b)kyc(\b)/g, "KYC")
    ?.replace(/(\b)ip(\b)/g, "IP")
    ?.replace(/(\b)ndr(\b)/g, "NDR")
    ?.replace(/(\b)api(\b)/g, "API")
    ?.replace(/(\b)dr(\b)/g, "DR")
    ?.replace(/(\b)nda(\b)/g, "NDA");
};

export function capitalizeWords(str) {
  if (!str) return "";
  return str
    .split("_")
    .map((word) => word.toUpperCase())
    .join(" ");
}

export function currencyFormat(amount) {
  let a = currencyFormatter(Math.round(amount * 100) / 100, { code: "INR" });
  return a;
}
export function camelCaseText(value) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function formatLabel(str) {
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export function stripTime(dateStr) {
  if (!dateStr) return dateStr;
  return dateStr.split("T")[0]; // keeps only YYYY-MM-DD
}
export const uniqByValue = (arr) => {
  const seen = new Set();
  return (arr || []).filter((o) => {
    const id = o && o.value;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};
