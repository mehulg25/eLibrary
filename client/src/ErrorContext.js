import React from "react";
const ErrorStateContext = React.createContext(); //context banaya for global state

const ErrorDispatchContext = React.createContext(); // context banaya for action

//errorReducer is for cases
//usereducer ko reducer chhaiye voh ye hai for type.
function ErrorReducer(state, action) {
  switch (action.type) {
    case "error": {
      const msg = action.payload; // payload= config here which is the message
      return {
        showAlert: true,
        variant: "danger",
        msg,
      };
    }
    case "success": {
      const msg = action.payload;
      return {
        showAlert: true,
        variant: "success",
        msg,
      };
    }

    case "hide": {
      return {
        showAlert: false,
      };
    }
  }
}

function ErrorProvider({ children }) {
  // children right now is app.js kind of. Provider ka kaam hai apne children component ko access dena.
  // to sum up provider gives access of context
  // [state,dispatch] is distructuring of array using square brackets
  // React.useReducer ke 0 index ki value will go to state and index 1 ki value will go on dispatch
  // reducer is responsible for implementing a dispatched event
  // useReducer is alt to useState but used when state is complex
  const [state, dispatch] = React.useReducer(ErrorReducer, {
    showAlert: false,
    variant: "danger",
    msg: "",
  });
  return (
    // provider is global state ka malik jo access dega global state ka
    <ErrorStateContext.Provider value={state}>
      <ErrorDispatchContext.Provider value={dispatch}>
        {children}
      </ErrorDispatchContext.Provider>
    </ErrorStateContext.Provider>
  );
}

function useErrorState() {
  const context = React.useContext(ErrorStateContext); //use context here to use the context we made upar
  if (context === undefined) {
    throw new Error("e");
  }
  return context;
}
// that part of context we use whenever we want to dispatch an event. here the event is error message or succesfull message.
function useErrorDispatch() {
  const context = React.useContext(ErrorDispatchContext);
  if (context === undefined) {
    throw new Error("e");
  }
  return context;
}

// we are receiving parameters here in dispatch and config.
function displayError(dispatch, config) {
  dispatch({ type: "error", payload: config });
}

function displaySuccess(dispatch, config) {
  dispatch({ type: "success", payload: config });
}

function hideAlert(dispatch) {
  dispatch({ type: "hide" });
}

export {
  ErrorProvider,
  useErrorState,
  useErrorDispatch,
  displayError,
  displaySuccess,
  hideAlert,
};

// context is a global state/memory that can be used from anywehre across components.
