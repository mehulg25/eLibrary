import React, { Component } from "react";
import { Card, Button, Modal, Row, Col, Container } from "react-bootstrap";
import Axios from "axios";
import { UserStateContext } from "../UserContext";

class BookCard extends Component {
  static contextType = UserStateContext;
  state = {
    modal: false,
  };
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  issueBook = () => {
    var bookObj = {
      bookId: this.props.bookId,
      userId: this.context.user.id,
      action: "ISSUED",
    };
    Axios.post(
      "http://localhost:8080/eLibrary/server/bookAction.php",
      JSON.stringify(bookObj)
    )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  returnBook = () => {
    var bookObj = {
      bookId: this.props.bookId,
      userId: this.context.user.id,
      action: "RETURNED",
    };
    Axios.post(
      "http://localhost:8080/eLibrary/server/bookAction.php",
      JSON.stringify(bookObj)
    )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
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
                    <p>{this.props.bookAuthor}</p>
                  </Row>
                  <Row>
                    <p>{this.props.bookSynopsis}</p>
                  </Row>
                  <Button variant="primary" onClick={this.issueBook}>
                    Issue
                  </Button>
                  <Button variant="primary" onClick={this.returnBook}>
                    Return
                  </Button>
                  <Button variant="primary" onClick={this.toggle}>
                    Save for later
                  </Button>
                  <Button variant="primary" onClick={this.toggle}>
                    Mark as Read
                  </Button>
                  <Button variant="primary" onClick={this.toggle}>
                    Edit
                  </Button>
                  <Button variant="primary" onClick={this.toggle}>
                    Delete
                  </Button>
                </Col>
                <Col>
                  <Row>
                    <img
                      src={`../${this.props.bookImage}`}
                      height="500"
                      width="350"
                    />
                  </Row>
                  <Row>
                    <p>{this.props.totalCount}</p>
                  </Row>
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
