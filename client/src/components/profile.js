import { Button, Container, Row } from "react-bootstrap";
import { mdiAccount } from "@mdi/js";
import Icon from "@mdi/react";
import { useContext } from "react";
import { useUserState, logMeOut, useUserDispatch } from "../UserContext";
import { useHistory } from "react-router-dom";

function Profile() {
  const { isAuthenticated, user } = useUserState();
  const history = useHistory();

  const dispatch = useUserDispatch();
  if (isAuthenticated) {
    return (
      <Container>
        <Row>
          <Icon path={mdiAccount} size={10} />
        </Row>
        <Row>
          <Button>Reading History</Button>
        </Row>
        {isAuthenticated && user.role === "ADMIN" ? (
          <div>
            <Row>
              <Button>Manage Readers</Button>
            </Row>
            <Row>
              <Button onClick={() => history.push("/manageAdmins")}>
                Manage Admins
              </Button>
            </Row>
          </div>
        ) : null}
        <Row>
          <Button>Manage Password</Button>
        </Row>
        <Row>
          <Button onClick={() => logMeOut(dispatch)}>Log Out</Button>
        </Row>
      </Container>
    );
  } else {
    return <p>Please Log In To Continue</p>;
  }
}

export default Profile;
