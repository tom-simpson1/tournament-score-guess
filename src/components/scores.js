import axios from "axios";
import { useEffect } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../utils/auth";
import useScroll from "../utils/useScroll";
import NavigationBar from "./layout/navigation-bar";
import ScoreCard from "./score-card";
import ClipLoader from "react-spinners/ClipLoader";

const Scores = () => {
  const [executeScroll, elRef] = useScroll();

  const auth = useAuth();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");

  const updateScore = (matchId, team1GoalsInput, team2GoalsInput) => {
    console.log(matchId, team1GoalsInput, team2GoalsInput);

    if (!team1GoalsInput || !team2GoalsInput) {
      alert("Please ensure both scores are entered.");
      return;
    }
    const team1Goals = +team1GoalsInput;
    const team2Goals = +team2GoalsInput;
    if (
      team1Goals < 0 ||
      team2Goals < 0 ||
      team1Goals > 99 ||
      team2Goals > 99
    ) {
      alert("Please ensure scores entered are valid.");
      return;
    }

    axios
      .post(
        `${request}/score`,
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

  const request = "https://tournament-score-guess.herokuapp.com/api/scores";

  const { data: scores, isLoading } = useQuery(
    [request, { userId }],
    async () => {
      try {
        const res = await axios.get(
          `${request}?userId=${userId ?? auth.user?.userId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) {
          auth.logout();
        }
        return {};
      }
    }
  );

  useEffect(executeScroll, [scores]);

  return (
    <>
      <NavigationBar activeKey="scores" />
      <h2 className="pt-3">{auth.user?.tournamentName} - Scores</h2>

      <Form className="form py-3">
        <Container fluid>
          {!isLoading && scores ? (
            <>
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
              {scores.matches.map((m, idx) => {
                return (
                  <ScoreCard
                    key={`match${m.MatchId}`}
                    match={m}
                    matches={scores.matches}
                    idx={idx}
                    scrollRef={elRef}
                    isAdmin={auth.user?.isAdmin}
                    handleSubmit={updateScore}
                  />
                );
              })}
              <Row className="mx-auto">
                <Col className="mx-auto p-2" md="10" lg="4">
                  <Card>
                    <Card.Header>Tie Break</Card.Header>
                    <Card.Body>
                      You predicted <b>{scores.tieBreakAnswer}</b> cards.
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <ClipLoader loading aria-label="Loading Spinner" size={50} />
          )}
        </Container>
      </Form>
    </>
  );
};

export default Scores;
