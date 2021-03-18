import React, {useState, useEffect} from "react";
import BookList from "./bookList";
import AddBook from "./addBook";
import Axios from "axios";
import {useUserState} from "../UserContext";
function Dashboard() {

    const {isAuthenticated, user} = useUserState();

    const [allBooks, setAllBooks] = useState([]);
    const [shelf, setShelf] = useState([]);
    const [bookMarkedBooks, setBookMarkedBooks] = useState([]);
    const [readBooks, setReadBooks] = useState([]);
    const [currentlyIssuedBookId,setCurrentlyIssuedBookId] = useState(0);

    useEffect(() => {
        if (isAuthenticated) {
            Axios.get("/allBooks.php").then((response) => {
                console.log(response);
                if (response.data.books != undefined) {
                    response.data.books.map(book => {
                        book.book_id = book.id
                    })
                    setAllBooks(response.data.books)
                }
            }).catch(err => console.log(err));
            setCurrentlyIssuedBookId(user.currently_issued_bookid);
        }
    }, [isAuthenticated]);

    useEffect(() => {

        if (allBooks.length == 0) 
            return;
        

        if (isAuthenticated && allBooks !== undefined) {

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": localStorage.getItem("token")
                }
            };

            Axios.get("/user-books.php", config).then((response) => {

                if (response.data.books != undefined && response.data.books.length !== 0) {
                    response.data.books.map((book) => {
                        let foundBook = allBooks.find(function (b) {
                            return b.id == book.book_id;
                        });

                        if (foundBook !== undefined) {
                            book.image_url = foundBook.image_url;
                            book.name = foundBook.name;
                            book.synopsis = foundBook.synopsis;
                            book.book_id = foundBook.book_id
                        }
                    });
                    var issuedBooks = response.data.books.filter(function (b) {
                        return b.action_type === "ISSUED";
                    });
                    var bookMarkedBooks = response.data.books.filter(function (b) {
                        return b.action_type === "BOOKMARKED";
                    });
                    var readBooks = response.data.books.filter(function (b) {
                        return b.action_type === "READ";
                    });

                    setShelf(issuedBooks);
                    setBookMarkedBooks(bookMarkedBooks);
                    setReadBooks(readBooks);
                }
            }).catch((err) => console.log(err));
        }
    }, [allBooks]);

    const handleAddBook = (book) => {

        setAllBooks([
            book,
            ...allBooks
        ]);

    };

    const handleIssueBook = (obj) => {
        let foundBook = allBooks.find(book => {
            return book.book_id === obj.bookId
        });
        foundBook.available_count = obj.updatedAvailableCount;
        setCurrentlyIssuedBookId(obj.bookId)
        setShelf([foundBook])

    }

    const handleReturnBook = (obj) => {
        console.log(obj)
        let foundBook = allBooks.find(book => {
            return book.book_id === obj.bookId
        });
        foundBook.available_count = obj.updatedAvailableCount;
        setShelf([]);
    }

    if (!isAuthenticated) 
        return (
            <p>Please Login to Continue!</p>
        )

    return (

        <div>
            <BookList books={shelf}
                title="My Shelf"
                handleReturnBook={handleReturnBook}/>

            <BookList books={readBooks}
                title="Books Read"/>
            <BookList books={bookMarkedBooks}
                title="Saved For Later"/>
            <BookList books={allBooks}
                title="All Books"
                handleIssueBook={handleIssueBook}/> {
            isAuthenticated && user.role === "ADMIN" ? (
                <AddBook handleAddBook={handleAddBook}/>
            ) : null
        } </div>
    );

}

export default Dashboard;