import React, { useState, useEffect } from "react";
import { Container, Dropdown, Form, Nav } from "react-bootstrap";
import Axios from "axios";
import BookCard from "./bookCard";
import { useUserState } from "../UserContext";

const fetchUserReadBooks = () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };

  return Axios.get("/user-books.php?action=READ", config)
    .then((response) => {
      console.log(response);
      if (response != null) {
        return response.data.books;
      }
    })
    .catch((err) => console.log(err));
};

const getWeekOfMonth = (d) => {
  var firstWeekday = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
  var offsetDate = d.getDate() + firstWeekday - 1;
  return Math.floor(offsetDate / 7) + 1;
};

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

function ReadingHistory() {
  const { isAuthenticated, user } = useUserState();
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  // Axios.get("/readingHistory.php").then((response) => console.log(response));
  const [readBooks, setReadBooks] = useState([]);
  const [byMonthMap, setByMonthMap] = useState({});
  const [byWeekMap, setByWeekMap] = useState({});
  const [sortBy, setSortBy] = useState("MONTH");

  useEffect(() => {
    fetchUserReadBooks().then((userReadBooks) => {
      console.log(userReadBooks);
      setReadBooks(userReadBooks);

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

      const byWeek = {
        1: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        },
        2: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        },
        3: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        },
        4: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        },
        5: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        },
        6: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        },
        7: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        },
        8: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        },
        9: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        },
        10: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        },
        11: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        },
        12: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        },
      };
      userReadBooks &&
        userReadBooks.map((book) => {
          console.log(book);
          var d = new Date(book.book_read_timestamp * 1000);
          console.log("wom", getWeekOfMonth(d));
          byMonth[d.getMonth() + 1] = [...byMonth[d.getMonth() + 1], book];

          var obj = byWeek[d.getMonth() + 1];
          obj[getWeekOfMonth(d)] = [...obj[getWeekOfMonth(d)], book];
        });

      setByWeekMap(byWeek);
      setByMonthMap(byMonth);
    });
  }, []);

  if (!isAuthenticated) {
    return <div>Please Log In!</div>
  }

  return (
    <div>
      <Nav className="readingHistoryTitle">Reading History</Nav>
      <div className="sortBy">
        <Form.Label>Sort By</Form.Label>
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {sortBy}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSortBy("MONTH")}>
              Month
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortBy("WEEK")}>
              Week
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {sortBy === "MONTH" && (
        <div className="month">
          {" "}
          {Object.keys(monthNameMap).map((monthNumber) => (
            <div key={monthNumber}>
              <p>{monthNameMap[monthNumber]}</p>
              {byMonthMap[monthNumber] && byMonthMap[monthNumber].length > 0 ? (
                <ul className="readingHistoryBooks">
                  {byMonthMap[monthNumber] &&
                    byMonthMap[monthNumber].map((
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
                      } // arguments from database.
                    ) => (
                      <li key={book_id} className="bookCard">
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
                          isIssued={isBookIssued}
                          isRead={isBookRead}
                          isBookmarked={isBookBookmarked}
                          allowOpenCard={true}
                        />
                      </li>
                    ))}{" "}
                </ul>
              ) : (
                <p className="noBooks">You Do Not Have Any Books Yet.</p>
              )}{" "}
            </div>
          ))}{" "}
        </div>
      )}
      {sortBy === "WEEK" && (
        <Container className="weekContainer">
          {" "}
          {Object.keys(monthNameMap).map((monthNumber) => (
            <div key={monthNumber}>
              <p className="weekMonth">{monthNameMap[monthNumber]}</p>
              {byWeekMap[monthNumber][1].length === 0 &&
              byWeekMap[monthNumber][2].length === 0 &&
              byWeekMap[monthNumber][3].length === 0 &&
              byWeekMap[monthNumber][4].length === 0 &&
              byWeekMap[monthNumber][5].length === 0 &&
              byWeekMap[monthNumber][5].length === 0 ? (
                <p className="noBooksWeek">You Do Not Have Any Books Yet.</p>
              ) : (
                byMonthMap[monthNumber] &&
                Object.keys(byWeekMap[monthNumber]).map((week) => (
                  <>
                    <p className="week">Week {week}</p>
                    {byWeekMap[monthNumber][week].length === 0 ? (
                      <p className="noBooksWeek">
                        You Do Not Have Any Books Yet.
                      </p>
                    ) : (
                      <ul className="bookList">
                        {byWeekMap[monthNumber] &&
                          byWeekMap[monthNumber][week].map((
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
                            } // arguments from database.
                          ) => (
                            <li key={book_id} className="bookCard">
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
                                isIssued={isBookIssued}
                                isRead={isBookRead}
                                isBookmarked={isBookBookmarked}
                              />
                            </li>
                          ))}{" "}
                      </ul>
                    )}
                  </>
                ))
              )}{" "}
            </div>
          ))}{" "}
        </Container>
      )}
    </div>
  );
}

export default ReadingHistory;