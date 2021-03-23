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
                { id, name, synopsis, image_url, author_name, total_count,available_count,book_id,action_type } //arguments from database.
              ) => (
                <li key={id} className="bookCard">
                  <BookCard
                    bookName={name} //javascript variable after destructuring above as arguments.
                    bookImage={image_url} //passing props PtC
                    bookSynopsis={synopsis}
                    bookAuthor={author_name}
                    totalCount={total_count}
                    bookId={book_id}
                    availableCount = {available_count}
                    handleIssueBook = {this.props.handleIssueBook}
                    handleReturnBook = {this.props.handleReturnBook}
                    handleBookmarkBook = {this.props.handleBookmarkBook}
                    title={this.props.title}
                    action_type={action_type}
                    handleDeleteBook={this.props.handleDeleteBook}
                    handleUnsaveBook={this.props.handleUnsaveBook}
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