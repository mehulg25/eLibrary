import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useBooksState,useBooksDispatch,loadAllBooks,updateAllBooks} from '../BooksContext';
import BookList from './bookList';
import Axios from 'axios';
import {useUserState} from '../UserContext';

function ExpandedBookList() {

    const {allBooks} = useBooksState();
    const {expandedBooklistType} = useParams();
    const booksDispatch = useBooksDispatch();
    const [allBooksSet, setAllBooksSet] = useState(false);
    const {isAuthenticated, user} = useUserState();

    useEffect(() => {

        if (isAuthenticated) {
            Axios.get("/allBooks.php").then((response) => {

                if (response.data.books != undefined) {
                    response.data.books.map(book => {
                        book.book_id = book.id
                        book.isBookIssued = false;
                        book.isBookBookmarked = false;
                        book.isBookRead = false;

                    })
                    loadAllBooks(booksDispatch,response)
                    setAllBooksSet(true)
                }
            }).catch(err => console.log(err));
            // setCurrentlyIssuedBookId(user.currently_issued_bookid);
        }
    }, [user]);


    useEffect(() => {

        if (!allBooksSet || allBooks.length == 0) 
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
                            return b.book_id == book.book_id;
                        });
                        if(book.action_type==="ISSUED"){
                            foundBook.isBookIssued=true
                        }
                        if(book.action_type==="BOOKMARKED"){
                            foundBook.isBookBookmarked=true
                        }
                        if(book.action_type==="READ"){
                            foundBook.isBookRead=true
                        }

                })
                updateAllBooks(booksDispatch,allBooks);
            }
            }).catch((err) => console.log(err));
        }
    }, [allBooksSet]);

    
    if(expandedBooklistType === 'AllBooks'){
        return(
            <div>{console.log('hello4')}
            <BookList books={allBooks} styleClass="expandedList"/></div>
        )
    }

    if(expandedBooklistType === 'SavedForLater'){
        return(
            <div>{console.log('hello3')}
            <BookList books={allBooks.filter(b=>b.isBookBookmarked)} styleClass="expandedList"/></div>
        )
    }

    if(expandedBooklistType === 'BooksRead'){
        return(
            <div>{console.log('hello2')}
            <BookList books={allBooks.filter(b=>b.isBookRead)} styleClass="expandedList"/></div>
        )
    }

    return(
        <div>{console.log('hello')}
        <BookList books={allBooks} styleClass="expandedList"/></div>
        
    )
    
}

export default ExpandedBookList;