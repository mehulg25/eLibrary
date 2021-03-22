import React from "react";
const UserStateContext = React.createContext();//declaring context

const UserDispatchContext = React.createContext();

function UserReducer(state, action) {
  switch (action.type) {
    case "login": {
      console.log(action.payload)
      const user = action.payload;
      localStorage.setItem("token", user.jwt);
      return {
        isAuthenticated: true,
        user: user,
      };
    }

    case "getuser": {
      const user = action.payload;

      return {
        isAuthenticated: true,
        user: user,
      };
    }

    case "logout": {
      localStorage.setItem("token", "");
      return {
        user: null,
        isAuthenticated: false,
      };
    }
    case "updateUserData": {
      const user = action.payload
      return {
        ...state,
        user: user
      };
    }
  }
}

function UserProvider({ children }) {
  const [state, dispatch] = React.useReducer(UserReducer, {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem("token")
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

function logMeIn(dispatch, response) { 
  dispatch({ type: "login", payload: response.data });
}

function logMeOut(dispatch) {
  dispatch({ type: "logout" });
}

function getUser(dispatch,response) {
  dispatch({ type: "getuser", payload: response });
}

function updateUserData(dispatch,response){
  dispatch({ type: "updateUserData", payload: response });
}

export {
  UserProvider,
  useUserState,
  useUserDispatch,
  logMeIn,
  logMeOut,
  getUser,
  updateUserData
};