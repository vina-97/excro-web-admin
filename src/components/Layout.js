import React from "react";
import {useLocation} from 'react-router-dom';
function Layout () {
    const location = useLocation();
     return(<>
       {location.pathname.replace(/^\/([^\/]*).*$/, '$1')}
     </>)
  }
  export default Layout;