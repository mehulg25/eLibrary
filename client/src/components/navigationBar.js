import { Nav, Navbar, Form, FormControl, Button } from "react-bootstrap";

function navigationBar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">eLibrary</Navbar.Brand>
      <Nav className="mr-auto"></Nav>
      <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        <Button variant="outline-info">Search</Button>
      </Form>
    </Navbar>
  );
}

export default navigationBar;
