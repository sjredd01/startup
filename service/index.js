const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const express = require("express");
const uuid = require("uuid");
const app = express();

const authCookieName = "token";

let users = [];
let UserScores = [];
let AllTimeScores = [];

app.use(express.json());
app.use(cookieParser());
const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.static("public"));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post("/auth/create", async (req, res) => {
  if (await findUser("email", req.body.email)) {
    res.status(409).send({ msg: "Existing user" });
  } else {
    const user = await createUser(req.body.email, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// GetAuth login an existing user
apiRouter.post("/auth/login", async (req, res) => {
  const user = await findUser("email", req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: "Unauthorized" });
});

// DeleteAuth logout a user
apiRouter.delete("/auth/logout", async (req, res) => {
  const user = await findUser("token", req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser("token", req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
};

// GetUserScores
apiRouter.get("/scores", verifyAuth, (_req, res) => {
  res.send(UserScores);
});

// Get all time scores
apiRouter.get("/alltimescores", verifyAuth, (_req, res) => {
  res.send(AllTimeScores);
});

// Submit UserScore
apiRouter.post("/score", verifyAuth, (req, res) => {
  scores = updateScores(req.body);
  res.send(UserScores);
});

// Submit AllTimeScore
apiRouter.post("/alltimescore", verifyAuth, (req, res) => {
  scores = updateAllTimeScores(req.body);
  res.send(AllTimeScores);
});

// updateScores considers a new score for inclusion in the high scores.
function updateScores(newScore) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 10) {
    scores.length = 10;
  }

  return scores;
}

// updateAllTimeScores considers a new score for inclusion in the all time high scores.
function updateAllTimeScores(newScore) {
  let found = false;
  for (const [i, prevScore] of AllTimeScores.entries()) {
    if (newScore.score > prevScore.score) {
      AllTimeScores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    AllTimeScores.push(newScore);
  }

  if (AllTimeScores.length > 10) {
    AllTimeScores.length = 10;
  }

  return AllTimeScores;
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});
