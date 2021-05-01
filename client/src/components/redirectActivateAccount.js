import React, { useState } from "react"; // useState is a hook of react where we can use state in functions so we dont need classes
import { Container, Button, Form } from "react-bootstrap";
import { useUserDispatch, logMeIn } from "../UserContext.js";
import Axios from "axios";
import { useHistory, Link, useParams } from "react-router-dom";
import {
  displayError,
  displaySuccess,
  useErrorDispatch,
} from "../ErrorContext";

function RedirectActivateAccount() {
  const { email, code } = useParams();

  const dispatch = useUserDispatch();
  const errorDispatch = useErrorDispatch();
  const history = useHistory();

  const logIn = () => {
    Axios.get("/accountActivation.php?email=" + email + "&code=" + code)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          displaySuccess(errorDispatch, "Login Successful");
          logMeIn(dispatch, response);
          history.push("/dashboard");
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          displayError(errorDispatch, err.response.data.msg);
        } else if (err.response.status === 404) {
          displayError(errorDispatch, err.response.data.msg);
        }
      });
  };
  logIn();
  return null;
}

export default RedirectActivateAccount;
