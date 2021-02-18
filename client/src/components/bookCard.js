import React, { Component } from "react";
import { Card, Button, Modal, Row, Col, Container } from "react-bootstrap";

class BookCard extends Component {
  state = {
    modal: false,
  };
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  render() {
    return (
      <div>
        <Card style={{ width: "18rem" }}>
          <Card.Img
            variant="top"
            src={`../${this.props.bookImage}`}
            width="400"
            height="400"
          />
          <Card.Body>
            <Card.Title style={{ height: "7vh" }}>
              {this.props.bookName}
            </Card.Title>
            <Button variant="primary" onClick={this.toggle}>
              View
            </Button>
          </Card.Body>
        </Card>
        <Modal
          show={this.state.modal}
          onHide={this.toggle}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {this.props.bookName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container fluid>
              <Row>
                <Col>
                  <Row>
                    <p>{this.props.bookSynopsis}</p>
                  </Row>
                </Col>
                <Col>
                  <img
                    src={`../${this.props.bookImage}`}
                    height="500"
                    width="350"
                  />
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default BookCard;
