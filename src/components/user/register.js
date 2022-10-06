import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

const Register = () => {
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const CODE_REGEX = /^[a-zA-Z0-9]{6,}$/;
  const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_.]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setError("");

    if (!CODE_REGEX.test(code)) {
      setError("Code invalid");
      return;
    }

    if (!USER_REGEX.test(username)) {
      setError(
        "Username must be 4 to 24 characters, begin with a letter and only contain letters, numbers, fullstops, underscores, and hyphens."
      );
      return;
    }

    if (!PWD_REGEX.test(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one lower case, one upper case and 1 number."
      );
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords do not match.");
      return;
    }

    console.log(code, username, email, password, confirmPassword);
  };

  return (
    <Container fluid>
      <Row>
        <Col className="mx-auto" xs="12" md="4">
          <Card>
            <Card.Header>Registration</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="code">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter code"
                    onChange={(e) => {
                      setCode(e.target.value);
                    }}
                    defaultValue={code}
                    required
                  />
                </Form.Group>
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
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                  />
                  <Form.Text className="text-muted">
                    Only used to contact you if you win.
                  </Form.Text>
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
                <Form.Group className="mb-3" controlId="confirm-password">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                    required
                  />
                </Form.Group>
                <p className="error">{error}</p>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
