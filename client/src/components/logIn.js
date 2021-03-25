import React, { useState } from "react"; // useState is a hook of react where we can use state in functions so we dont need classes
import { Container, Button, Form } from "react-bootstrap";
import { useUserDispatch, logMeIn } from "../UserContext.js";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import {
  displayError,
  displaySuccess,
  useErrorDispatch,
} from "../ErrorContext";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useUserDispatch(); //dispatcher
  const errorDispatch = useErrorDispatch();
  const history = useHistory();

  const logIn = (e) => {
    e.preventDefault();
    if (email == "" || password == "") {
      displayError(errorDispatch, "Please Fill All The Fields."); //displayError is a function in libraryAlerts.
      return; // to stop execution neeche ka
    }

    const userObj = {
      email,
      password,
    };
    Axios.post("/logIn.php", JSON.stringify(userObj))
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          displaySuccess(errorDispatch, "Login Successful");
          logMeIn(dispatch, response); //responsible for putting data in User context
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
  return (
    <Container>
      <Form onSubmit={logIn} className="logIn">
        <h3>Log In</h3>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Log In
        </Button>
      </Form>
    </Container>
  );
}

export default LogIn;
