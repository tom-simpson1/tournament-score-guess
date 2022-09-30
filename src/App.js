import { useState, useEffect } from "react";
import "./App.css";
import Axios from "axios";
import { Row, Col, Button, Form, Card, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { format } from "date-fns";

const App = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/matches?userId=1").then((response) => {
      // console.log(response);
      setMatches(response.data);
    });
  }, []);

  const submit = () => {};

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
      <h1>Qatar World Cup 2022 - Predictions</h1>

      <Form className="form">
        <Container fluid>
          {matches.length > 0
            ? groupBy(matches, "MatchGroup").map((g) => {
                return (
                  <Row className="mx-auto">
                    <Col className="mx-auto p-1" md="10" lg="4">
                      <Card>
                        <Card.Body>
                          <Card.Title className="px-0">{g.key}</Card.Title>
                          <Row>
                            {g.values.map((m) => {
                              return (
                                <Container fluid>
                                  <Row
                                    className="p-1"
                                    style={{ alignItems: "center" }}
                                  >
                                    <Col>
                                      <label>{m.Team1}</label>
                                    </Col>
                                    <Col xs="4">
                                      <input
                                        inputMode="number"
                                        min="0"
                                        max="99"
                                      />
                                      {"  -  "}
                                      <input
                                        inputMode="number"
                                        min="0"
                                        max="99"
                                      />
                                    </Col>
                                    <Col>
                                      <label>{m.Team2}</label>
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
        </Container>
        <Button className="m-3" onClick={submit}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default App;
