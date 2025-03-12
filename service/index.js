const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const express = require("express");
const uuid = require("uuid");
const cors = require("cors");
const app = express();

const authCookieName = "token";

let users = [];
let UserScores = [];
let AllTimeScores = [];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Update this line
const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.static("public"));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post("/auth/create", async (req, res) => {
  console.log("Received request to create user:", req.body);
  if (await findUser("email", req.body.email)) {
    res.status(409).send({ msg: "Existing user" });
  } else {
    try {
      const user = await createUser(req.body.email, req.body.password);
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send({ msg: "Internal Server Error" });
    }
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

// CheckAuth status
apiRouter.get("/auth/status", async (req, res) => {
  const token = req.cookies[authCookieName];
  const user = await findUser("token", token);
  if (user) {
    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const user = await findUser("token", token);
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
apiRouter.post("/score", (req, res) => {
  // Removed verifyAuth
  try {
    UserScores = updateScores(req.body);
    res.send(UserScores);
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

// Submit AllTimeScore
apiRouter.post("/alltimescore", (req, res) => {
  // Removed verifyAuth
  try {
    AllTimeScores = updateAllTimeScores(req.body);
    res.send(AllTimeScores);
  } catch (error) {
    console.error("Error saving all-time score:", error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

// updateScores considers a new score for inclusion in the high scores.
function updateScores(newScore) {
  let found = false;
  for (const [i, prevScore] of UserScores.entries()) {
    if (newScore.score > prevScore.score) {
      UserScores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    UserScores.push(newScore);
  }

  if (UserScores.length > 10) {
    UserScores.length = 10;
  }

  return UserScores;
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
    secure: true, // Ensure this is set to true if using HTTPS
    httpOnly: true,
    sameSite: "strict",
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Default error handler
app.use(function (err, req, res, next) {
  console.error("Unhandled error:", err);
  res.status(500).send({ type: err.name, message: err.message });
});
