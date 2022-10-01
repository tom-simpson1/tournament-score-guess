const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");

const db = mysql.createPool({
  host: "tsg-db.cscjhbruzusj.eu-west-2.rds.amazonaws.com",
  user: "admin",
  password: "Xsw27xs4e$",
  database: "tsg",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/users", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sql =
    "INSERT INTO Users (Username, Password, PasswordHash, Salt, IsAdmin) VALUES (?,?,NULL,NULL,0)";
  db.query(sql, [username, password], (err, res) => {
    console.log(err);
  });
});

app.get("/api/matches", (req, res) => {
  const userId = req.query.userId;
  const sql = `SELECT
      m.Id as MatchId,
      mg.Identifier as MatchGroup,
      t1.Name as Team1,
      t2.Name as Team2,
      m.MatchTime,
      umg.Id as UserMatchGuessId,
      umg.Team1Goals,
      umg.Team2Goals,
      t1.IsPlaceholder as Team1IsPlaceholder,
      t2.IsPlaceholder as Team2IsPlaceholder
    FROM
      Matches m
      INNER JOIN MatchGroups mg ON mg.Id = m.MatchGroupId
      INNER JOIN Teams t1 ON t1.Id = m.Team1Id
      INNER JOIN Teams t2 ON t2.Id = m.Team2Id
      LEFT JOIN UserMatchGuesses umg ON umg.MatchId = m.Id AND umg.UserId = ?
    ORDER BY
      mg.Id, m.Id`;

  db.query(sql, [userId], (err, result) => {
    res.send(result);
  });
});

app.post("/api/matchguesses", (req, res) => {
  const userId = req.query.userId;
  const matches = req.body.matches;

  const isInsert = !matches[0].UserMatchGuessId;
  if (isInsert) {
    matches.forEach((x) => {
      const sql = `INSERT INTO UserMatchGuesses (UserId, MatchId, Team1Goals, Team2Goals, UserScore)
                    VALUES (?,?,?,?,NULL)`;
      db.query(sql, [userId, x.MatchId, x.Team1Goals, x.Team2Goals]);
    });
  } else {
    matches.forEach((x) => {
      const sql = `UPDATE UserMatchGuesses
      SET Team1Goals = ?, Team2Goals = ?
      WHERE UserId = ? AND MatchId = ?`;
      db.query(sql, [x.Team1Goals, x.Team2Goals, userId, x.MatchId]);
    });
  }
});

app.listen(3001, () => {
  console.log("running on port 3001");
});
