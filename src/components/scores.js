import Axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../utils/auth";
import useScroll from "../utils/useScroll";
import NavigationBar from "./layout/navigation-bar";

const Scores = () => {
  const [scores, setScores] = useState({});

  const [executeScroll, elRef] = useScroll();

  const auth = useAuth();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");

  const CORRECT_SCORE_POINTS = 3;
  const CORRECT_RESULT_POINTS = 1;

  const api = "https://tournament-score-guess.herokuapp.com/api";

  const updateScore = (matchId) => {
    const team1GoalsInput = document.getElementById(
      `team-1-goals ${matchId}`
    ).value;
    const team2GoalsInput = document.getElementById(
      `team-2-goals ${matchId}`
    ).value;
    let team1Goals = +team1GoalsInput;
    let team2Goals = +team2GoalsInput;

    if (
      !team1GoalsInput ||
      !team2GoalsInput ||
      team1Goals < 0 ||
      team2Goals < 0 ||
      team1Goals > 99 ||
      team2Goals > 99
    ) {
      alert("Please ensure scores entered are valid.");
      return;
    }

    Axios.post(
      `${api}/score`,
      {
        matchId,
        team1Goals,
        team2Goals,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => {
        alert("Scores updated.");
        window.location.reload(false);
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    Axios.get(`${api}/scores?userId=${userId ?? auth.user?.userId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        setScores(response.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          auth.logout();
        }
      });
  }, []);

  useEffect(executeScroll, [scores]);

  return (
    <>
      <NavigationBar activeKey="scores" />
      <h2 className="pt-3">{auth.user?.tournamentName} - Scores</h2>

      <Form className="form py-3">
        <Container fluid>
          <Row className="mx-auto">
            <Col className="mx-auto p-2" md="10" lg="4">
              <Card>
                <Card.Header>Scores</Card.Header>
                <Card.Body>
                  <div>
                    Username: <b>{scores?.username}</b>
                  </div>
                  <div>
                    Total Points: <b>{scores?.totalPoints}</b>
                  </div>
                  <div>
                    Correct Scores: <b>{scores?.correctScores}</b>
                  </div>
                  <div>
                    Correct Results: <b>{scores?.correctResults}</b>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {scores && scores.matches?.length > 0
            ? scores.matches.map((m, idx) => {
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
                    pointsText =
                      m.Team1ActualGoals !== null &&
                      m.Team1ActualGoals !== undefined
                        ? "No Score Submitted"
                        : "Match TBP";
                    break;
                }
                return (
                  <div
                    style={{ position: "relative" }}
                    key={`match${m.MatchId}`}

                    //ref={m.MatchId === 7 ? elRef : null}
                  >
                    <div
                      ref={
                        m.UserScore !== null &&
                        scores.matches[idx + 1]?.UserScore === null
                          ? elRef
                          : null
                      }
                      style={{ position: "absolute", top: "-80px", left: "0" }}
                    ></div>
                    <Row className="mx-auto">
                      <Col className="mx-auto p-2" md="10" lg="4">
                        <Card>
                          <Card.Header>
                            {pointsText}
                            {m.UserScore !== null &&
                            m.UserScore !== undefined ? (
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
                                  <span
                                    className={`score-box ${
                                      m.Team1ActualGoals !== null &&
                                      m.Team1ActualGoals !== undefined
                                        ? "final-score"
                                        : ""
                                    }`}
                                  >
                                    {m.Team1ActualGoals !== null &&
                                    m.Team1ActualGoals !== undefined
                                      ? m.Team1ActualGoals
                                      : "?"}
                                  </span>
                                  <span> - </span>
                                  <span
                                    className={`score-box ${
                                      m.Team2ActualGoals !== null &&
                                      m.Team2ActualGoals !== undefined
                                        ? "final-score"
                                        : ""
                                    }`}
                                  >
                                    {m.Team2ActualGoals !== null &&
                                    m.Team2ActualGoals !== undefined
                                      ? m.Team2ActualGoals
                                      : "?"}
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
                            <Row>
                              <div>
                                <small>{m.MatchGroup}</small>
                              </div>
                              <div>
                                <small>
                                  {format(
                                    new Date(m.MatchTime),
                                    "dd/MM/yyyy HH:mm:ss"
                                  )}
                                </small>
                              </div>
                            </Row>
                          </Card.Body>
                          {auth.user?.isAdmin ? (
                            <Card.Footer>
                              <Row>
                                <Col className="p-2 m-0">
                                  <input
                                    type="number"
                                    min="0"
                                    max="99"
                                    id={`team-1-goals ${m.MatchId}`}
                                    name="team-1-goals"
                                  />
                                  {"  -  "}
                                  <input
                                    type="number"
                                    min="0"
                                    max="99"
                                    id={`team-2-goals ${m.MatchId}`}
                                    name="team-2-goals"
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <Button
                                    className="m-3"
                                    onClick={() => updateScore(m.MatchId)}
                                  >
                                    Update Score
                                  </Button>
                                </Col>
                              </Row>
                            </Card.Footer>
                          ) : null}
                        </Card>
                      </Col>
                    </Row>
                  </div>
                );
              })
            : null}
        </Container>
      </Form>
    </>
  );
};

export default Scores;
