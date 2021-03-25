import React, { Component } from "react";
import { Nav } from "react-bootstrap";
import BookCard from "./bookCard";

class BookList extends Component {
  render() {
    if (this.props.books !== undefined && this.props.books.length === 0) {
      return (
        <div>
          <Nav.Link href="#home" className="listTitle">
            {this.props.title}
          </Nav.Link>
          <p className="noBooks">You Do Not Have Any Books Yet</p>
        </div>
      );
    } else {
      return (
        <div>
          <Nav.Link href="#home" className="listTitle">
            {this.props.title}
          </Nav.Link>
          <ul className="bookList">
            {this.props.books !== undefined &&
              this.props.books.map((
                {
                  name,
                  synopsis,
                  image_url,
                  author_name,
                  total_count,
                  available_count,
                  book_id,
                  isBookIssued,
                  isBookBookmarked,
                  isBookRead,
                } //arguments from database.
              ) => (
                <li key={book_id} className="bookCard">
                  <BookCard
                    bookName={name} //javascript variable after destructuring above as arguments.
                    bookImage={image_url} //passing props PtC
                    bookSynopsis={synopsis}
                    bookAuthor={author_name}
                    totalCount={total_count}
                    bookId={book_id}
                    availableCount={available_count}
                    isIssued={isBookIssued}
                    isRead={isBookRead}
                    isBookmarked={isBookBookmarked}
                  />
                </li>
              ))}
          </ul>
        </div>
      );
    }
  }
}

export default BookList;
