import React, { useState, useEffect } from "react";
import BookList from "./bookList";
import AddBook from "./addBook";
import Axios from "axios";
import { useUserState, useUserDispatch, updateUserData } from "../UserContext";
import {
  loadAllBooks,
  updateAllBooks,
  useBooksDispatch,
  useBooksState,
} from "../BooksContext";
function Dashboard() {
  const { allBooks } = useBooksState();
  const booksDispatch = useBooksDispatch();

  const { isAuthenticated, user } = useUserState();
  const dispatch = useUserDispatch();
  const [allBooksSet, setAllBooksSet] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      Axios.get("/allBooks.php")
        .then((response) => {
          if (response.data.books != undefined) {
            response.data.books.map((book) => {
              book.book_id = book.id;
              book.isBookIssued = false;
              book.isBookBookmarked = false;
              book.isBookRead = false;
            });
            loadAllBooks(booksDispatch, response);
            setAllBooksSet(true);
          }
        })
        .catch((err) => console.log(err));
      // setCurrentlyIssuedBookId(user.currently_issued_bookid);
    }
  }, [user]);

  useEffect(() => {
    if (!allBooksSet || allBooks.length == 0) return;

    if (isAuthenticated && allBooks !== undefined) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      };

      Axios.get("/user-books.php", config)
        .then((response) => {
          if (
            response.data.books != undefined &&
            response.data.books.length !== 0
          ) {
            response.data.books.map((book) => {
              let foundBook = allBooks.find(function (b) {
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

  if (!isAuthenticated) return <p>Please Login to Continue!</p>;

  return (
    <div>
      {console.log(allBooks)}
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
      <BookList books={allBooks} title="All Books" />{" "}
      {isAuthenticated && user.role === "ADMIN" ? (
        <AddBook handleAddBook={handleAddBook} />
      ) : null}{" "}
    </div>
  );
}

export default Dashboard;
