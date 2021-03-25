import React, { useState } from "react";
import { Card, Button, Modal, Row, Col, Container } from "react-bootstrap";
import { mdiAccount } from "@mdi/js";
import Icon from "@mdi/react";

function AdminCard({ email, id, deleteAdmin }) {
  const [modal, setModal] = useState(false);

  return (
    <div className="adminList">
      <Card style={{ width: "18rem" }}>
        <Icon path={mdiAccount} size={10} />
        <Card.Body>
          <Card.Title style={{ height: "7vh" }}>{email}</Card.Title>
          <Button variant="primary" onClick={setModal}>
            View
          </Button>
        </Card.Body>
      </Card>
      <Modal
        show={modal}
        onHide={setModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{email}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="adminCard">
          <Container fluid>
            <Row>
              <Col>
                <Row>
                  <Icon path={mdiAccount} size={10} />
                </Row>
              </Col>
              <Col>
                <Row>
                  <Button>View Reading History</Button>
                </Row>
                <Row>
                  <Button>Manage Password</Button>
                </Row>
                <Row>
                  <Button onClick={() => deleteAdmin(id)}>Delete Admin</Button>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminCard;
