import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCookie, getIconForRoute } from "../DataServices/Utils";


export const getLinkPath = (displayName) => {

  const resellerLogin = getCookie("UserType");
  // console.log(resellerLogin,"resellerLogin")
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
    case "admin-route-entity":
      return "/entity-list";
    default:
      return resellerLogin === "RESELLER" ? "/merchant" : "/dashboard";

  }
};
const SideNav = () => {
  const location = useLocation();
  const { acl_routes } = useSelector((state) => state);

  const sidebarRoutes =
    acl_routes?.acl_routes?.filter(
      (route) => route.is_side_bar && route.is_enabled
    ) || [];

  // console.log(sidebarRoutes);

  return (
    <div className="side_nav">
      <ul className="side_nav_list">
        <li className="p-b-5">
          <span></span>
        </li>

        {sidebarRoutes?.map((route) => {
          const path = getLinkPath(route.group);
          const isActive = location.pathname.startsWith(path);

          return (
            <li key={route.route_id}>
              <Link to={path} className={isActive ? "active" : ""}>
                <span>
                  {getIconForRoute(route.group)}
                  {route.display_name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideNav;
