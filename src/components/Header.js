import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import cookie from "react-cookies";

import Logo from "../assets/images/excro-logo.svg";
import { userConstants } from "../constants/ActionTypes";
import ApiGateway from "../DataServices/DataServices";
import { getCookie } from "../DataServices/Utils";
import useRouteExist from "../DataServices/useRouteExist";
import Loader from "./Loader";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { addToast } = useToasts();

  const { acl_routes } = useSelector((state) => state);

  // route access checks
  const setDefaultPricingRoute = useRouteExist(["admin-get-default-setting"]);
  // const logoutRoute = useRouteExist(["admin-logout"]);
  const adduserListRoute = useRouteExist(["admin-list-admin-user"]);

  // cookies
  const subAdminRoutes = getCookie("SubAdminRoutes");
  const enabledRoutes = getCookie("EnabledRoutes");

  const [loading, setLoading] = useState(false);

  const applyToast = useCallback(
    (msg, type) => {
      addToast(msg, { appearance: type });
    },
    [addToast]
  );

  const logout = useCallback(() => {
    ApiGateway.post("/payout/admin/logout", {}, (response) => {
      if (response.success) {
        applyToast(response.message, "success");
        cookie.remove("AdminWeb", { path: "/" });
        cookie.remove("AdminWeb", { path: "/", domain: ".xylium.com" });
        cookie.remove("SubAdminRoutes", { path: "/" });
        window.location.reload();
      } else {
        applyToast(response.message, "error");
      }
    });
  }, [applyToast]);

  // helper for dispatch
  const updateAclRoutes = useCallback(
    (routes) => {
      dispatch({
        type: userConstants.ACL_ROUTES,
        payload: { acl_routes: routes },
      });
    },
    [dispatch]
  );

  useEffect(() => {
    if (acl_routes?.acl_routes?.length) {
      const selectedRoutes = Object.values(acl_routes.acl_routes).flatMap(
        (route) => Object.values(route?.route_list || {}).map((r) => r?.group)
      );

      const currentSelected = acl_routes?.selected_acl_routes || [];

      // only dispatch if values actually changed
      const isDifferent =
        selectedRoutes.length !== currentSelected.length ||
        selectedRoutes.some((r, i) => r !== currentSelected[i]);

      if (isDifferent) {
        dispatch({
          type: userConstants.ACL_ROUTES,
          payload: { selected_acl_routes: selectedRoutes },
        });
      }
    }
  }, [acl_routes?.acl_routes, dispatch]);

  // remove useCallback here
  const fetchUpdatedRoutes = (routeId) => {
    if (!routeId) return;
    setLoading(true);
    ApiGateway.get(
      `/payout/admin/role-permission/get-all-update-routes/${routeId}`,
      (response) => {
        if (response.success) {
          updateAclRoutes(response.data.route_list);
        }
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (
      typeof subAdminRoutes === "string" &&
      acl_routes?.acl_routes?.length === 0
    ) {
      fetchUpdatedRoutes(subAdminRoutes);
    }
  }, [subAdminRoutes, acl_routes?.acl_routes]);

  useEffect(() => {
    if (
      typeof enabledRoutes === "string" &&
      acl_routes?.acl_routes?.length === 0
    ) {
      fetchUpdatedRoutes(enabledRoutes);
    }
  }, [enabledRoutes, acl_routes?.acl_routes]);

  return (
    <header>
      {loading && <Loader />}
      <Link to="/dashboard">
        <div className="header_left_part">
          <div className="logo_wrapper">
            <img src={Logo} alt="logo" className="logo_img" />
          </div>
        </div>
      </Link>
      <div className="header_right_part">
        <ul className="nav_list_right">
          <li>
            <button onClick={logout} className="link-button">
              Logout
            </button>
          </li>

          {subAdminRoutes !== "RESELLER" && (
            <>
              {setDefaultPricingRoute && (
                <li>
                  <Link
                    to="/pricing"
                    className={
                      location.pathname === "/pricing" ? "active_header" : ""
                    }
                  >
                    Pricing
                  </Link>
                </li>
              )}
              {adduserListRoute && (
                <li>
                  <Link
                    to="/users"
                    className={
                      location.pathname.startsWith("/users")
                        ? "active_header"
                        : ""
                    }
                  >
                    Manage Team
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/escrow-pool-accounts"
                  className={
                    location.pathname.startsWith("/escrow-pool-accounts")
                      ? "active_header"
                      : ""
                  }
                >
                  Escrow / Pool Accounts
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
