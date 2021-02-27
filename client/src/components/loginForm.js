import React, { useState } from "react"; // useState is a hook of react where we can use state in functions so we dont need classes
import { Container, Button, Form } from "react-bootstrap";

function LoginForm() {
  const [counter, setCount] = useState(0);
  const [name, setName] = useState("");
  // function  onChange(e) {
  //     setName(e.target.value)
  // }
  return (
    <Container className="loginFormContainer">
       
      <Form  className = "loginForm">
      <h3>Sign Up</h3>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
         
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" placeholder="Confirm Password" />
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
    </Container>
  );
}

export default LoginForm;

// using hooks

{
  /* <input onChange = {()=>setName(e.target.value)} */
}
