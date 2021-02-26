import "./App.css";
import NavigationBar from "./components/navigationBar";
import AuthorDashboard from "./components/authorDashboard";
import LoginForm from "./components/loginForm";
import HomePage from "./components/homePage";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route path="/authorDashboard" component={AuthorDashboard} />
        <Route path="/login" component={LoginForm} />
      </Router>
    </div>
  );
}

export default App;
