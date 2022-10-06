import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = () => {
    //try log in

    //if success
    const user = null; //set this
    auth.Login(user);

    //navigate to intial guess page
    navigate("/initialpredictions");
  };

  return (
    <Container fluid>
      <h1 className="mb-3">Qatar 2022 Predictions</h1>
      <Row>
        <Col className="mx-auto" xs="12" md="4">
          <Card>
            <Card.Header>Login</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                  />
                </Form.Group>
                <p className="error">{error}</p>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                <p className="mt-2">
                  Got a code? <Link to="/register">Register</Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;