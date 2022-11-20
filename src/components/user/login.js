import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../utils/auth";
import { BOOTSTRAP_PRIMARY } from "../../utils/colours";
import LoadingSpinner from "../loading-spinner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const auth = useAuth();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(searchParams.get("message"));
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    await auth.login(username, password).then((res) => {
      if (res) setError(res);
    });
    setIsLoading(false);
  };

  return (
    <>
      <Container fluid className="p-3">
        {/* <h1 className="mb-3">Qatar 2022 Predictions</h1> */}
        <Row>
          <Col className="mx-auto" xs="12" md="4">
            {message ? (
              <Alert
                className="mx-auto"
                variant={message === "checkemail" ? "info" : "success"}
                onClose={() => setMessage("")}
                dismissible
              >
                <Alert.Heading>
                  {message === "registered"
                    ? "Registration Successful!"
                    : message === "checkemail"
                    ? "Please check your emails"
                    : message === "passwordreset"
                    ? "Password successfully reset!"
                    : null}
                </Alert.Heading>
              </Alert>
            ) : null}
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
                  <p className="mt-2">
                    <Link to="/forgotusername">Forgot Username?</Link>
                  </p>
                  <p className="mt-2">
                    <Link to="/forgotpassword">Forgot Password?</Link>
                  </p>
                  <Button variant="primary" type="submit">
                    Submit
                    {isLoading ? (
                      <LoadingSpinner
                        height={20}
                        circleColour={BOOTSTRAP_PRIMARY}
                      />
                    ) : null}
                  </Button>
                  {/* <p className="mt-2">
                    <b>
                      Got a code? <Link to="/register">Register</Link>
                    </b>
                  </p> */}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
