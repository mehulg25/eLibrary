import React, { Component } from "react";
import BookList from "./bookList";
import AddBook from "./addBook";
import Axios from "axios";
import { Alert } from "react-bootstrap";
import { useUserState, UserStateContext } from "../UserContext";
class Dashboard extends Component {
  static contextType = UserStateContext;
  state = {
    allBooks: [],
    showAlert: false,
    shelf: [],
    isNewUser: true,
    bookMarkedBooks: [],
    readBooks: [],
    currently_issued_bookid: "",
  };
  componentDidMount() {
    let value = this.context;
    console.log(value);
    Axios.get("http://localhost:8080/eLibrary/server/allBooks.php").then(
      (response) => {
        //console.log(response);
        if (response.data.books != undefined) {
          this.setState({
            allBooks: response.data.books,
          });
        }
      }
    );
    console.log(this.context);
    if (this.context.user != null) {
      const userObj = {
        id: this.context.user != null ? this.context.user.id : 0,
      };
      ////console.log(userObj);
      Axios.post(
        "http://localhost:8080/eLibrary/server/user-books.php",
        userObj
      ).then((response) => {
        console.log(response);
        // let userBooks = response.data.books;

        if (
          response.data.books != undefined &&
          response.data.books.length !== 0
        ) {
          this.setState({ isNewUser: false });
          response.data.books.map((book) => {
            let foundBook = this.state.allBooks.find(function (b) {
              return b.id == book.book_id;
            });

            if (foundBook !== undefined) {
              book.image_url = foundBook.image_url;
              book.name = foundBook.name;
              book.synopsis = foundBook.synopsis;
            }
          });
          var issuedBooks = response.data.books.filter(function (b) {
            return b.action_type === "ISSUED";
          });
          var bookMarkedBooks = response.data.books.filter(function (b) {
            return b.action_type === "BOOKMARKED";
          });
          var readBooks = response.data.books.filter(function (b) {
            return b.action_type === "READ";
          });
          this.setState({
            shelf: issuedBooks,
            bookMarkedBooks: bookMarkedBooks,
            readBooks: readBooks,
          });
        }
      });
      // .catch((err) => //console.log(err));
    }
  }

  handleAddBook = (book) => {
    // book that is added just now taken from addedBook in addBook as CtoP
    this.setState({
      allBooks: [book, ...this.state.allBooks], // ... is spread operator. Book fell jaengi yahi pe array me
      showAlert: true,
    });
    setTimeout(() => {
      this.setState({
        showAlert: false,
      });
    }, 2000);
  };

  closeAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    return (
      <div>
        <BookList books={this.state.shelf} title="My Shelf" />

        <BookList books={this.state.readBooks} title="Books Read" />
        <BookList books={this.state.bookMarkedBooks} title="Saved For Later" />
        <BookList books={this.state.allBooks} title="All Books" />
        {this.context.isAuthenticated && this.context.user.role === "ADMIN" ? (
          <AddBook handleAddBook={this.handleAddBook} />
        ) : null}
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

Dashboard.contextType = UserStateContext;
export default Dashboard;
