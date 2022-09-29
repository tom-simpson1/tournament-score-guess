import { useState, useEffect } from "react";
import "./App.css";
import Axios from "axios";

const App = () => {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/matches?userId=1").then((response) => {
      console.log(response);
      setMatches(response.data);
    });
  }, []);

  const submit = () => {
    // Axios.post("http://localhost:3001/api/users", {
    //   username: username,
    //   password: password,
    // }).then(() => {
    //   alert("successful insert");
    // });
  };

  return (
    <div className="App">
      <h1>Tournament Score Guess</h1>

      <div className="form">
        {matches.map((x) => {
          return (
            <div>
              {x.Team1}
              <span>
                <input type="text" onChange={(e) => {}}></input>
                {" - "}
                <input type="text" onChange={(e) => {}}></input>
              </span>
              {x.Team2}
            </div>
          );
        })}

        {/* <label>Username</label>
        <input
          type="text"
          name="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        ></input>
        <label>Password</label>
        <input
          type="text"
          name="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input> */}

        <button onClick={submit}>Submit</button>
      </div>
    </div>
  );
};

export default App;
