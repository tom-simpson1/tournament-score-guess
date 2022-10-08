import { useState, useEffect } from "react";
import "../App.css";
import Axios from "axios";
import { Row, Col, Button, Form, Card, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { format } from "date-fns";
import { useAuth } from "../utils/auth";

const InitialPredictions = () => {
  const [tournament, setTournament] = useState();
  const [matches, setMatches] = useState([]);

  const auth = useAuth();

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/tournament?tournamentId=1`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((response) => {
      setTournament(response.data);
    });
  }, []);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/matches?tournamentId=1`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((response) => {
      // setMatches(response.data);
      setMatches(response.data);
    });
  }, []);

  const submit = () => {
    let isValid = true;
    const isInsert = !matches[0].UserMatchGuessId;
    const team1GoalInputs = document.getElementsByName("team-1-goals");
    team1GoalInputs.forEach((i) => {
      const value = i.value;
      if (!value || value < 0) {
        isValid = false;
        return;
      }
      const matchId = +i.id.split(" ").pop();
      matches.filter((m) => m.MatchId === matchId)[0].Team1Goals = +value;
    });

    const team2GoalInputs = document.getElementsByName("team-2-goals");
    team2GoalInputs.forEach((i) => {
      const value = i.value;
      if (!value || value < 0) {
        isValid = false;
        return;
      }
      const matchId = +i.id.split(" ").pop();
      matches.filter((m) => m.MatchId === matchId)[0].Team2Goals = +value;
    });

    const tieBreakValue = document.getElementById("tie-break").value;

    if (!tieBreakValue || tieBreakValue < 0) isValid = false;

    if (!isValid) {
      alert("Please ensure all predictions are entered.");
      return;
    }

    Axios.post(
      "http://localhost:3001/api/guesses?tournamentId=1",
      {
        matches: matches,
        tieBreakAnswer: tieBreakValue,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    alert(
      `Your predictions were successfully ${
        isInsert ? "submitted" : "updated"
      }!`
    );
    window.location.reload(false);
  };

  const groupBy = (xs, key) => {
    const keyValues = [];
    xs.forEach((x) => {
      if (!keyValues.includes(x[key])) {
        keyValues.push(x[key]);
      }
    });

    return keyValues.map((keyValue) => ({
      key: keyValue,
      values: xs.filter((x) => x[key] === keyValue),
    }));
  };

  return (
    <div className="App">
      <h2 className="p-3">
        {tournament?.Name} - Predictions - {auth.user.username}
      </h2>

      <Form className="form">
        <Container fluid>
          {matches.length > 0
            ? groupBy(matches, "MatchGroup").map((g) => {
                return (
                  <Row className="mx-auto" key={g.key}>
                    <Col className="mx-auto p-2" md="10" lg="4">
                      <Card>
                        <Card.Body>
                          <Card.Title className="px-0">{g.key}</Card.Title>
                          <Row>
                            {g.values.map((m) => {
                              return (
                                <Container fluid key={`match-${m.MatchId}`}>
                                  <Row
                                    className="p-1"
                                    style={{ alignItems: "center" }}
                                  >
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
                                      <input
                                        type="number"
                                        min="0"
                                        max="99"
                                        id={`team-1-goals ${m.MatchId}`}
                                        name="team-1-goals"
                                        defaultValue={m.Team1Goals}
                                      />
                                      {"  -  "}
                                      <input
                                        type="number"
                                        min="0"
                                        max="99"
                                        id={`team-1-goals ${m.MatchId}`}
                                        name="team-2-goals"
                                        defaultValue={m.Team2Goals}
                                      />
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
                                  <Row className="pb-3">
                                    <small>
                                      {format(
                                        new Date(m.MatchTime),
                                        "dd/MM/yyyy HH:mm:ss"
                                      )}
                                    </small>
                                  </Row>
                                </Container>
                              );
                            })}
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                );
              })
            : null}
          {tournament ? (
            <Row className="mx-auto">
              <Col className="mx-auto p-1" md="10" lg="4">
                <Card>
                  <Card.Body>
                    <Card.Title className="px-0">Tie Break</Card.Title>
                    <Row>
                      <Col>
                        <label className="p-2">
                          {tournament.TieBreakQuestion}
                        </label>
                        <input
                          style={{ width: "50px" }}
                          type="number"
                          min="0"
                          max="1000"
                          id="tie-break"
                          defaultValue={tournament.TieBreakAnswer}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : null}
        </Container>
        <Button className="m-3" onClick={submit}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default InitialPredictions;
