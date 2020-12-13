import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { ToastProvider } from "react-toast-notifications";
import { Provider } from "redux-zero/react";
import store from "./store";
import "./i18n";

// monkey patch console.error to suppress contentEditable error
console.error = (function () {
  var error = console.error;

  return function (exception: any) {
    if (
      !(exception + "").startsWith("Warning: A component is `contentEditable`")
    ) {
      error.apply(console, arguments as any);
    }
  };
})();

ReactDOM.render(
  <Provider store={store}>
    <ToastProvider>
      <App />
    </ToastProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();