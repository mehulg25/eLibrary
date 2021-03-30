import React from "react";
const BooksStateContext = React.createContext();

const BooksDispatchContext = React.createContext();

function BooksReducer(state, action) {
  switch (action.type) {
    case "loadAllBooks": {
      const books = action.payload.books;
      return {
        allBooks: books,
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
