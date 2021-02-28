import React from "react";

const UserStateContext = React.createContext();

const UserDispatchContext = React.createContext();

function UserReducer(state, action) {
  switch (action.type) {
    case "login": {
      const user = action.payload;
      return {
        ...state,
        isAuthenticated: true,
      };
    }

    case "logout": {
      const user = action.payload;
      return {
        ...state,
        isAuthenticated: false,
      };
    }
  }
}

function UserProvider({ children }) {
  const [state, dispatch] = React.useReducer(UserReducer, {
    isAuthenticated: false,
    role: "",
    email: "",
  });
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("e");
  }
  return context;
}

function useUserDispatch() {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("e");
  }
  return context;
}

export {UserProvider, useUserState, useUserDispatch} ;