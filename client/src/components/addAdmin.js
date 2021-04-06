import React, { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import Axios from "axios";
import {
  displayError,
  displaySuccess,
  useErrorDispatch,
} from "../ErrorContext";

function AddAdmin({ handleAddAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modal, setModal] = useState(false);
  const errorDispatch = useErrorDispatch();
  const addAdmin = (e) => {
    e.preventDefault();
    if (email == "" || password == "" || confirmPassword == "") {
      displayError(errorDispatch, "Please Fill All The Fields.");

      return;
    }
    if (password !== confirmPassword) {
      displayError(errorDispatch, "Please Check Password.");
      return;
    }

    const userObj = {
      email,
      password,
      role: "ADMIN",
    };
    Axios.post("/signUp.php", userObj).then(
      (response) => {
        if (response.status === 200) {
          displaySuccess(errorDispatch, "User Created!");

        userObj.id = response.data.id;
        userObj.currently_issued_bookid = null;
        setModal(false);
        handleAddAdmin(userObj);
      } }
      // else if (response.status == 500) {
      //   displayError(errorDispatch, response.data.msg);
    );
  };
  return (
    <div>
      <button className="addButton" onClick={setModal}>
        +
      </button>
      <Modal
        show={modal} //show when value true
        onHide={setModal} //function call
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Admin
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addAdmin} className="addAdmin">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address <sup className="sup">*</sup></Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password <sup className="sup">*</sup></Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Confirm Password <sup className="sup">*</sup></Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <p style={{color: "red",marginTop:"5%", marginBottom:"-2%"}}><sup>*</sup> Required Fields </p>
            <Button
              variant="primary"
              type="submit"
              className="addAdminFormButton"
            >
              Add Admin
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddAdmin;
