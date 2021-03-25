import React, { useState } from "react";
import { Card, Button, Modal, Row, Col, Container } from "react-bootstrap";
import Axios from "axios";
import { useUserState, useUserDispatch, updateUserData } from "../UserContext";
import {
  displayError,
  displaySuccess,
  useErrorDispatch,
} from "../ErrorContext";
import {
  useBooksDispatch,
  useBooksState,
  updateAllBooks,
} from "../BooksContext";

function BookCard({
  bookName,
  bookImage,
  bookSynopsis,
  bookAuthor,
  totalCount,
  bookId,
  availableCount,
  isIssued,
  isRead,
  isBookmarked,
}) {
  const { isAuthenticated, user } = useUserState();
  const dispatch = useUserDispatch();
  const { allBooks } = useBooksState();
  const booksDispatch = useBooksDispatch();
  const errorDispatch = useErrorDispatch();
  const [modal, setModal] = useState();

  const toggle = () => {
    setModal(!modal);
  };
  const unsaveBook = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var bookObj = {
      bookId: bookId,
      action: "UNSAVE",
    };
    Axios.post("/bookAction.php", JSON.stringify(bookObj), config)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          displaySuccess(errorDispatch, response.data.msg);

          let thisBook = allBooks.find((b) => b.book_id === bookId);
          thisBook.isBookBookmarked = false;
          updateAllBooks(booksDispatch, allBooks);
        } else if (response.status == 202) {
          displayError(errorDispatch, response.data.msg);
        } else if (response.status == 203) {
          displayError(errorDispatch, response.data.msg);
        } else if (response.status == 401) {
          displayError(errorDispatch, response.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteBook = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var bookObj = {
      id: bookId,
    };
    Axios.post("/deleteBook.php", JSON.stringify(bookObj, config))
      .then((response) => {
        if (response.status === 200) {
          let updatedBooks = allBooks.filter((book) => book.book_id !== bookId);
          updateAllBooks(booksDispatch, updatedBooks);
          displaySuccess(errorDispatch, response.data.msg);
        } else if (response.status === 403) {
          displayError(errorDispatch, response.data.msg);
        } else {
          displayError(errorDispatch, response.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const saveBookForLater = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var bookObj = {
      bookId: bookId,
      action: "BOOKMARKED",
    };
    Axios.post("/bookAction.php", JSON.stringify(bookObj), config)
      .then((response) => {
        console.log(response);

        if (response.status === 200) {
          displaySuccess(errorDispatch, response.data.msg);

          let thisBook = allBooks.find((b) => b.book_id === bookId);
          thisBook.isBookBookmarked = true;
          updateAllBooks(booksDispatch, allBooks);
        } else if (response.status == 202) {
          displayError(errorDispatch, response.data.msg);
        } else if (response.status == 203) {
          displayError(errorDispatch, response.data.msg);
        } else if (response.status == 401) {
          displayError(errorDispatch, response.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const issueBook = () => {
    if (
      user.currently_issued_bookid !== null &&
      user.currently_issued_bookid !== ""
    ) {
      displayError(
        errorDispatch,
        "Can't Issue Book since you already have one"
      );
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var bookObj = {
      bookId: bookId,
      action: "ISSUED",
    };
    Axios.post("/bookAction.php", JSON.stringify(bookObj), config)
      .then((response) => {
        console.log(response);

        if (response.status === 200) {
          displaySuccess(errorDispatch, "Book Successfully Issued!");

          let thisBook = allBooks.find((b) => b.book_id === bookId);
          thisBook.isBookIssued = true;
          thisBook.available_count = availableCount - 1;
          updateAllBooks(booksDispatch, allBooks);
          user.currently_issued_bookid = thisBook.book_id;
          updateUserData(dispatch, user);
          setModal(false);
        } else if (response.status == 202) {
          displayError(errorDispatch, response.data.msg);
        } else if (response.status == 203) {
          displayError(errorDispatch, response.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const returnBook = () => {
    if (user.currently_issued_bookid === "") {
      displayError(errorDispatch, "You don't have any book issued");
      return;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var bookObj = {
      bookId: bookId,
      action: "RETURNED",
    };
    Axios.post("/bookAction.php", bookObj, config)
      .then((response) => {
        if (response.status === 200) {
          displaySuccess(errorDispatch, "Book Successfully Returned!");

          let thisBook = allBooks.find((b) => b.book_id === bookId);
          thisBook.isBookIssued = false;
          thisBook.available_count = parseInt(availableCount) + 1;
          updateAllBooks(booksDispatch, allBooks);
          user.currently_issued_bookid = null;
          updateUserData(dispatch, user);
          setModal(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const markBookAsRead = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var bookObj = {
      bookId: bookId,
      action: "READ",
    };

    Axios.post("/bookAction.php", bookObj, config)
      .then((response) => {
        if (response.status === 200) {
          displaySuccess(errorDispatch, "Book Successfully Marked As Read!");

          let thisBook = allBooks.find((b) => b.book_id === bookId);
          thisBook.isBookRead = true;
          updateAllBooks(booksDispatch, allBooks);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const markBookAsUnRead = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var bookObj = {
      bookId: bookId,
      action: "UNREAD",
    };

    Axios.post("/bookAction.php", bookObj, config)
      .then((response) => {
        if (response.status === 200) {
          displaySuccess(errorDispatch, "Book Successfully Marked As Un-Read!");

          let thisBook = allBooks.find((b) => b.book_id === bookId);
          thisBook.isBookRead = false;
          updateAllBooks(booksDispatch, allBooks);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Card style={{ width: "18rem" }}>
        <Card.Img
          variant="top"
          src={`../${bookImage}`}
          width="400"
          height="400"
        />
        <Card.Body>
          <Card.Title style={{ height: "10vh" }}>{bookName}</Card.Title>
          <Button variant="primary" onClick={toggle}>
            View
          </Button>
        </Card.Body>
      </Card>
      <Modal
        show={modal}
        onHide={toggle}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {bookName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col>
                <Row>
                  <p>
                    {" "}
                    <b>Author : </b> {bookAuthor}
                  </p>
                </Row>
                <Row className="synopsis">
                  <p>
                    <b>Synopsis </b> <br></br> {bookSynopsis}
                  </p>
                </Row>
                <div className="bookCardButtons">
                  {isIssued ? null : (
                    <Button variant="primary" onClick={issueBook}>
                      Issue
                    </Button>
                  )}
                  {isIssued && (
                    <Button variant="primary" onClick={returnBook}>
                      Return
                    </Button>
                  )}
                  {isBookmarked ? (
                    <Button variant="primary" onClick={unsaveBook}>
                      Unsave
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={saveBookForLater}>
                      Save
                    </Button>
                  )}

                  {isRead ? (
                    <Button variant="primary" onClick={markBookAsUnRead}>
                      Unread
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={markBookAsRead}>
                      Read
                    </Button>
                  )}
                  <div className="adminButtons">
                    {isAuthenticated && user.role === "ADMIN" && (
                      <>
                        <Button variant="primary" onClick={toggle}>
                          Edit
                        </Button>
                        <Button variant="primary" onClick={deleteBook}>
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Col>
              <Col className="bookCardRight">
                <Row>
                  <img src={`../${bookImage}`} height="500" width="350" />
                </Row>
                <Row>
                  <p>
                    <b>Available Copies : </b>
                    {availableCount}/{totalCount}
                  </p>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default BookCard;
