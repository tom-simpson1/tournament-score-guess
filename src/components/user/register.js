import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/auth";
import { BOOTSTRAP_PRIMARY } from "../../utils/colours";
import LoadingSpinner from "../loading-spinner";

const Register = () => {
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const CODE_REGEX = /^[a-zA-Z0-9]{6,}$/;
  const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_.]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

  const auth = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setError("");
    setCodeError("");
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasErrored = false;

    if (!CODE_REGEX.test(code)) {
      hasErrored = true;
      setCodeError("Code invalid");
    }

    if (!USER_REGEX.test(username)) {
      hasErrored = true;
      setUsernameError(
        "Username must be 4 to 24 characters, begin with a letter and only contain letters, numbers, fullstops, underscores, and hyphens."
      );
    }

    if (!PWD_REGEX.test(password)) {
      hasErrored = true;
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one lower case, one upper case and 1 number."
      );
    }

    if (confirmPassword !== password) {
      hasErrored = true;
      setConfirmPasswordError("Passwords do not match.");
    }

    if (hasErrored) {
      return;
    }

    setIsLoading(true);
    auth.register(code, username, email, password).then((res) => {
      if (res) setError(res);
    });
    setIsLoading(false);
  };

  return (
    <Container fluid>
      <h1 className="mb-3">Qatar 2022 Predictions</h1>
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
                    isInvalid={codeError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {codeError}
                  </Form.Control.Feedback>
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
                    isInvalid={usernameError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {usernameError}
                  </Form.Control.Feedback>
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
                  {/* <Form.Text className="text-muted">
                    Only used to contact you if you win.
                  </Form.Text> */}
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
                    isInvalid={passwordError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {passwordError}
                  </Form.Control.Feedback>
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
                    isInvalid={confirmPasswordError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {confirmPasswordError}
                  </Form.Control.Feedback>
                </Form.Group>
                <p className="error">{error}</p>
                <Button variant="primary" type="submit">
                  Submit
                  {isLoading ? (
                    <LoadingSpinner
                      height={20}
                      circleColour={BOOTSTRAP_PRIMARY}
                    />
                  ) : null}
                </Button>
                <p className="mt-2">
                  Already have an account? <Link to="/">Login</Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
