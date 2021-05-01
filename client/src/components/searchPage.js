import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useBooksState,
  useBooksDispatch,
  loadAllBooks,
  updateAllBooks,
} from "../BooksContext";
import BookList from "./bookList";
import Axios from "axios";
import { useUserState } from "../UserContext";
import { useHistory } from "react-router-dom";
import { Pagination, Dropdown, Form } from "react-bootstrap";

function SearchBooks() {
  const handlePaginationClick = (e) => {
    setPage(e);
  };

  const { allBooks } = useBooksState();
  const { searchText } = useParams();
  const booksDispatch = useBooksDispatch();
  const [allBooksSet, setAllBooksSet] = useState(false);
  const { isAuthenticated, user } = useUserState();
  const history = useHistory();
  const [sortBy, setSortBy] = useState("asc");
  const [page, setPage] = useState(0);
  const [pagesCount, setPagesCount] = useState(1);

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
      Axios.get("/allBooks.php")
        .then((response) => {
          if (searchText !== undefined || searchText !== "") {
            var filteredBooks = response.data.books.filter((book) => {
              if (
                book.name.toLowerCase().indexOf(searchText.toLowerCase()) !==
                  -1 ||
                book.author_name
                  .toLowerCase()
                  .indexOf(searchText.toLowerCase()) !== -1
              )
                return book;
            });

            response.data.books = filteredBooks;
          }
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
  }, [user, searchText]);

  return (
    <div>
      <h2>
        <label>Search Results For :</label>
        {searchText}
      </h2>
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

      <BookList books={allBooks} styleClass="expandedList" />
      {paginationBasic}
    </div>
  );
}

export default SearchBooks;
