import { useAuth } from "../../utils/auth";

const { Navbar, Container, Nav, Row, Col } = require("react-bootstrap");

const NavigationBar = (props) => {
  const auth = useAuth();
  const { activeKey } = props;

  return (
    <Navbar
      style={{ position: "sticky", top: 0, zIndex: 1 }}
      bg="dark"
      variant="dark"
    >
      <Container>
        <Nav className="me-auto" activeKey={activeKey}>
          {/* <Row> */}
          {/* <Col xs="12" md="2">
              <Navbar.Brand href="/initialpredictions">Qatar 2022</Navbar.Brand>
            </Col> */}
          {/* <Col> */}
          <Nav.Item>
            <Nav.Link href="/initialpredictions" eventKey="predictions">
              Predictions
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/scores" eventKey="scores">
              Scores
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/leaderboard" eventKey="leaderboard">
              Leaderboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={auth.logout}>Logout</Nav.Link>
          </Nav.Item>
          {/* </Col>
          </Row> */}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
