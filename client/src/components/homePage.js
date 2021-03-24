import {Jumbotron,Button} from "react-bootstrap";
import {useHistory} from "react-router-dom"; //new hook

function HomePage() {
  const history = useHistory()
  return (
    <div>
      <Jumbotron className = "welcomeJumbotron">
        <h1>One Place For All Your Books</h1>
        
        <p>
        {/* <div className="row">
          <div className="col mb-2"> */}
          <Button variant="primary" size="lg" onClick={()=>history.push('/signUp')}>Get Started</Button>
          {/* </div>
          </div> */}
        </p>
      </Jumbotron>
    </div>
  );
}

export default HomePage;