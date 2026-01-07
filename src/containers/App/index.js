import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import MainApp from "./MainApp";
import SignIn from "./SignIn";
import Condition from './Condition';
import "rc-pagination/assets/index.css";

var isLogin = Condition();

//var isLogin = true;
const RestrictedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
    {...rest}
    render={props =>
      isLogin
        ? <Component {...props} />
        : <Redirect
          to={{
            pathname: '/signin',
            state: { from: props.location }
          }}
        />}
    />
  )  
}  

const App = (props) => {
  const {match , location} = props;
  if (location.pathname === '/') {
    if (!isLogin) {
      return (<Redirect to={'/signin'} />);
    } else  {
      return (<Redirect to={'/dashboard'} />);
    } 
  }
  return (
      <Switch>
        <Route exact path='/signin' component={SignIn} />
        <RestrictedRoute path={`${match.url}`} component={MainApp} />
        {/* <Route path={`${match.url}`} component={MainApp} /> */}
      </Switch>  
  )
}

export default App;
