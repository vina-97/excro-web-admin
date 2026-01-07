import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getCookie } from "./Utils";

const useRouteExist = (current_route) => {
  const [data, setData] = useState(null);
  let subAdminRoutes = getCookie("SubAdminRoutes");
  const { acl_routes } = useSelector((state) => state);
  // console.log(
  //   acl_routes.selected_acl_routes,
  //   "routeExist",
  //   current_route,
  //   subAdminRoutes
  // );
  useEffect(() => {
    if (subAdminRoutes !== "ADMIN") {
      const routeExist = acl_routes.selected_acl_routes.some((r) =>
        current_route.includes(r)
      );

      setData(routeExist);
    } else {
      setData(true);
    }
  }, [acl_routes.selected_acl_routes]);
  return data;
};
export default useRouteExist;
