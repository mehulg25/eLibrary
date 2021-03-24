import {
  Nav,
  Navbar,
  Form,
  FormControl,
  Button,
  NavDropdown,
  Row,
  Col,
} from "react-bootstrap";
import { useUserState, useUserDispatch, logMeOut } from "../UserContext.js";
import { useHistory } from "react-router-dom"; // new hook
import Icon from "@mdi/react";
import { mdiAccount } from "@mdi/js";
import {
  displayError,
  displaySuccess,
  useErrorDispatch,
} from "../ErrorContext";

function NavigationBar() {
  const history = useHistory();
  const { user, isAuthenticated } = useUserState();
  const dispatch = useUserDispatch();
  const errorDispatch = useErrorDispatch();

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href={isAuthenticated ? "/dashboard" : "/"}>
        eLibrary
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
          
        {isAuthenticated && (
            
          <Nav>
            <Nav.Link href="/readingHistory">Reading History</Nav.Link>
          </Nav>
        )}
        {isAuthenticated && user.role === "ADMIN" && (
          <Nav className="mr-auto">
            <Nav.Link href="/manageReaders">Manage Readers</Nav.Link>
            <Nav.Link href="/manageAdmins">Manage Admins</Nav.Link>
          </Nav>
        )}
        <Nav className="mr-auto"></Nav>
        {isAuthenticated ? (
          <div>
            <Form inline>
              <div className="row">
                <div className="col">
                  <FormControl
                    type="text"
                    placeholder="Search"
                    className="sm-1"
                  />
                </div>
              </div>
              <Button variant="outline-info">Search</Button>
              <NavDropdown
                title={
                  <Icon path={mdiAccount} size={0.5} className=" avatar" />
                }
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item href="#action/3.1">
                  Manage Passwords
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => {
                    logMeOut(dispatch);
                    displaySuccess(errorDispatch, "Logged Out!");
                    history.push("/logIn");
                  }}
                >
                  Log Out
                </NavDropdown.Item>
              </NavDropdown>
            </Form>
          </div>
        ) : (
          <Button variant="outline-info" onClick={() => history.push("/logIn")}>
            Log In
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
export default NavigationBar;
