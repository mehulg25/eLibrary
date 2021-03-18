import React from "react";
const ErrorStateContext = React.createContext();

const ErrorDispatchContext = React.createContext();

function ErrorReducer(state, action) {
  switch (action.type) {
  
    case "error": {
      const msg = action.payload;
      return {
        showAlert: true,
        variant: "danger",
        msg
      };
    }
    case "success": {
        const msg = action.payload;
        return {
          showAlert: true,
          variant: "success",
          msg
        };
      }
    case "warning": {
        const msg = action.payload;
        return {
            showAlert: true,
            variant: "warning",
            msg
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
  const [state, dispatch] = React.useReducer(ErrorReducer, {
    showAlert: false,
    variant: "danger",
    msg:''
  });
  return (
    <ErrorStateContext.Provider value={state}>
      <ErrorDispatchContext.Provider value={dispatch}>
        {children}
      </ErrorDispatchContext.Provider>
    </ErrorStateContext.Provider>
  );
}

function useErrorState() {
  const context = React.useContext(ErrorStateContext);
  if (context === undefined) {
    throw new Error("e");
  }
  return context;
}

function useErrorDispatch() {
  const context = React.useContext(ErrorDispatchContext);
  if (context === undefined) {
    throw new Error("e");
  }
  return context;
}

function displayError(dispatch,config){
  dispatch({type:"error",payload:config})
}

function displaySuccess(dispatch,config){
  dispatch({type:"success",payload:config})
}

function displayWarning(dispatch,config){
  dispatch({type:"warning",payload:config})
}

function hideAlert(dispatch){
    dispatch({type:"hide"})
}

export {
  ErrorProvider,
  useErrorState,
  useErrorDispatch,
  displayError,
  displaySuccess,
  hideAlert,
  displayWarning
};