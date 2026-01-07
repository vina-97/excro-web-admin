import React from "react";
import {Route, Switch, Router} from "react-router-dom";
import {Provider} from "react-redux";
import { store , history} from "./appRedux/store";
import App from "./containers/App";
import { ToastProvider, useToasts } from 'react-toast-notifications';

const NextApp = () =>
<Provider store={store}>
  <ToastProvider autoDismiss={true} autoDismissTimeout={4000}  placement="top-center">
    <Router history={history}>
      <Switch>
        <Route path="/" component={App}/>
      </Switch>
    </Router>
  </ToastProvider>
</Provider>;


export default NextApp;