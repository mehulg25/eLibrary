import React from "react";
const BooksStateContext = React.createContext();

const BooksDispatchContext = React.createContext();

function BooksReducer(state, action) {
  switch (action.type) {
    case "loadAllBooks": {
      const allBooks = action.payload.books;
      const savedBooks = allBooks.filter((b) => b.isBookBookmarked);
      const readBooks = allBooks.filter((b) => b.isBookRead);
      const shelf = allBooks.filter((b) => b.isBookIssued);
      return {
        allBooks,
        savedBooks,
        readBooks,
        shelf,
      };
    }

    case "updateAllBooks": {
      const books = action.payload;
      return {
        allBooks: books,
      };
    }
  }
}

function BooksProvider({ children }) {
  const [state, dispatch] = React.useReducer(BooksReducer, {
    allBooks: [],
    readBooks: [],
    savedBooks: [],
    shelf: [],
  });
  return (
    <BooksStateContext.Provider value={state}>
      <BooksDispatchContext.Provider value={dispatch}>
        {children}
      </BooksDispatchContext.Provider>
    </BooksStateContext.Provider>
  );
}

function useBooksState() {
  const context = React.useContext(BooksStateContext);
  if (context === undefined) {
    throw new Error("e");
  }
  return context;
}

function useBooksDispatch() {
  const context = React.useContext(BooksDispatchContext);
  if (context === undefined) {
    throw new Error("e");
  }
  return context;
}

function loadAllBooks(dispatch, response) {
  dispatch({ type: "loadAllBooks", payload: response.data });
}

function updateAllBooks(dispatch, response) {
  dispatch({ type: "updateAllBooks", payload: response });
}

export {
  BooksProvider,
  useBooksState,
  useBooksDispatch,
  loadAllBooks,
  updateAllBooks,
};
