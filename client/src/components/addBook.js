import React, { Component } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import ImageUploader from "react-images-upload";
import Axios from "axios";

class AddBook extends Component {
  state = {
    modal: false,
    bookName: "", //emptty variables
    bookSynopsis: "",
    bookImage: "",
    alert: false,
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal, alert: false });
  };
  onChange = (e) => { // e is short for event. on___ are events. onchange pe event mil rha hai -> where change what change
    this.setState({ [e.target.name]: e.target.value }); // e.target means which form tag. e.target.name here name is bookName. Similar to response.data.books.
    //this.setState({bookName:e.target.value})    
    //this.setState({bookSynopsis:e.target.value})
    //e.target.value is anything that you type in input box
    // two way binding 
  };

  onDrop = (picture) => { // temporary variable to store image
    this.setState({
      bookImage: picture[0].name, // new variable for new book entry. picture[0].name came from console.
    });
  };
  addBook = (e) => { // e coz event as form function
    e.preventDefault(); //inbuilt function to prevent default submit for some time
    if ( // client side validation
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
      return; // do nothing and return to where you are called from if variables are empty
    }
    const { bookName, bookSynopsis, bookImage } = this.state; // destructuring variables in state into new to use in function and save code this.state.blah || const is constant object 
    var addBookObj = { // need object and not string as php is expecting 3 things at once as object.
      bookName, //bookName: bookName || new var which we have to send : state se aya hua destructured. 
      bookSynopsis,
      bookImage,
    };

    Axios.post("http://localhost:8080/eLibrary/server/addBook.php", addBookObj) //POST request passing object
      .then((response) => { // book added in db here
        var addedBookObj = { // this is for real time update in UI
          name: bookName, // left wale variables are database variables and right are object passed.
          image_url: bookImage,
          synopsis: bookSynopsis, // doubt : why these names for vars : Because addedBook ye render ho jae destructure jese booklist me map karaya hai vahi pe
        };
        this.props.handleAddBook(addedBookObj); // props from dashboard as handleaddbook is function in parent || PtoC and back CtoP
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
          show={this.state.modal} //show when value true
          onHide={this.toggle} //function call
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Publish Book
            </Modal.Title>
          </Modal.Header>
          <Modal.Body> {/* form inside modal body */}
            <Form onSubmit={this.addBook}>  {/* onSubmit call function addBook instead of onClick */}
              <ImageUploader
                withIcon={true}
                buttonText="Choose images"
                onChange={this.onDrop} //function call whenever image upload
                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                maxFileSize={5242880}
              />
              <Form.Group controlId="formBasicBookName">
                <Form.Label>Enter Book Name</Form.Label>
                <Form.Control // form control is nothing but an input box
                  name="bookName" // attribute for internal function denoting what the input box is for. same as state variables.
                  onChange={this.onChange} // function call saves value at every key press.
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
              <Button variant="primary" type="Publish"> {/* no need for onclick as button is inside form and there is a default behaviour on Submit */}
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
