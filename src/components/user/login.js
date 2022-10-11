import Axios from "axios";
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
import Footer from "../layout/footer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const auth = useAuth();
  const [searchParams] = useSearchParams();
  const [showRegistered, setShowRegistered] = useState(
    searchParams.get("registered")
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log("handle submit hit", username);
    // //try log in
    // Axios.post("http://localhost:3001/api/login", {
    //   username: username,
    //   password: password,
    // }).then((res) => {
    //   console.log(res);
    //   if (!res.data || res.data === {} || res.data.message) {
    //     console.log("Set Error");
    //     setError(res.data?.message ?? "Something went wrong.");
    //   } else {
    //     console.log("Log User In");
    //     auth.login(res.data.user);
    //     navigate("/initialpredictions", { replace: true });
    //   }
    // });
    auth.login(username, password).then((res) => {
      if (res) setError(res);
    });
  };

  return (
    <>
      <Container fluid className="p-3">
        {/* <h1 className="mb-3">Qatar 2022 Predictions</h1> */}
        <Row>
          <Col className="mx-auto" xs="12" md="4">
            {showRegistered ? (
              <Alert
                className="mx-auto"
                variant="success"
                onClose={() => setShowRegistered(false)}
                dismissible
              >
                <Alert.Heading>Registration Successful!</Alert.Heading>
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
    </>
  );
};

export default Login;
