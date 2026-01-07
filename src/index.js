import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "./styles/css/bootstrap.min.css";
import "./styles/css/style.css";
import "./styles/css/font-awesome.css";
import NextApp from "./NextApp";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// ✅ Use your custom REACT_APP_ENV instead
if (process.env.REACT_APP_ENV === "production") {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

ReactDOM.render(<NextApp />, document.getElementById("root"));

reportWebVitals();
