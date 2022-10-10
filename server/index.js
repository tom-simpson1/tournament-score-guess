const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

const getUser = (token) => {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.REACT_APP_TOKEN_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
};

app.get("/api/user", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const user = getUser(token);

  return (
    res.send({ user }) ??
    res.status(401).send("You are unauthorised to access this page.")
  );
});

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
                      WHERE Password = ?;`;
  //TODO: Add user to current tournament (Add trounament id to token)
  // INSERT INTO TournamentUsers (TournamentId, UserId) VALUES
  // SELECT ((SELECT Id FROM Tournaments WHERE IsActive = 1 LIMIT 1),(SELECT Id FROM Users WHERE Username = ? LIMIT 1))`;
  db.query(
    updateSql,
    [username, email, password, salt, code, username],
    (err) => {
      if (err) return res.send({ message: err });
    }
  );

  res.end();

  // const getUserSql = "SELECT * FROM Users WHERE Username = ?";
  // db.query(getUserSql, [username], (err, rows) => {
  //   if (err) return res.send({ message: err });

  //   if (rows[0]) return res.send({ user: rows[0] });
  //   else return res.send({ message: "Something went wrong." });
  // });
});

app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const invalidMessage = "Username or password incorrect.";

  const getUserSql = `SELECT u.*, t.Name as TournamentName, tu.TournamentId FROM tsg.Users u
                      INNER JOIN tsg.TournamentUsers tu ON tu.UserId = u.Id
                      INNER JOIN tsg.Tournaments t ON t.Id = tu.TournamentId
                      where u.Username = ? AND t.IsActive = 1 LIMIT 1`;

  db.query(getUserSql, [username], (err, rows) => {
    if (err) return res.send({ message: err });
    if (!rows[0]) return res.send({ message: invalidMessage });

    const salt = rows[0].Salt;
    const hashedPassword = bcrypt.hashSync(password, salt);

    if (hashedPassword !== rows[0].PasswordHash.toString())
      return res.send({ message: invalidMessage });

    const user = {
      userId: rows[0].Id,
      username: rows[0].Username,
      isAdmin: rows[0].IsAdmin,
      tournamentName: rows[0].TournamentName,
      tournamentId: rows[0].TournamentId,
    };

    const token = jwt.sign(user, process.env.REACT_APP_TOKEN_KEY, {
      expiresIn: "2h",
    });

    res.send({
      user,
      token: token,
    });
  });
});

app.get("/api/matchpredictions", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const user = getUser(token);

  if (!user) {
    return res.status(401).send("You are unauthorised to access this page.");
  }

  const matchesSql = `SELECT
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

  const predictions = {};
  db.query(matchesSql, [user.userId, user.tournamentId], (err, rows) => {
    predictions.matches = rows;

    const tieBreakSql = `SELECT t.TieBreakQuestion, tu.TieBreakAnswer
    FROM Tournaments t
    INNER JOIN TournamentUsers tu ON tu.TournamentId = t.Id
    WHERE t.Id = ? AND tu.UserId = ?`;
    db.query(tieBreakSql, [user.tournamentId, user.userId], (err, rows) => {
      predictions.tieBreakQuestion = rows[0].TieBreakQuestion;
      predictions.tieBreakAnswer = rows[0].TieBreakAnswer;

      res.send(predictions);
    });
  });

  // res.send({
  //   predictions: {
  //     matches: predictions.matches,
  //     tieBreakQuestion: predictions.TieBreakQuestion,
  //     tieBreakAnswer: predictions.tieBreakAnswer,
  //   },
  // });
});

app.post("/api/matchpredictions", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const user = getUser(token);

  if (!user) {
    return res.status(401).send("You are unauthorised to access this page.");
  }

  const matches = req.body.matches;
  const tieBreakAnswer = req.body.tieBreakAnswer;

  const isInsert = !matches[0].UserMatchGuessId;
  if (isInsert) {
    matches.forEach((x) => {
      const sql = `INSERT INTO UserMatchGuesses (UserId, MatchId, Team1Goals, Team2Goals, UserScore)
                    VALUES (?,?,?,?,NULL)`;
      db.query(sql, [user.userId, x.MatchId, x.Team1Goals, x.Team2Goals]);
    });
  } else {
    matches.forEach((x) => {
      const sql = `UPDATE UserMatchGuesses
      SET Team1Goals = ?, Team2Goals = ?
      WHERE UserId = ? AND MatchId = ?`;
      db.query(sql, [x.Team1Goals, x.Team2Goals, user.userId, x.MatchId]);
    });
  }

  const sql = `UPDATE TournamentUsers SET TieBreakAnswer = ? WHERE TournamentId = ? AND userId = ?`;
  db.query(sql, [tieBreakAnswer, user.tournamentId, user.userId]);

  res.end();
});

// app.get("/api/tournament", (req, res) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   const user = getUser(token);

//   if (!user) {
//     return res.status(401).send("You are unauthorised to access this page.");
//   }

//   const sql = `SELECT t.Name, t.TieBreakQuestion, tu.TieBreakAnswer
//                 FROM Tournaments t
//                 INNER JOIN TournamentUsers tu ON tu.TournamentId = t.Id
//                 WHERE t.Id = ? AND tu.UserId = ?`;
//   db.query(sql, [user.tournamentId, user.userId], (err, rows) => {
//     res.send(rows[0]);
//   });
// });

app.listen(3001, () => {
  console.log("running on port 3001");
});
