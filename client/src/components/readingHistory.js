import React, { useState, useEffect } from "react";
import { Container, Dropdown, Form } from "react-bootstrap";
import Axios from "axios";
import BookCard from "./bookCard";
function ReadingHistory() {
  const [readBooks, setReadBooks] = useState([]);
  const [byMonthMap, setByMonthMap] = useState({});
  const [byWeekMap, setByWeekMap] = useState({});
  const [sortBy, setSortBy] = useState("MONTH");

  const monthNameMap = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };

    Axios.get("/user-books.php?action=READ", config)
      .then((response) => {
        if (response != null) {
          setReadBooks(response.data.books);
          // setByMonthMap(groupByMonth())
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (readBooks !== undefined) return;
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
      12: [],
    };
    readBooks &&
      readBooks.map((book) => {
        console.log(book);
        var d = new Date(book.book_read_timestamp * 1000);

        byMonth[d.getMonth() + 1] = [...byMonth[d.getMonth() + 1], book];
      });
    setByMonthMap(byMonth);
  }, [readBooks]);

  return (
    <div>
      {console.log(readBooks)}
      <Form.Label>Sort By</Form.Label>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Sort By
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setSortBy("MONTH")}>
            Month
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSortBy("WEEK")}>Week</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {readBooks && readBooks.length > 0 && sortBy === "MONTH" ? (
        <Container>
          {Object.keys(monthNameMap).map((month) => {
            return (
              <div key={month}>
                <p>{monthNameMap[month]}</p>
                {console.log(byMonthMap[month])}
                <ul className="bookList">
                  {byMonthMap[month].length > 0 &&
                    byMonthMap[month].map(
                      (
                        {
                          name,
                          synopsis,
                          image_url,
                          author_name,
                          total_count,
                          available_count,
                          book_id,
                        } // arguments from database.
                      ) => {
                        return (
                          <li key={book_id} className="bookCard">
                            {console.log("gy", book_id)}
                            <BookCard
                              bookName={name}
                              //javascript variable after destructuring above as arguments.
                              bookImage={image_url}
                              //passing props PtC
                              bookSynopsis={synopsis}
                              bookAuthor={author_name}
                              totalCount={total_count}
                              bookId={book_id}
                              availableCount={available_count}
                            />
                          </li>
                        );
                      }
                    )}{" "}
                </ul>
              </div>
            );
          })}
        </Container>
      ) : null}
    </div>
  );
}

export default ReadingHistory;
