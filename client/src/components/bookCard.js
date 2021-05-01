import React, { useState } from "react";
import {
  Card,
  Button,
  Modal,
  Row,
  Col,
  Container,
  Form,
} from "react-bootstrap";
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
import ImageUploader from "react-images-upload";

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
  const [edit, setEdit] = useState(false);
  const [editBookName, setBookName] = useState(bookName);
  const [editBookSynopsis, setBookSynopsis] = useState(bookSynopsis);
  const [editBookAuthor, setBookAuthor] = useState(bookAuthor);
  const [editBookImage, setBookImage] = useState(bookImage);

  const toggle = () => {
    setModal(!modal);
    setEdit(false);
  };

  const onDrop = (picture) => {
    console.log(picture);

    setBookImage(picture[0].name);
    picture.splice(0, 1);
  };

  const editBook = () => {
    if (
      editBookName === "" ||
      editBookAuthor === "" ||
      editBookSynopsis === ""
    ) {
      displayError(errorDispatch, "Fields cannot be empty");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    const obj = {
      bookId,
      bookName: editBookName,
      bookSynopsis: editBookSynopsis,
      bookImage: editBookImage,
      bookAuthor: editBookAuthor,
      totalCount,
    };
    Axios.post("/addBook.php", obj).then((response) => {
      console.log(response);
      if (response.status == 200) {
        displaySuccess(errorDispatch, response.data.msg);
        let foundBook = allBooks.find((b) => b.book_id === bookId);
        console.log(foundBook);
        foundBook.name = editBookName;
        foundBook.synopsis = editBookSynopsis;
        foundBook.author_name = editBookAuthor;
        foundBook.image_url = editBookImage;
        updateAllBooks(booksDispatch, allBooks);
      } else {
        displayError(errorDispatch, response.data.msg);
      }

      setEdit(false);
    });
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
      <Card style={{ width: "18rem" }} className="bookCardFrame">
        <Card.Img
          variant="top"
          src={`../${editBookImage}`}
          width="400"
          height="400"
          className="bookCardImg"
        />
        <Card.Body>
          <Card.Title style={{ height: "10vh" }} className="bookName">
            {bookName}
          </Card.Title>
          <Button variant="primary" onClick={toggle} className="bookCardButton">
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
            {edit ? (
              <>
                <Form.Label>Enter Book Name</Form.Label>
                <Form.Control
                  name="bookName"
                  onChange={(e) => setBookName(e.target.value)}
                  type="text"
                  value={editBookName}
                  placeholder="Enter Book Name"
                />
              </>
            ) : (
              bookName
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bookModalBody">
          <Container fluid>
            {/* <Row> */}
            <Col className="bookModalBodyCol">
              <Row>
                <img src={`../${editBookImage}`} height="380" width="270" />
                {edit ? (
                  <ImageUploader
                    withIcon={false}
                    buttonText="Change Cover Image"
                    onChange={onDrop} //function call whenever image upload
                    imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                    maxFileSize={5242880}
                  />
                ) : null}
              </Row>
              <Row style={{ marginTop: "5%" }}>
                {edit ? (
                  <>
                    <Form.Label>Author(s)</Form.Label>
                    <Form.Control
                      name="bookAuthor"
                      onChange={(e) => setBookAuthor(e.target.value)}
                      type="text"
                      value={editBookAuthor}
                      placeholder="Enter Author name(s)"
                    />
                  </>
                ) : (
                  <p>
                    {" "}
                    <b>Author : </b> {bookAuthor}
                  </p>
                )}
              </Row>
              <Row className="synopsis">
                {edit ? (
                  <>
                    <Form.Label>Synopsis</Form.Label>
                    <Form.Control
                      name="bookSynopsis"
                      onChange={(e) => setBookSynopsis(e.target.value)}
                      type="text"
                      as="textarea"
                      rows={10}
                      value={editBookSynopsis}
                      placeholder="Enter Synopsis"
                    />
                  </>
                ) : (
                  <p>
                    <b>Synopsis </b> <br></br> {bookSynopsis}
                  </p>
                )}
              </Row>
              <Row>
                <p>
                  <b>Available Copies : </b>
                  {availableCount}/{totalCount}
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
                      {edit ? (
                        <Button onClick={editBook}>Done</Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => setEdit(!edit)}
                          style={{
                            borderColor: "orange",
                            backgroundColor: "orange",
                          }}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="primary"
                        onClick={deleteBook}
                        style={{ borderColor: "red", backgroundColor: "red" }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Col>

            {/* </Row> */}
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default BookCard;
