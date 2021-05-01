import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useUserState, logMeIn, useUserDispatch } from "../UserContext.js";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import {
  displayError,
  displaySuccess,
  useErrorDispatch,
} from "../ErrorContext";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useUserDispatch();
  const errorDispatch = useErrorDispatch();
  const history = useHistory();

  const signUp = (e) => {
    e.preventDefault();
    if (email == "" || password == "" || confirmPassword == "") {
      return;
    }
    if (password !== confirmPassword) {
      displayError(errorDispatch, "Please Check Your Password.");
      return;
    }

    const userObj = {
      email,
      password,
      role: "READER",
    };
    Axios.post("/signUp.php", JSON.stringify(userObj))
      .then((response) => {
        // logMeIn(dispatch, response);
        displaySuccess(
          errorDispatch,
          "Successfully Registered !Please activate your account!"
        );
        history.push("/activateAccountMsg");
      })
      .catch((err) => {
        displayError(errorDispatch, err.response.data.msg);
      });
  };
  return (
    <Container>
      <Form onSubmit={signUp} className="signUp">
        <h3>Sign Up</h3>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>
            Email address <sup>*</sup>
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>
            Password <sup>*</sup>
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>
            Confirm Password <sup>*</sup>
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <p
          style={{
            color: "red",
            marginTop: "5%",
            marginBottom: "-2%",
            marginLeft: "7%",
          }}
        >
          Required Fields <sup>*</sup>
        </p>
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
    </Container>
  );
}

export default SignUpForm;
