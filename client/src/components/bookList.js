import React, { Component } from "react";
import { Nav } from "react-bootstrap";
import BookCard from "./bookCard";

class BookList extends Component {
  render() {
    return (
      <div>
        <Nav.Link href="#home" style={{ color: "black" }}>
          Books Published
        </Nav.Link>
        <ul className="bookList">
          {this.props.books.map(({ id, name, synopsis, image_url }) => (
            <li key={id} className="bookCard">
              <BookCard
                bookName={name}
                bookImage={image_url}
                bookSynopsis={synopsis}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default BookList;
