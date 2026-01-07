import React, { useEffect, useMemo, useState } from "react";
import { Route, Switch, Router, Link, Redirect, useLocation, useHistory, useParams, useRouteMatch } from "react-router-dom";
import Layout from "../../components/Layout";
import Loader from "../../components/Loader";

const NewDashboard = React.lazy(() => import("../../components/NewDashboard"));
const Header = React.lazy(() => import('../.././components/Header'));
const Footer = React.lazy(() => import('../.././components/Footer'));
const SideNav = React.lazy(() => import('../.././components/SideNav'));
const Home = React.lazy(() => import('../.././components/Home'));
const AccountStatement = React.lazy(() => import('../.././components/AccountStatement'));
const ViewAccountStatement = React.lazy(() => import('../.././components/AccountStatement'));
const SplitAccountStatement = React.lazy(() => import('../.././components/AccountStatement'));
const SplitRefAccountStatement = React.lazy(() => import('../.././components/AccountStatement'));
const Contact = React.lazy(() => import('../.././components/Contact'));
const Account = React.lazy(() => import('../.././components/Account'));
const Merchant = React.lazy(() => import('../../components/Merchant/Merchant'));
const EditMerchant = React.lazy(() => import('../.././components/Merchant/EditMerchant'));
const AddMerchant = React.lazy(() => import('../../components/Merchant/AddMerchant'));
const Settings = React.lazy(() => import('../.././components/Settings'));
const MerchantPricing = React.lazy(() => import('../.././components/Merchant/MerchantPricing'));
const Users = React.lazy(() => import('../../components/Users/Users'));
const AddUsers = React.lazy(() => import('../../components/Users/AddUser'));
const EditUsers = React.lazy(() => import('../../components/Users/EditUsers'));
const NodalList = React.lazy(() => import('../../components/NodalAccount'));
const NodalCreation = React.lazy(() => import('../../components/NodalAccount/NodalCreation'));
const EditNodal = React.lazy(() => import('../../components/NodalAccount/EditNodal'));

const Reports = React.lazy(() => import("../../components/Reports"));
const Reseller = React.lazy(() => import("../../components/Reseller"));
const AddReseller = React.lazy(() => import("../../components/Reseller/AddReseller"));
const TransactionDetail = React.lazy(() => import('../../components/TransactionDetailNew'));
const ApprovalList = React.lazy(() => import('../../components/ApprovalManagement'));
const NodalAccountApproval = React.lazy(() => import('../../components/ApprovalManagement/NodalAccountApproval'));

const DefaultResellerPricing = React.lazy(() => import("../../components/Reseller/DefaultResellerPricing"));
const PricingApproval = React.lazy(() => import("../../components/ApprovalManagement/PricingApproval"));

const MerchantBankList = React.lazy(() => import("../../components/Merchant/ViewMerchantBank"));

const MerchantResellerPricing = React.lazy(() => import("../../components/Reseller/MerchantResellerPricing"));
const RoleList = React.lazy(() => import("../../components/RoleManagement/index"));
const AddRole = React.lazy(() => import("../../components/RoleManagement/AddRole"));
const DownloadManager = React.lazy(() => import("../../components/DownloadManager"));
const GenerateReport = React.lazy(() => import("../../components/DownloadManager/GenrateReport"));
const VelocityCheck = React.lazy(() => import("../../components/Merchant/VelocityCheck"));
const RouteManagement = React.lazy(() => import("../../components/RouteManagement"));
const AddRoutes = React.lazy(() => import("../../components/RouteManagement/AddRoute"));
const EntityList = React.lazy(() => import("../../components/Entity/EntityList"));


// const InvoiceReports = React.lazy(() => import("../../components/Invoice"));
// const ViewInvoiceReports = React.lazy(() => import("../../components/Invoice/ViewInvoice"));


/*const AdminRoutes = React.lazy(() => import('../../components/AdminRoutes'));
const ViewAdminRoutes = React.lazy(() => import('../../components/ViewAdminRoutes')); */


function MainApp(props) {
  const location = useLocation();
  return (
    <React.Suspense fallback={<Loader />}>
      {/* <div className="animated-header"></div> */}
      <Header />
      <SideNav {...props} />
      <Switch>
        {/* <Layout> */}
        <Route exact={true} path="/dashboard" component={NewDashboard} />
        <Route exact={true} path="/dashboard-old" component={Home} />
        <Route exact={true} path="/accountstatement" component={AccountStatement} />
        {/* <Route exact={true} path="/accountstatementold/:id" component={ViewAccountStatement}/>  */}
        <Route exact={true} path="/contact" component={Contact} />
        <Route exact={true} path="/account-list" component={Account} />
        <Route exact={true} path="/merchant" component={Merchant} />
        <Route exact={true} path="/merchant/merchant_edit/:merchant_id" component={EditMerchant} />
        <Route exact={true} path="/merchant/merchant_pricing/:merchant_id" component={MerchantPricing} />
        <Route exact={true} path="/merchant/add" component={AddMerchant} />
        <Route exact={true} path="/pricing" component={Settings} />
        <Route exact={true} path="/users" component={Users} />
        <Route exact={true} path="/users/addusers" component={AddUsers} />
        <Route exact={true} path="/users/edituser/:id" component={EditUsers} />
        <Route exact={true} path="/escrow-pool-accounts" component={NodalList} />
        <Route exact={true} path="/escrow-pool-accounts/escrow-pool-accounts" component={NodalCreation} />
        <Route exact={true} path="/escrow-pool-accounts/escrow-pool-accounts/:id" component={EditNodal} />
        <Route exact={true} path="/consolidate-reports" component={Reports} />
        <Route exact={true} path="/reseller" component={Reseller} />
        <Route exact={true} path="/reseller/add" component={AddReseller} />
        <Route exact={true} path="/accountstatement/:id" component={ViewAccountStatement} />
        <Route exact={true} path="/approval-list" component={ApprovalList} />
        <Route exact={true} path="/approval-list/approve-pricing/:id" component={PricingApproval} />
        <Route exact={true} path="/approval-list/approve-nodal/:id" component={NodalAccountApproval} />
        <Route exact={true} path="/reseller/pricing" component={DefaultResellerPricing} />
        <Route exact={true} path="/reseller/merchant-reseller-pricing/:id" component={MerchantResellerPricing} />
        <Route exact={true} path="/merchant/merchant-bank-list/:id" component={MerchantBankList} />
        <Route exact={true} path="/role-list" component={RoleList} />
        <Route exact={true} path="/role-list/add" component={AddRole} />
        <Route exact={true} path="/report-list" component={DownloadManager} />
        <Route exact={true} path="/report-list/generate-reports/:id" component={GenerateReport} />
        <Route exact={true} path="/role-list/edit/:id" component={AddRole} />
        <Route exact={true} path="/merchant/velocity-check/:id" component={VelocityCheck} />
        <Route exact={true} path="/route-list" component={RouteManagement} />
        <Route exact={true} path="/route-list/add-route" component={AddRoutes} />
        <Route exact={true} path="/route-list/edit-route/:parentId" component={AddRoutes} />
        <Route exact={true} path="/transaction/detail/:trans_id" component={SplitAccountStatement} />
        <Route exact={true} path="/transaction/detail/ref/:trans_ref" component={SplitRefAccountStatement} />
        <Route exact={true} path="/entity-list" component={EntityList} />

        {/*<Route exact={true} path="/invoice-reports" component={InvoiceReports}/>
        <Route exact={true} path="/view-invoice" component={ViewInvoiceReports}/> */}
        {/* <Route exact={true} path="/invoice-reports" component={InvoiceReports}/>
        <Route exact={true} path="/view-invoice" component={ViewInvoiceReports}/> */}

        {/*<Route exact={true} path="/add-admin-route" component={AdminRoutes} /> 
        <Route exact={true} path="/admin-route" component={ViewAdminRoutes} />*/}

        {/* </Layout> */}
      </Switch>
      <Footer />
    </React.Suspense>
  )
}



export default MainApp;



