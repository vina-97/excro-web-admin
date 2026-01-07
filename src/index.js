import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import './styles/css/bootstrap.min.css';
import './styles/css/style.css';   
import './styles/css/font-awesome.css';
import NextApp from './NextApp';
import "react-datepicker/dist/react-datepicker.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
if (process.env.NODE_ENV === "production")
  console.log = () => {};
ReactDOM.render(
  // <React.StrictMode>
    <NextApp />,
  // </React.StrictMode>,
  document.getElementById('root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();