import { useState } from "react";
import { useQuery } from "react-query";
import "../App.css";
import axios from "axios";
import {
  Row,
  Col,
  Button,
  Form,
  Card,
  Container,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { format } from "date-fns";
import { useAuth } from "../utils/auth";
import NavigationBar from "./layout/navigation-bar";
import LoadingSpinner from "./loading-spinner";

const InitialPredictions = () => {
  const [showRules, setShowRules] = useState(true);

  const auth = useAuth();

  const request =
    "https://tournament-score-guess.herokuapp.com/api/predictions";

  const { data: predictions, isLoading } = useQuery([request], async () => {
    try {
      const res = await axios.get(request, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        auth.logout();
      }
      return {};
    }
  });

  const submit = () => {
    let isValid = true;
    const isInsert = !predictions.matches[0].UserMatchGuessId;
    const team1GoalInputs = document.getElementsByName("team-1-goals");
    team1GoalInputs.forEach((i) => {
      const value = i.value;
      if (!value || value < 0 || value > 99) {
        isValid = false;
        return;
      }
      const matchId = +i.id.split(" ").pop();
      predictions.matches.filter((m) => m.MatchId === matchId)[0].Team1Goals =
        +value;
    });

    const team2GoalInputs = document.getElementsByName("team-2-goals");
    team2GoalInputs.forEach((i) => {
      const value = i.value;
      if (!value || value < 0 || value > 99) {
        isValid = false;
        return;
      }
      const matchId = +i.id.split(" ").pop();
      predictions.matches.filter((m) => m.MatchId === matchId)[0].Team2Goals =
        +value;
    });

    const tieBreakValue = document.getElementById("tie-break").value;

    if (!tieBreakValue || tieBreakValue < 0) isValid = false;

    if (!isValid) {
      alert("Please ensure all predictions are entered and between 0 and 99.");
      return;
    }

    axios
      .post(
        `${request}`,
        {
          matches: predictions.matches,
          tieBreakAnswer: tieBreakValue,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        alert(
          `Your predictions were successfully ${
            isInsert ? "submitted" : "updated"
          }!`
        );
        window.location.reload(false);
      });
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
    <>
      <NavigationBar activeKey="predictions" />
      <h2 className="pt-3">
        {auth.user?.tournamentName}
        <br />
        Predictions
      </h2>

      <Form className="form py-3">
        <Container fluid>
          {showRules ? (
            <Row className="mx-auto">
              <Col className="mx-auto p-2" md="10" lg="4">
                <Alert
                  variant="info"
                  dismissible
                  onClose={() => setShowRules(false)}
                >
                  <Alert.Heading>Rules</Alert.Heading>
                  <p>
                    All scores are for normal time - extra time and penalties
                    don't count. <br />
                    You can submit and update your predictions up until the day
                    before the tournament starts.{" "}
                    <b>
                      You can't change <u>any</u> of your predictions once the
                      tournament starts.
                    </b>
                    <br />
                    Correct score - 3pts
                    <br />
                    Correct result - 1pt
                    <br />
                    Incorrect result - 0pts
                  </p>
                </Alert>
              </Col>
            </Row>
          ) : null}
          {!isLoading && predictions ? (
            <>
              {groupBy(predictions.matches, "MatchGroup").map((g) => {
                return (
                  <Row className="mx-auto" key={g.key}>
                    <Col className="mx-auto p-2" md="10" lg="4">
                      <Card>
                        <Card.Header className="px-0">{g.key}</Card.Header>
                        <Card.Body>
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
                                        id={`team-2-goals ${m.MatchId}`}
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
              })}
              <Row className="mx-auto">
                <Col className="mx-auto p-1" md="10" lg="4">
                  <Card>
                    <Card.Header className="px-0">Tie Break</Card.Header>
                    <Card.Body>
                      <Row>
                        <Col>
                          <label className="p-2">
                            {predictions.tieBreakQuestion}
                          </label>
                          <input
                            style={{ width: "50px" }}
                            type="number"
                            min="0"
                            max="1000"
                            id="tie-break"
                            defaultValue={predictions.tieBreakAnswer}
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Button className="m-3" onClick={submit}>
                Submit
              </Button>
            </>
          ) : (
            <LoadingSpinner />
          )}
        </Container>
      </Form>
    </>
  );
};

export default InitialPredictions;
