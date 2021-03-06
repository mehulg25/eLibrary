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
import { getUser, useUserDispatch } from "./UserContext";

function App() {
  const dispatch = useUserDispatch();
  
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
