import { Nav, Navbar, Form, FormControl, Button } from "react-bootstrap";
import { useUserState } from "../UserContext.js";
import {useHistory} from "react-router-dom"; //new hook


function NavigationBar() {
  const history = useHistory();
  const { user, isAuthenticated } = useUserState();
  console.log(user, isAuthenticated);
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>eLibrary</Navbar.Brand>
      <Nav className="mr-auto"></Nav>
      {isAuthenticated ? <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        <Button variant="outline-info">Search</Button>
      </Form> : null}
      {isAuthenticated ? null : <Button variant="outline-info" onClick={()=>history.push('/logIn')}>Log In</Button>}
    </Navbar>
  );
}

export default NavigationBar;
