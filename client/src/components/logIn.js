import React, { useState } from "react"; // useState is a hook of react where we can use state in functions so we dont need classes
import { Container, Button, Form } from "react-bootstrap";
import { useUserState, useUserDispatch } from "../UserContext.js";
import Axios from "axios";
import { useHistory } from "react-router-dom";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, isAuthenticated } = useUserState();
  const dispatch = useUserDispatch();
  const history = useHistory();

  const logIn = (e) => {
    e.preventDefault();
    if (email == "" || password == "") {
      alert("wtf");
      return;
    }

    const userObj = {
      email,
      password,
    };
    Axios.post("http://localhost:8080/eLibrary/server/logIn.php", userObj).then(
      (response) => {
        console.log(response);
        if (response.status === 200) {
          dispatch({ type: "login", payload: response.data });
          
        }
      }
    );
    console.log(user, isAuthenticated);
    if (isAuthenticated && user.role === "ADMIN") {
      history.push("/adminDashboard");
    }
  };
  return (
    <Container>
      {user && isAuthenticated}
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
