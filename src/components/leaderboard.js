import Axios from "axios";
import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import NavigationBar from "./layout/navigation-bar";

const Leaderboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/leaderboard`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        console.log(response);
        setData(response.data);
      })
      .catch(() => {
        navigate("/");
      });
  }, []);

  return (
    <>
      <NavigationBar activeKey="leaderboard" />
      <h2 className="pt-3">{auth.user?.tournamentName} - Leaderboard</h2>
      <Row className="mx-auto">
        <Col className="mx-auto p-2" md="10" lg="4">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0
                ? data.map((x, idx) => {
                    let pos = idx;

                    for (; pos > -1; pos--) {
                      if (
                        !data[pos - 1] ||
                        data[pos - 1].TotalPoints > data[idx].TotalPoints ||
                        data[pos - 1].CorrectScores > data[idx].CorrectScores
                      ) {
                        pos++;
                        break;
                      }
                    }
                    return (
                      <tr key={`leaderboard-row-${idx}`}>
                        <td>{pos}</td>
                        <td>{x.Username}</td>
                        <td>{x.TotalPoints}</td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};

export default Leaderboard;
