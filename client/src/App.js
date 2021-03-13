import React, { useEffect } from "react";
import "./App.css";
import NavigationBar from "./components/navigationBar";
import Dashboard from "./components/dashboard";
import SignUpForm from "./components/signUpForm";
import HomePage from "./components/homePage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LogIn from "./components/logIn";
import Profile from "./components/profile";
import ManageAdmins from "./components/manageAdmins";
import { getUser, useUserDispatch, useUserState, logMeIn } from "./UserContext";
import Axios from "axios";

function App() {
  const dispatch = useUserDispatch();
  // const {isAuthenticated,user} = useUserState()
  // getUser(dispatch)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      x_auth_token: token,
    };

    console.log(config);
    Axios.post(
      "http://localhost:8080/eLibrary/server/getUser.php",
      JSON.stringify(config)
    )
      .then((response) => {
        console.log(response);
        if (response.data !== null || response.data !== undefined) {
          getUser(dispatch, response.data.user[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="App">
     
      <Router>
      <NavigationBar />
        <Route exact path="/" component={HomePage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/signUp" component={SignUpForm} />
        <Route path="/logIn" component={LogIn} />
        <Route path="/profile" component={Profile} />
        <Route path="/manageAdmins" component={ManageAdmins} />
      </Router>
    </div>
  );
}

export default App;
