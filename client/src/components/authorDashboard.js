import React, { Component } from "react";
import BookList from "./bookList";
import AddBook from "./addBook";
import Axios from "axios";
import { Alert } from "react-bootstrap";
class AuthorDashboard extends Component {
  state = {
    books: [],
    showAlert: false
  };
  componentDidMount() { //lifecycle method runs when copmponent is rendered once and again on every re render.
    Axios.get("http://localhost:8080/eLibrary/server/allBooks.php").then(
      (response) => {
        if (response.data.books != undefined) {
          this.setState({
            books: response.data.books,
          });
        }
      }
    );
  }

  handleAddBook = (book) => { // book that is added just now taken from addedBook in addBook as CtoP
    this.setState({
      books: [book, ...this.state.books], // ... is spread operator. Book fell jaengi yahi pe array me 
      showAlert: true
    });
    setTimeout(() => {
      this.setState({
          showAlert: false
      })
   }, 2000)
  };

  closeAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    return (
      <div>
        <BookList books={this.state.books} />
        <AddBook handleAddBook={this.handleAddBook} />
        {/*passing Parent to child as a prop*/}
        <Alert
          className="successAlert"
          onClose={this.closeAlert}
          show={this.state.showAlert}
          variant="success"
          dismissible
        >
          Book Published
        </Alert>
      </div>
    );
  }
}

export default AuthorDashboard;
