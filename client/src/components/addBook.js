import React, { Component } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import ImageUploader from "react-images-upload";
import Axios from "axios";

class AddBook extends Component {
  state = {
    modal: false,
    bookName: "",
    bookSynopsis: "",
    bookImage: "",
    alert: false,
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal, alert: false });
  };
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onDrop = (picture) => {
    this.setState({
      bookImage: picture[0].name,
    });
  };
  addBook = (e) => {
    e.preventDefault();
    if (
      this.state.bookName == "" ||
      this.state.bookSynopsis == "" ||
      this.state.bookImage == ""
    ) {
      this.setState({
        alert: true,
      });
      setTimeout(() => {
        this.setState({
            alert: false
        })
     }, 2000)
      return;
    }
    console.log("add book called");
    const { bookName, bookSynopsis, bookImage } = this.state;
    var addBookObj = {
      bookName,
      bookSynopsis,
      bookImage,
    };

    Axios.post("http://localhost:8080/eLibrary/server/addBook.php", addBookObj)
      .then((response) => {
        console.log(response);
        var addedBookObj = {
          name: bookName,
          image_url: bookImage,
          synopsis: bookSynopsis,
        };
        console.log(addBookObj);
        this.props.handleAddBook(addedBookObj);
        this.setState({
          bookName: "",
          bookSynopsis: "",
          bookImage: "",
        });
        this.toggle();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <div>
        <button className="addButton" onClick={this.toggle}>
          +
        </button>
        <Modal
          show={this.state.modal}
          onHide={this.toggle}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Publish Book
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.addBook}>
              <ImageUploader
                withIcon={true}
                buttonText="Choose images"
                onChange={this.onDrop}
                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                maxFileSize={5242880}
              />
              <Form.Group controlId="formBasicBookName">
                <Form.Label>Enter Book Name</Form.Label>
                <Form.Control
                  name="bookName"
                  onChange={this.onChange}
                  type="bookName"
                  placeholder="Enter Book Name"
                />
              </Form.Group>

              <Form.Group controlId="formBasicSynopsis">
                <Form.Label>Synopsis</Form.Label>
                <Form.Control
                  name="bookSynopsis"
                  onChange={this.onChange}
                  type="bookSynopsis"
                  placeholder="Enter Synopsis"
                />
              </Form.Group>
              <Alert
                show={this.state.alert}
                className="failAlert"
                variant="danger"
              >
                Please check Fields!
              </Alert>
              <Button variant="primary" type="Publish">
                Publish
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default AddBook;
