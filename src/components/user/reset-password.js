import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BOOTSTRAP_PRIMARY } from "../../utils/colours";
import LoadingSpinner from "../loading-spinner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("resettoken"));

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

  const request = `https://tournament-score-guess.herokuapp.com/api/resetpassword`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasErrored = false;

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

    try {
      setIsLoading(true);
      await axios.post(
        request,
        { password },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      navigate("/?message=passwordreset");
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        setError("Password reset token invalid.");
      } else {
        setError("Something went wrong resetting the password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="p-3">
      <Row>
        <Col className="mx-auto" xs="12" md="4">
          <Card>
            <Card.Header>Reset Password</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
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
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
