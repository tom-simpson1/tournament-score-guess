import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotUsername = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const request =
    "https://tournament-score-guess.herokuapp.com/api/forgotusername";

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      axios.post(request, { email });
    } finally {
      navigate("/?message=checkemail");
    }
  };

  return (
    <Container fluid className="p-3">
      <Row>
        <Col className="mx-auto" xs="12" md="4">
          <Card>
            <Card.Header>Forgot Username</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
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
                    You will be sent an email with your username.
                  </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                <p className="mt-2">
                  <Link to="/">Back to Login</Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotUsername;
