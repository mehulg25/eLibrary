import React, { useState, useEffect } from "react";
import BookList from "./bookList";
import AddBook from "./addBook";
import Axios from "axios";
import { useUserState } from "../UserContext";
import { Container } from "react-bootstrap";
import {
  loadAllBooks,
  updateAllBooks,
  useBooksDispatch,
  useBooksState,
} from "../BooksContext";

function Dashboard() {
  const { allBooks } = useBooksState();
  const booksDispatch = useBooksDispatch();

  const { isAuthenticated, user, isActivated } = useUserState();
  const [allBooksSet, setAllBooksSet] = useState(false);

  // whatever is written inside useEffect will only happen after the first render of the component
  // booklist mount hua fir database se books lau
  useEffect(() => {
    if (isAuthenticated) {
      Axios.get("/allBooks.php")
        .then((response) => {
          if (response.status === 200) {
            response.data.books.map((book) => {
              // . karke jo likha voh new property ban jaegi object me
              book.book_id = book.id; // book id from database
              book.isBookIssued = false;
              book.isBookBookmarked = false;
              book.isBookRead = false;
            });
            loadAllBooks(booksDispatch, response); //updated books with these three properties.
            setAllBooksSet(true); // just to tell that books are set are not
          }
        })
        .catch((err) => console.log(err));
    }
  }, [user]); // this is a dependency array. as in whenever this variable changes, useeffect will be called again. Whenever user is NULL dont show books jese hi user update useffect will be called again

  useEffect(() => {
    if (!allBooksSet || allBooks.length == 0) return;

    if (isAuthenticated) {
      const config = {
        // object with a field headers which we are sending with axios. content-type is to tell that whatever data is in JSON
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
          // x-auth-token is to get token from local storage
        },
      };

      Axios.get("/user-books.php", config)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            response.data.books.map((book) => {
              //find is a js function
              let foundBook = allBooks.find(function (b) {
                // finding a particular book from all books in global state
                return b.book_id == book.book_id;
              });
              if (book.action_type === "ISSUED") {
                foundBook.isBookIssued = true;
              }
              if (book.action_type === "BOOKMARKED") {
                foundBook.isBookBookmarked = true;
              }
              if (book.action_type === "READ") {
                foundBook.isBookRead = true;
              }
            });
            updateAllBooks(booksDispatch, allBooks);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [allBooksSet]);

  const handleAddBook = (book) => {
    updateAllBooks(booksDispatch, [book, ...allBooks]);
  };

  if (isAuthenticated && isActivated == "0") {
    return (
      <Container>
        <h3>
          Please activate the account with the link sent to your mail to start
          using E-Library!
        </h3>
      </Container>
    );
  }

  if (!isAuthenticated) return <p>Please Login to Continue!</p>;

  return (
    <div>
      <BookList
        books={allBooks.filter((b) => b.isBookIssued)}
        title="My Shelf"
      />
      <BookList
        books={allBooks.filter((b) => b.isBookRead)}
        title="Books Read"
      />
      <BookList
        books={allBooks.filter((b) => b.isBookBookmarked)}
        title="Saved For Later"
      />
      <BookList books={allBooks} title="All Books" />
      {isAuthenticated && user.role === "ADMIN" ? (
        <AddBook handleAddBook={handleAddBook} />
      ) : null}
    </div>
  );
}

export default Dashboard;