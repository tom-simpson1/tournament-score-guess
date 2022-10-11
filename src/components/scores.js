import Axios from "axios";
import { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import NavigationBar from "./layout/navigation-bar";

const Scores = () => {
  const [scores, setScores] = useState({});

  const auth = useAuth();
  const navigate = useNavigate();

  const CORRECT_SCORE_POINTS = 3;
  const CORRECT_RESULT_POINTS = 1;

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/scores`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        console.log(response);
        setScores(response.data);
      })
      .catch(() => {
        navigate("/");
      });
  }, []);
  return (
    <>
      <NavigationBar activeKey="scores" />
      <h2 className="p-3">{auth.user?.tournamentName} - Scores</h2>

      <Form className="form py-3">
        <Container fluid>
          {scores && scores.matches?.length > 0
            ? scores.matches.map((m) => {
                let boxStyle = "",
                  pointsStyle = "",
                  pointsText = "";
                switch (m.UserScore) {
                  case CORRECT_SCORE_POINTS:
                    boxStyle = "correct-score";
                    pointsStyle = "correct-score-points";
                    pointsText = "Correct Score - ";
                    break;
                  case CORRECT_RESULT_POINTS:
                    boxStyle = "correct-result";
                    pointsStyle = "correct-result-points";
                    pointsText = "Correct Result - ";
                    break;
                  case 0:
                    boxStyle = "incorrect-result";
                    pointsStyle = "incorrect-result-points";
                    pointsText = "Incorrect Result - ";
                    break;
                  default:
                    pointsText = "Match TBP";
                    break;
                }
                return (
                  <Row className="mx-auto" key={`match${m.MatchId}`}>
                    <Col className="mx-auto p-2" md="10" lg="4">
                      <Card>
                        <Card.Header>
                          {pointsText}
                          {m.UserScore ? (
                            <span className={pointsStyle}>
                              {m.UserScore}pts
                            </span>
                          ) : null}
                        </Card.Header>
                        <Card.Body>
                          <Row style={{ alignItems: "center" }}>
                            <Col>
                              <Container fluid>
                                <Row>
                                  <Col className="p-0 m-0" xs="12">
                                    <img
                                      src={`/images/country-flags/${
                                        !m.Team1IsPlaceholder
                                          ? m.Team1
                                          : "Placeholder"
                                      }.png`}
                                      alt={`${m.Team1} Flag`}
                                    />
                                  </Col>
                                  <Col className="p-0">
                                    <label>{m.Team1}</label>
                                  </Col>
                                </Row>
                              </Container>
                            </Col>
                            <Col xs="3" className="p-0 m-0">
                              <small>You Predicted</small>
                              <div>
                                <span className={`score-box ${boxStyle}`}>
                                  {m.Team1PredictedGoals}
                                </span>
                                {" - "}
                                <span className={`score-box ${boxStyle}`}>
                                  {m.Team2PredictedGoals}
                                </span>
                              </div>
                              <small>Final Score</small>
                              <div>
                                <span className={`score-box ${boxStyle}`}>
                                  {m.Team1ActualGoals ?? "?"}
                                </span>
                                <span> - </span>
                                <span className={`score-box ${boxStyle}`}>
                                  {m.Team2ActualGoals ?? "?"}
                                </span>
                              </div>
                            </Col>
                            <Col>
                              <Container fluid>
                                <Row>
                                  <Col className="p-0 m-0" xs="12">
                                    <img
                                      src={`/images/country-flags/${
                                        !m.Team2IsPlaceholder
                                          ? m.Team2
                                          : "Placeholder"
                                      }.png`}
                                      alt={`${m.Team2} Flag`}
                                    />
                                  </Col>
                                  <Col className="p-0">
                                    <label>{m.Team2}</label>
                                  </Col>
                                </Row>
                              </Container>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                );
              })
            : null}
        </Container>
      </Form>
    </>
  );
};

export default Scores;
