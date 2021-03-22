import React, { useState } from "react";
import { Card, Button, Modal, Row, Col, Container } from "react-bootstrap";
import Axios from "axios";
import { useUserState,useUserDispatch } from "../UserContext";
import {displayError,displaySuccess,useErrorDispatch} from '../ErrorContext'

function BookCard ({bookName,bookImage,bookSynopsis,bookAuthor,totalCount,bookId,availableCount,handleIssueBook,handleReturnBook,title,handleBookmarkBook,action_type}){

  const {isAuthenticated,user} = useUserState();
  // const dispatch = useUserDispatch();
  const errorDispatch = useErrorDispatch();
  const [modal,setModal] = useState();
  
  const toggle = () => {
    setModal(!modal);
  };

  const saveBookForLater = () =>{

    const config = {
      headers:{
        "Content-Type":"application/json",
        "x-auth-token":localStorage.getItem("token")
      }
    };
    var bookObj = {
      bookId: bookId,
      action: "BOOKMARKED"
    };
    Axios.post(
      "/bookAction.php",JSON.stringify(bookObj),config).then((response) => {
        console.log(response);
        let obj = {
          bookId :bookId
        }
        console.log(obj)
        if(response.status === 200){
          displaySuccess(errorDispatch,response.data.msg)
          handleBookmarkBook(obj);
          setModal(false);
        }else if(response.status == 202){
          displayError(errorDispatch,response.data.msg)
          
       }else if(response.status == 203){
        displayError(errorDispatch,response.data.msg)
        
     }
      })
      .catch((error) => {
        console.log(error);
        
      });
  }

  const issueBook = () => {
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
      "/bookAction.php",JSON.stringify(bookObj),config).then((response) => {
        console.log(response);
        let obj = {
          bookId :bookId,
          updatedAvailableCount :availableCount-1
        }
        console.log(obj)
        if(response.status === 200){
          displaySuccess(errorDispatch,'Book Successfully Issued!')
          handleIssueBook(obj);
          setModal(false);
        }else if(response.status == 202){
          displayError(errorDispatch,response.data.msg)
          
       }else if(response.status == 203){
        displayError(errorDispatch,response.data.msg)
        
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
        console.log(availableCount)
        let obj = {
          bookId :bookId,
          updatedAvailableCount :availableCount+1
        }
        displaySuccess(errorDispatch,'Book Successfully Returned!')
        handleReturnBook(obj);
        // toggle()
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
                    <p> <b>Author : </b> {bookAuthor}</p>
                  </Row>
                  <Row className="synopsis">
                    <p><b>Synopsis  </b> <br></br> {bookSynopsis}</p>
                  </Row>
                  <div className = "bookCardButtons">
                  {bookId === user.currently_issued_bookid ? null : (<Button variant="primary" onClick={issueBook}>
                    Issue
                  </Button>)}
                  { bookId === user.currently_issued_bookid && (<Button variant="primary" onClick={returnBook} disabled={bookId !==user.currently_issued_bookid}>
                    Return 
                  </Button>)}
                  {action_type === 'BOOKMARKED'?(<Button variant="primary" onClick={saveBookForLater}>
                    Save
                  </Button>):(<Button variant="primary" onClick={saveBookForLater}>
                    Unsave
                  </Button>)}
                  <Button variant="primary" onClick={toggle}>
                    {title !== 'readBooks' ? 'Read' :'Unread'}
                  </Button>
                  <div className="adminButtons">
                 {isAuthenticated && user.role === 'ADMIN' && ( <><Button variant="primary" onClick={toggle}>
                    Edit
                  </Button>
                  <Button variant="primary" onClick={toggle}>
                    Delete
                  </Button></>) }
                  </div>
                  </div>
                </Col>
                <Col className = "bookCardRight">
                  <Row>
                    <img
                      src={`../${bookImage}`}
                      height="500"
                      width="350"
                    />
                  </Row>
                  <Row>
                    <p><b>Available Count : </b>{availableCount}/{totalCount}</p>
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