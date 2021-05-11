import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  useBooksState,
  useBooksDispatch,
  loadAllBooks,
  updateAllBooks,
} from "../BooksContext";
import BookList from "./bookList";
import Axios from "axios";
import { useUserState } from "../UserContext";
import { Pagination, Dropdown, Form, Nav } from "react-bootstrap";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ExpandedBookList() {
  let query = useQuery();

  const handlePaginationClick = (e) => {
    setPage(e);
  };

  const { allBooks } = useBooksState();
  const { expandedBooklistType } = useParams();
  const booksDispatch = useBooksDispatch();
  const [allBooksSet, setAllBooksSet] = useState(false);
  const { isAuthenticated, user } = useUserState();
  const [page, setPage] = useState(0);
  const [pagesCount, setPagesCount] = useState(1);
  const [sortBy, setSortBy] = useState("asc");

  let items = [];
  for (let number = 0; number < pagesCount; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === page}
        onClick={() => handlePaginationClick(number)}
      >
        {number + 1}{" "}
      </Pagination.Item>
    );
  }

  const paginationBasic = (
    <div>
      <Pagination>{items}</Pagination>
      <br />
    </div>
  );

  useEffect(() => {
    if (isAuthenticated) {
      let url = "";
      var searchText = query.get("search") == null? "" : query.get("search");
      console.log(searchText);
      if (expandedBooklistType === "AllBooks") {
        url =
          "/allBooks.php?page=" +
          page +
          "&sortBy=" +
          sortBy +
          "&search=" +
          searchText;
      } else url = "/allBooks.php";
      Axios.get(url)
        .then((response) => {
          setPagesCount(response.data.pages);

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
  }, [user, page, sortBy, useLocation().search]);

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
              if (foundBook !== undefined) {
                if (book.action_type === "ISSUED") {
                  foundBook.isBookIssued = true;
                }
                if (book.action_type === "BOOKMARKED") {
                  foundBook.isBookBookmarked = true;
                }
                if (book.action_type === "READ") {
                  foundBook.isBookRead = true;
                }
              }
            });
            console.log(allBooks);
            updateAllBooks(booksDispatch, allBooks);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [allBooksSet]);

  if (expandedBooklistType === "AllBooks") {
    return (
      <div>
         <Nav className="readingHistoryTitle">All Books</Nav>
         <div  className="sortByAllBooks">
        <Form.Label>Sort By</Form.Label>
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {sortBy === "asc" ? "A-Z" : "Z-A"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSortBy("asc")}>
              Bookname : A-Z
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortBy("desc")}>
              Bookname : Z-A
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </div>
        <BookList books={allBooks} styleClass="expandedList" />{" "}
        {paginationBasic}
      </div>
    );
  }

  if (expandedBooklistType === "SavedForLater") {
    return (
      <div>
        <BookList
          books={allBooks.filter((b) => b.isBookBookmarked)}
          styleClass="expandedList"
        />
      </div>
    );
  }

  if (expandedBooklistType === "BooksRead") {
    return (
      <div>
        <BookList
          books={allBooks.filter((b) => b.isBookRead)}
          styleClass="expandedList"
        />
      </div>
    );
  }

  return (
    <div>
      <BookList books={allBooks} styleClass="expandedList" />
    </div>
  );
}

export default ExpandedBookList;