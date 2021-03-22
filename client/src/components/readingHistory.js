import React, {useState, useEffect} from 'react';
import {Container, Dropdown, Form} from 'react-bootstrap';
import Axios from 'axios';
import BookCard from './bookCard'
function ReadingHistory() {

    const [readBooks, setReadBooks] = useState([]);
    const [byMonthMap, setByMonthMap] = useState({})
    const [byWeekMap, setByWeekMap] = useState({})


    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem("token")
            }
        };


        Axios.get("/user-books.php?action=READ", config).then((response) => {


            if (response != null) {
                setReadBooks(response.data.books);
                // setByMonthMap(groupByMonth())
            }
        }).catch((err) => console.log(err));
    }, [])

    useEffect(() => {
        const byMonth = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
            10: [],
            11: [],
            12: []
        }
        readBooks.map(book => {
            console.log(book.book_read_timestamp)
            var d = new Date(book.book_read_timestamp * 1000);
            console.log(d.getMonth() + 1);
            byMonth[d.getMonth() + 1] = [
                ... byMonth[d.getMonth() + 1],
                book
            ]
        })
        setByMonthMap(byMonth)
    }, [readBooks]);


    // useEffect(() => {
      
    //     readBooks.map(book => {
    //         console.log(book.book_read_timestamp)
    //         var d = new Date(book.book_read_timestamp * 1000);
    //         console.log(d.getMonth() + 1);
    //         byMonth[d.getMonth() + 1] = [
    //             ... byMonth[d.getMonth() + 1],
    //             book
    //         ]
    //     })
    //     setByMonthMap(byMonth)
    // }, [readBooks]);

    return (
        <div> {
            console.log(byMonthMap)
        }
            <Form.Label>Sort By</Form.Label>
            <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    Sort By
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item>Month</Dropdown.Item>
                    <Dropdown.Item onClick={
                        () => console.log('Week')
                    }>Week</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <ul className="bookList">
                {
                readBooks !== undefined && readBooks.map(({
                    id,
                    name,
                    synopsis,
                    image_url,
                    author_name,
                    total_count,
                    available_count,
                    book_id
                } // arguments from database.
                ) => (
                    <li key={id}
                        className="bookCard">
                        <BookCard bookName={name}
                            //javascript variable after destructuring above as arguments.
                            bookImage={image_url}
                            //passing props PtC
                            bookSynopsis={synopsis}
                            bookAuthor={author_name}
                            totalCount={total_count}
                            bookId={book_id}
                            availableCount={available_count}
                            title="readBooks"/>
                    </li>
                ))
            } </ul>
        </div>
    )
}

export default ReadingHistory