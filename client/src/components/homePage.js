import { Jumbotron, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom"; //new hook for route

function HomePage() {
  const history = useHistory();
  return (
    <div>
      <Jumbotron className="welcomeJumbotron">
        <h1>One Place For All Your Books</h1>

        <p>
          <Button variant="primary" onClick={() => history.push("/signUp")}>
            Get Started
          </Button>
        </p>
      </Jumbotron>
    </div>
  );
}

export default HomePage;

// react router is a library used for client side routing
// react apps are single page apps. Content is changed dynamically.
//useHostiry is a hook to access search bar of browser.
