import { useState, useEffect } from "react";
import { useDispatch, useSelector  } from 'react-redux';
import { getCookie } from "./Utils";

const useRouteAllExist = (current_route) => {
    let subAdminRoutes =getCookie("SubAdminRoutes")
    const [data, setData] = useState(null);
    const { acl_routes} = useSelector((state) => state);
    useEffect(() => {
        if(!subAdminRoutes){
            const routeList = acl_routes.selected_acl_routes;
            const routeExist = current_route?.every(v => routeList.includes(v));
            setData(routeExist);
        } else{
            setData(true);
        }
    }, [acl_routes.selected_acl_routes])
    return data;
};
export default useRouteAllExist;