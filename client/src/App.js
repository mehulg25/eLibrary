import "./App.css";
import NavigationBar from "./components/navigationBar";
import AuthorDashboard from "./components/authorDashboard";
import SignUpForm from "./components/signUpForm";
import HomePage from "./components/homePage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LogIn from "./components/logIn";

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route path="/authorDashboard" component={AuthorDashboard} />
        <Route path="/signUp" component={SignUpForm} />
        <Route path="/logIn" component={LogIn} />
      </Router>
    </div>
  );
}

export default App;
