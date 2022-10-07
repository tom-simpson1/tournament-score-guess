const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");

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

// app.post("/api/users", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   const sql =
//     "INSERT INTO Users (Username, Password, PasswordHash, Salt, IsAdmin) VALUES (?,?,NULL,NULL,0)";
//   db.query(sql, [username, password], (err, res) => {
//     console.log(err);
//   });
// });

app.post("/api/register", (req, res) => {
  const code = req.body.code;

  const codeCheckSql = `SELECT * FROM Users WHERE Password = ? LIMIT 1`;
  db.query(codeCheckSql, [code], (err, rows) => {
    if (err) return res.send({ message: err });

    if (rows.length === 0) return res.send({ message: "Code doesn't exist." });
  });

  const username = req.body.username;

  const usernameCheckSql = `SELECT * FROM Users WHERE Username = ?`;
  db.query(usernameCheckSql, [username], (err, rows) => {
    if (err) return res.send({ message: err });

    if (rows.length > 0)
      return res.send({ message: "Username already in use." });
  });

  const email = req.body.email;
  const password = req.body.password;
  const salt = req.body.salt;
  const updateSql = `UPDATE Users
                      SET Username = ?, Email = ?, PasswordHash = ?, Salt = ?, Password = NULL
                      WHERE Password = ?`;
  db.query(updateSql, [username, email, password, salt, code], (err) => {
    if (err) return res.send({ message: err });
  });

  const getUserSql = "SELECT * FROM Users WHERE Username = ?";
  db.query(getUserSql, [username], (err, rows) => {
    if (err) return res.send({ message: err });

    if (rows[0]) return res.send({ user: rows[0] });
    else return res.send({ message: "Something went wrong." });
  });
});

app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const invalidMessage = "Username or password incorrect.";

  const getUserSql = "SELECT * FROM Users WHERE Username = ?";
  db.query(getUserSql, [username], (err, rows) => {
    if (err) return res.send({ message: err });
    if (!rows[0]) return res.send({ message: invalidMessage });

    const salt = rows[0].Salt;
    const hashedPassword = bcrypt.hashSync(password, salt);

    if (hashedPassword !== rows[0].PasswordHash.toString())
      return res.send({ message: invalidMessage });

    res.send({ user: rows[0] });
  });
});

app.get("/api/matches", (req, res) => {
  const userId = req.query.userId;
  const tournamentId = req.query.tournamentId;

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
    WHERE
      mg.TournamentId = ?
    ORDER BY
      mg.Id, m.Id`;

  db.query(sql, [userId, tournamentId], (err, rows) => {
    res.send(rows);
  });
});

app.post("/api/guesses", (req, res) => {
  const userId = req.query.userId;
  const tournamentId = req.query.tournamentId;
  const matches = req.body.matches;
  const tieBreakAnswer = req.body.tieBreakAnswer;

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

  const sql = `UPDATE TournamentUsers SET TieBreakAnswer = ? WHERE TournamentId = ? AND userId = ?`;
  db.query(sql, [tieBreakAnswer, tournamentId, userId]);
});

app.get("/api/tournament", (req, res) => {
  const tournamentId = req.query.tournamentId;
  const userId = req.query.userId;

  const sql = `SELECT t.Name, t.TieBreakQuestion, tu.TieBreakAnswer
                FROM Tournaments t
                INNER JOIN TournamentUsers tu ON tu.TournamentId = t.Id
                WHERE t.Id = ? AND tu.UserId = ?`;
  db.query(sql, [tournamentId, userId], (err, rows) => {
    res.send(rows[0]);
  });
});

app.listen(3001, () => {
  console.log("running on port 3001");
});
