import {Jumbotron,Button} from "react-bootstrap";
import {useHistory} from "react-router-dom"; //new hook

function HomePage() {
  const history = useHistory()
  return (
    <div>
      <Jumbotron className = "welcomeJumbotron">
        <h1>One Place For All Your Books</h1>
        
        <p>
          <Button variant="primary" onClick={()=>history.push('/signUp')}>Get Started</Button>
        </p>
      </Jumbotron>
    </div>
  );
}

export default HomePage;
