import React, { useState } from "react"; // useState is a hook of react where we can use state in functional components so we dont need classes
import { Container, Button, Form } from "react-bootstrap";
import { useUserState, logMeIn, useUserDispatch } from "../UserContext.js";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import {
  displayError,
  displaySuccess,
  useErrorDispatch,
} from "../ErrorContext";

function ForgotPassword() {
  const [email, setEmail] = useState(""); // this is also array destructuring
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [otpInMail, setOtpInMail] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState("");
  var [invalidOtpCount, setInvalidOtpCount] = useState(0);
  const dispatch = useUserDispatch();
  const errorDispatch = useErrorDispatch(); // useErrorDispatch is a functioon in ErrorContext.js that is returning a value
  const history = useHistory();

  const newPasswordFieldsJSX = (
    <>
      <Form.Group controlId="formBasicPassword">
        <Form.Label>
          New Password <sup>*</sup>
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
      <Form.Group controlId="otp">
        <Form.Label>
          OTP <sup>*</sup>
        </Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
        />
      </Form.Group>
    </>
  );

  const resetPassword = () => {
    if (otp != otpInMail) {
      if (invalidOtpCount === 3) {
        setOtpSent(false);
        return;
      }
      setInvalidOtpCount(invalidOtpCount + 1);
      displayError(
        errorDispatch,
        `Wrong OTP! Only ${3 - invalidOtpCount} attempts remaining.`
      );
      return;
    }

    if (password !== confirmPassword) {
      displayError(errorDispatch, `Password Do not match`);
      return;
    }

    const userObj = {
      email,
      password,
    };
    Axios.post("/resetPassword.php", JSON.stringify(userObj))
      .then((response) => {
        if (response.status === 200) {
          displaySuccess(errorDispatch, response.data.msg);
          history.push("/logIn");
        }
      })
      .catch((err) => {
        displayError(errorDispatch, err.response.data.msg);
      });
  };

  const sendOtpEmail = (e) => {
    e.preventDefault();
    if (email === "") {
      displayError(errorDispatch, "Please Enter a registered email address.");
      return;
    }

    const userObj = {
      email,
    };
    Axios.post("/forgotPassword.php", JSON.stringify(userObj))
      .then((response) => {
        if (response.status === 200) {
          displaySuccess(errorDispatch, "Sent an OTP on the registered email address.");
          setOtpSent(true);
          setOtpInMail(response.data.otp);
        }
      })
      .catch((err) => {
        displayError(errorDispatch, err.response.data.msg);
      });
  };
  return (
    <Container>
      <Form onSubmit={sendOtpEmail} className="resetPassword">
        <h3>Reset Password</h3>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>
            Registered email address <sup>*</sup>
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter registered email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        {otpSent ? newPasswordFieldsJSX : null}

        <p
          style={{
            color: "red",
            marginTop: "5%",
            marginBottom: "2%",
            marginLeft: "7%",
            fontSize: "15px"
          }}
        >
          Required Fields <sup>*</sup>
        </p>
        {otpSent ? (
          <Button className="resetOTPButton" variant="primary" onClick={resetPassword}>
            Reset Password
          </Button>
        ) : (
          <Button variant="primary" type="submit">
            Get OTP
          </Button>
        )}
      </Form>
    </Container>
  );
}

export default ForgotPassword;
