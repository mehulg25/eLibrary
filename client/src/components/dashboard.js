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
  };
  componentDidMount() {
    //lifecycle method runs when copmponent is rendered once and again on every re render.
    console.log(this.context.user);
    Axios.get("http://localhost:8080/eLibrary/server/allBooks.php").then(
      (response) => {
        if (response.data.books != undefined) {
          this.setState({
            allBooks: response.data.books,
          });
        }
      }
    );
    const userObj = {
      id: 11,
    };
    console.log(userObj);
    Axios.post("http://localhost:8080/eLibrary/server/user-books.php", userObj)
      .then((response) => {
        let userBooks = response.data.books;
        console.log(userBooks);
        if (userBooks.length !== 0) {
          this.setState({ isNewUser: false });
        }
        userBooks.map((book) => {
          let foundBook = this.state.allBooks.find(function (b) {
            return b.id == book.book_id;
          });

          book.image_url = foundBook.image_url;
          book.name = foundBook.name;
          book.synopsis = foundBook.synopsis;
        });
        var issuedBooks = userBooks.filter(function (b) {
          return b.action_type === "ISSUED";
        });
        var bookMarkedBooks = userBooks.filter(function (b) {
          return b.action_type === "BOOKMARKED";
        });
        var readBooks = userBooks.filter(function (b) {
          return b.action_type === "READ";
        });
        this.setState({
          shelf: issuedBooks,
          bookMarkedBooks: bookMarkedBooks,
          readBooks: readBooks,
        });
      })
      .catch((err) => console.log(err));
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
        <BookList books={this.state.shelf} title="My Shelf" default={true} />
        {this.state.isNewUser && (
          <BookList
            books={this.state.allBooks}
            title="All Books"
            default={true}
          />
        )}
        <BookList books={this.state.readBooks} title="Books Read" />
        <BookList books={this.state.bookMarkedBooks} title="Saved For Later" />
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

export default Dashboard;
