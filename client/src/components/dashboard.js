import React, { useState, useEffect } from "react";
import BookList from "./bookList";
import AddBook from "./addBook";
import Axios from "axios";
import { useUserState, useUserDispatch, updateUserData } from "../UserContext";
function Dashboard() {
  const { isAuthenticated, user } = useUserState();
  const dispatch = useUserDispatch();
  const [allBooks, setAllBooks] = useState([]);
  const [shelf, setShelf] = useState([]);
  const [bookMarkedBooks, setBookMarkedBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [currentlyIssuedBookId, setCurrentlyIssuedBookId] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      Axios.get("/allBooks.php")
        .then((response) => {
          console.log(response);
          if (response.data.books != undefined) {
            response.data.books.map((book) => {
              book.book_id = book.id;
            });
            setAllBooks(response.data.books);
          }
        })
        .catch((err) => console.log(err));
      setCurrentlyIssuedBookId(user.currently_issued_bookid);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (allBooks.length == 0) return;

    if (isAuthenticated && allBooks !== undefined) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      };

      Axios.get("/user-books.php", config)
        .then((response) => {
          console.log(response);
          if (
            response.data.books != undefined &&
            response.data.books.length !== 0
          ) {
            response.data.books.map((book) => {
              let foundBook = allBooks.find(function (b) {
                return b.id == book.book_id;
              });

              if (foundBook !== undefined) {
                book.image_url = foundBook.image_url;
                book.name = foundBook.name;
                book.synopsis = foundBook.synopsis;
                book.book_id = foundBook.book_id;
                foundBook.action_type = book.action_type;
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
            console.log(allBooks);
            if (issuedBooks.length > 0) setShelf(issuedBooks);
            if (bookMarkedBooks.length > 0) setBookMarkedBooks(bookMarkedBooks);
            if (readBooks.length > 0) setReadBooks(readBooks);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [allBooks]);

  const handleAddBook = (book) => {
    console.log(book);
    setAllBooks([book, ...allBooks]);
  };

  const handleIssueBook = (obj) => {
    let foundBook = allBooks.find((book) => {
      return book.book_id === obj.bookId;
    });
    foundBook.available_count = obj.updatedAvailableCount;
    setCurrentlyIssuedBookId(obj.bookId);
    setShelf([foundBook]);
    user.currently_issued_bookid = foundBook.book_id;
    updateUserData(dispatch, user);
  };

  const handleReturnBook = (obj) => {
    console.log(obj);
    let foundBook = allBooks.find((book) => {
      return book.book_id === obj.bookId;
    });
    foundBook.available_count = obj.updatedAvailableCount;
    setShelf([]);
    user.currently_issued_bookid = null;
    updateUserData(dispatch, user);
  };

  const handleBookmarkBook = (obj) => {
    console.log(bookMarkedBooks);
    let foundBook = allBooks.find((book) => {
      return book.book_id === obj.bookId;
    });
    foundBook.action_type = "BOOKMARKED";
    setAllBooks(allBooks);
    console.log(shelf,allBooks)
    setShelf(shelf)
    setBookMarkedBooks([...bookMarkedBooks, foundBook]);
  };

  const handleDeleteBook = (obj) => {
    let updatedBooks = allBooks.filter((book) => book.book_id !== obj.id);
    setAllBooks(updatedBooks);
  };

  const handleUnsaveBook = (obj) => {
    let foundBook = allBooks.find((book) => {
      return book.book_id === obj.id;
    });
    foundBook.action_type = "";
    setAllBooks(allBooks);
    let updatedBooks = bookMarkedBooks.filter(
      (book) => book.book_id !== obj.id
    );
    setBookMarkedBooks(updatedBooks);
  };

  if (!isAuthenticated) return <p>Please Login to Continue!</p>;

  return (
    <div>
      <BookList
        books={shelf}
        title="My Shelf"
        handleReturnBook={handleReturnBook}
        handleDeleteBook={handleDeleteBook}
        handleUnsaveBook={handleUnsaveBook}
        handleBookmarkBook={handleBookmarkBook}
      />
      <BookList
        books={readBooks}
        handleDeleteBook={handleDeleteBook}
        handleUnsaveBook={handleUnsaveBook}
        handleBookmarkBook={handleBookmarkBook}
        title="Books Read"
      />
      <BookList
        books={bookMarkedBooks}
        handleDeleteBook={handleDeleteBook}
        handleUnsaveBook={handleUnsaveBook}
        
        title="Saved For Later"
      />
      <BookList
        books={allBooks}
        handleDeleteBook={handleDeleteBook}
        title="All Books"
        handleIssueBook={handleIssueBook}
        handleReturnBook={handleReturnBook}
        handleBookmarkBook={handleBookmarkBook}
        handleUnsaveBook={handleUnsaveBook}
      />{" "}
      {isAuthenticated && user.role === "ADMIN" ? (
        <AddBook handleAddBook={handleAddBook} />
      ) : null}{" "}
    </div>
  );
}

export default Dashboard;
