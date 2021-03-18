import React, { useState } from "react"; // useState is a hook of react where we can use state in functional components so we dont need classes
import { Container, Button, Form } from "react-bootstrap";
import { useUserState,logMeIn, useUserDispatch } from "../UserContext.js";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import {displayError,displaySuccess,useErrorDispatch} from '../ErrorContext';


function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const { user, isAuthenticated } = useUserState();
  const dispatch = useUserDispatch();
  const errorDispatch = useErrorDispatch();
  const history = useHistory();
  
  const signUp = (e) => {
    e.preventDefault();
    if (email == "" || password == "" || confirmPassword == "") {
      alert("wtf");
      return;
    }
    if (password !== confirmPassword) {
      alert("bruh can");
      return;
    }
  
    const userObj = {
      email,
      password,
      role : "READER"
    };
    Axios.post(
      "/signUp.php",JSON.stringify(userObj)
    ).then((response) => {
      console.log(response);
      logMeIn(dispatch,response);
      displaySuccess(errorDispatch,'Successfully Registered And Logged In!')
      history.push("/dashboard")
    });
  };
  return (
    <Container>
      <Form onSubmit={signUp} className="signUp">
        <h3>Sign Up</h3>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
    </Container>
  );
}

export default SignUpForm;