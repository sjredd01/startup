const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const express = require("express");
const uuid = require("uuid");
const cors = require("cors");
const app = express();
const DB = require("./database.js");

const authCookieName = "token";

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
      await DB.updateUser(user);
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
    await DB.updateUser(user);
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
apiRouter.get("/scores", verifyAuth, async (_req, res) => {
  const UserScores = await DB.getPersonalScores(_req.body.email);
  res.send(UserScores);
});

// Get all time scores
apiRouter.get("/alltimescores", verifyAuth, async (_req, res) => {
  const AllTimeScores = await DB.getAllTimeScores();
  res.send(AllTimeScores);
});

// Submit UserScore
apiRouter.post("/score", verifyAuth, async (req, res) => {
  try {
    console.log("Received score submission:", req.body);
    const updatedScores = await updateScores(req.body);
    console.log("Updated UserScores:", updatedScores);
    res.send(updatedScores);
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

// Submit AllTimeScore
apiRouter.post("/alltimescore", verifyAuth, async (req, res) => {
  try {
    console.log("Received all-time score submission:", req.body);
    const updatedAllTimeScores = await updateAllTimeScores(req.body);
    console.log("Updated AllTimeScores:", updatedAllTimeScores);
    res.send(updatedAllTimeScores);
  } catch (error) {
    console.error("Error saving all-time score:", error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

// updateScores considers a new score for inclusion in the high scores.
async function updateScores(newScore) {
  try {
    await DB.addPersonalScore(newScore);
    return await DB.getPersonalScores(newScore.user.email);
  } catch (error) {
    console.error("Error in updateScores:", error);
    throw error;
  }
}

// updateAllTimeScores considers a new score for inclusion in the all time high scores.
async function updateAllTimeScores(newScore) {
  try {
    await DB.addAllTimeScore(newScore);
    return await DB.getAllTimeScores();
  } catch (error) {
    console.error("Error in updateAllTimeScores:", error);
    throw error;
  }
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await DB.addUser(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === "token") {
    return DB.getUserByToken(value);
  }
  return DB.getUser(value);
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
  console.error("Unhandled error:", err);
  res.status(500).send({ type: err.name, message: err.message });
});
