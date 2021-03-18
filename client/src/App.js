import React, { useEffect, useState } from "react";
import "./App.css";
import NavigationBar from "./components/navigationBar";
import Dashboard from "./components/dashboard";
import SignUpForm from "./components/signUpForm";
import HomePage from "./components/homePage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LogIn from "./components/logIn";
import ManageAdmins from "./components/manageAdmins";
import { getUser, useUserDispatch,useUserState } from "./UserContext";
import Axios from "axios";
import LibraryAlerts from './components/general/libraryAlerts'
import {useErrorState} from './ErrorContext'

function App() {
  const dispatch = useUserDispatch();
  const {msg,variant,showAlert} = useErrorState();

  const token = localStorage.getItem("token");

  useEffect(()=>{
    if(token){
      const config = {
        headers:{
          "Content-Type":"application/json",
          "x-auth-token":token
        }
      };
    
      Axios.get("/getUser.php",config).then((response) => {
          console.log(response);
          if (response.data !== undefined && response.status === 200) {
            getUser(dispatch, response.data.user[0]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },[])

  return (
    <div className="App">
     <LibraryAlerts show={showAlert} msg={msg} variant={variant}/>
      <Router>
      <NavigationBar />
        <Route exact path="/" component={HomePage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/signUp" component={SignUpForm} />
        <Route path="/logIn" component={LogIn} />
        <Route path="/manageAdmins" component={ManageAdmins} />
      </Router>
    </div>
  );
}

export default App;