import {combineReducers} from "redux";
import {authentication} from "./Auth";
import {payout} from "./Payout";
import {quick_transfer} from "./Quick_Transfer";
import {account_statement} from "./AccountStatement";
import {payout_merchant} from "./Merchant";
import {contact} from "./Contact";
import {account} from "./Account";
import {settings} from "./Settings";
import {home} from "./Home";
import {transaction} from "./Transaction";
import {pagination} from "./Pagination";
import {loading} from "./Loader";
import { admin_pricing } from "./AdminPricing";
import { merchant_pricing } from "./MerchantPricing";
import {user_list,addUser,editUser} from "./Users";
import {nodal_account} from "./NodalAccount";
import {acl_routes} from "./AclRoutes";
import {reports} from "./Reports";
import { reseller, resellerPricing } from "./Reseller";
import { invoice } from "./Invoice";
import { downloadManager } from "./DownloadManager";

const rootReducer = combineReducers({
  auth : authentication,
  payout : payout,
  quick_transfer,
  account_statement,
  payout_merchant,
  contact,
  account,
  settings,
  home,
  transaction,
  pagination,
  loading,
  admin_pricing,
  merchant_pricing,
  user_list,
  addUser,
  editUser,
  nodal_account,
  acl_routes,
  reports,
  reseller,
  invoice,
  resellerPricing,
  downloadManager
});

export default rootReducer;
