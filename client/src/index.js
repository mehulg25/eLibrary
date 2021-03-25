import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from "./UserContext";
import { ErrorProvider } from "./ErrorContext";
import { BooksProvider } from "./BooksContext";

ReactDOM.render(
  <UserProvider>
    <ErrorProvider>
      <BooksProvider>
        <App />
      </BooksProvider>
    </ErrorProvider>
  </UserProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
