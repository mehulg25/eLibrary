import React, { useState } from "react";
import { Card, Button, Modal, Row, Col, Container } from "react-bootstrap";
import Axios from "axios";
import { useUserState,useUserDispatch } from "../UserContext";
import {displayError,displaySuccess,useErrorDispatch} from '../ErrorContext'

function BookCard ({bookName,bookImage,bookSynopsis,bookAuthor,totalCount,bookId,availableCount,handleIssueBook,handleReturnBook,title}){

  const {isAuthenticated,user} = useUserState();
  // const dispatch = useUserDispatch();
  const errorDispatch = useErrorDispatch();
  const [modal,setModal] = useState();
  
  const toggle = () => {
    setModal(!modal);
  };
  const issueBook = () => {
    console.log(user)
    if(user.currently_issued_bookid !== null && user.currently_issued_bookid !== ''){
      displayError(errorDispatch,'Can\'t Issue Book since you already have one');
      return;
    }

    const config = {
      headers:{
        "Content-Type":"application/json",
        "x-auth-token":localStorage.getItem("token")
      }
    };
    var bookObj = {
      bookId: bookId,
      action: "ISSUED"
    };
    Axios.post(
      "/bookAction.php",bookObj,config).then((response) => {
        console.log(response);
        let obj = {
          bookId :bookId,
          updatedAvailableCount :availableCount-1
        }
        
        if(response.status === 200){
          displaySuccess(errorDispatch,'Book Successfully Issued!')
          handleIssueBook(obj);
          setModal(false);
        }else if(response.status == 202){
          displayError(errorDispatch,'Can\'t Issue Book  since you already have one')
          
       }
      })
      .catch((error) => {
        console.log(error);
        
      });
  };
  const returnBook = () => {

    if(user.currently_issued_bookid === ''){
      displayError(errorDispatch,'You don\'t have any book issued');
      return;
    }
    const config = {
      headers:{
        "Content-Type":"application/json",
        "x-auth-token":localStorage.getItem("token")
      }
    };
    var bookObj = {
      bookId: bookId,
      action: "RETURNED"
    };
    Axios.post(
      "/bookAction.php",bookObj,config).then((response) => {
        console.log(response);
        let obj = {
          bookId :bookId,
          updatedAvailableCount :availableCount+1
        }
        displaySuccess(errorDispatch,'Book Successfully Returned!')
        handleReturnBook(obj)
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
            <Card.Title style={{ height: "7vh" }}>
              {bookName}
            </Card.Title>
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
                    <p>{bookAuthor}</p>
                  </Row>
                  <Row>
                    <p>{bookSynopsis}</p>
                  </Row>
                  <Button variant="primary" onClick={issueBook}>
                    Issue
                  </Button>
                  {title === 'My Shelf' && bookId === user.currently_issued_bookid && (<Button variant="primary" onClick={returnBook} disabled={bookId !==user.currently_issued_bookid}>
                    Return 
                  </Button>)}
                  <Button variant="primary" onClick={toggle}>
                    Save for later
                  </Button>
                  <Button variant="primary" onClick={toggle}>
                    Mark as Read
                  </Button>
                  <Button variant="primary" onClick={toggle}>
                    Edit
                  </Button>
                  <Button variant="primary" onClick={toggle}>
                    Delete
                  </Button>
                </Col>
                <Col>
                  <Row>
                    <img
                      src={`../${bookImage}`}
                      height="500"
                      width="350"
                    />
                  </Row>
                  {title === 'All Books' && user.role === 'ADMIN' && (<Row>
                    <p>{availableCount}/{totalCount}</p>
                  </Row>)}
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
      </div>
    );
  
}

export default BookCard;