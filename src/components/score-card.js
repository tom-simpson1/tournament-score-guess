import { format } from "date-fns";
import { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const ScoreCard = (props) => {
  const { match, matches, idx, scrollRef, isAdmin, handleSubmit } = props;

  const [team1Goals, setTeam1Goals] = useState();
  const [team2Goals, setTeam2Goals] = useState();

  const CORRECT_SCORE_POINTS = 3;
  const CORRECT_RESULT_POINTS = 1;

  let boxStyle = "",
    pointsStyle = "",
    pointsText = "";
  switch (match.UserScore) {
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
        match.Team1ActualGoals !== null && match.Team1ActualGoals !== undefined
          ? "No Score Submitted"
          : "Match TBP";
      break;
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={
          match.UserScore !== null &&
          (matches[idx + 1]?.UserScore === null ||
            matches[idx + 1]?.UserScore === undefined)
            ? scrollRef
            : null
        }
        style={{ position: "absolute", top: "-80px", left: "0" }}
      ></div>
      <Row className="mx-auto">
        <Col className="mx-auto p-2" md="10" lg="4">
          <Card>
            <Card.Header>
              {pointsText}
              {match.UserScore !== null && match.UserScore !== undefined ? (
                <span className={pointsStyle}>{match.UserScore}pts</span>
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
                            !match.Team1IsPlaceholder
                              ? match.Team1
                              : "Placeholder"
                          }.png`}
                          alt={`${match.Team1} Flag`}
                        />
                      </Col>
                      <Col className="p-0">
                        <label>{match.Team1}</label>
                      </Col>
                    </Row>
                  </Container>
                </Col>
                <Col xs="3" className="p-0 m-0">
                  <small>You Predicted</small>
                  <div>
                    <span className={`score-box ${boxStyle}`}>
                      {match.Team1PredictedGoals}
                    </span>
                    {" - "}
                    <span className={`score-box ${boxStyle}`}>
                      {match.Team2PredictedGoals}
                    </span>
                  </div>
                  <small>Final Score</small>
                  <div>
                    <span
                      className={`score-box ${
                        match.Team1ActualGoals !== null &&
                        match.Team1ActualGoals !== undefined
                          ? "final-score"
                          : ""
                      }`}
                    >
                      {match.Team1ActualGoals !== null &&
                      match.Team1ActualGoals !== undefined
                        ? match.Team1ActualGoals
                        : "?"}
                    </span>
                    <span> - </span>
                    <span
                      className={`score-box ${
                        match.Team2ActualGoals !== null &&
                        match.Team2ActualGoals !== undefined
                          ? "final-score"
                          : ""
                      }`}
                    >
                      {match.Team2ActualGoals !== null &&
                      match.Team2ActualGoals !== undefined
                        ? match.Team2ActualGoals
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
                            !match.Team2IsPlaceholder
                              ? match.Team2
                              : "Placeholder"
                          }.png`}
                          alt={`${match.Team2} Flag`}
                        />
                      </Col>
                      <Col className="p-0">
                        <label>{match.Team2}</label>
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
              <Row>
                <div>
                  <small>{match.MatchGroup}</small>
                </div>
                <div>
                  <small>
                    {format(new Date(match.MatchTime), "dd/MM/yyyy HH:mm:ss")}
                  </small>
                </div>
              </Row>
            </Card.Body>
            {isAdmin ? (
              <Card.Footer>
                <Row>
                  <Col className="p-2 m-0">
                    <input
                      type="number"
                      min="0"
                      max="99"
                      id={`team-1-goals ${match.MatchId}`}
                      name="team-1-goals"
                      onChange={(e) => {
                        setTeam1Goals(e.target.value);
                      }}
                    />
                    {"  -  "}
                    <input
                      type="number"
                      min="0"
                      max="99"
                      id={`team-2-goals ${match.MatchId}`}
                      name="team-2-goals"
                      onChange={(e) => {
                        setTeam2Goals(e.target.value);
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      className="m-3"
                      onClick={() =>
                        handleSubmit(match.MatchId, team1Goals, team2Goals)
                      }
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
};

export default ScoreCard;
