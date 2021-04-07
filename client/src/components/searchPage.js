import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useBooksState,useBooksDispatch,loadAllBooks,updateAllBooks} from '../BooksContext';
import BookList from './bookList';
import Axios from 'axios';
import {useUserState} from '../UserContext';

function SearchBooks() {

    const {allBooks} = useBooksState();
    const {searchText} = useParams();
    const booksDispatch = useBooksDispatch();
    const [allBooksSet, setAllBooksSet] = useState(false);
    const {isAuthenticated, user} = useUserState();

    useEffect(() => {

        if (isAuthenticated) {
            Axios.get("/allBooks.php").then((response) => {

                var filteredBooks = response.data.books.filter(book=>{
                    if(book.name.toLowerCase().indexOf(searchText) !== -1 || book.author_name.toLowerCase().indexOf(searchText) !== -1)
                        return book;
                })

                response.data.books = filteredBooks
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
    }, [user,searchText]); 


    return(
        <div>{console.log('hello')}
        <BookList books={allBooks} styleClass="expandedList"/></div>

    )

}

export default SearchBooks;