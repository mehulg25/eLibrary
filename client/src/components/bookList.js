import React, { Component } from "react";
import { Nav } from "react-bootstrap";
import BookCard from "./bookCard";

class BookList extends Component {
  render() {
    return (
      <div>
        <Nav.Link href="#home" className="listTitle">
          Books Published
        </Nav.Link>
        <ul className="bookList">
          {this.props.books.map(({ id, name, synopsis, image_url }) => ( //arguments from database.
            <li key={id} className="bookCard">
              <BookCard
                bookName={name} //javascript variable after destructuring above as arguments.
                bookImage={image_url} //passing props PtC
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
