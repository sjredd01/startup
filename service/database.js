const { MongoClient } = require("mongodb");
const config = require("./dbConfig.json");

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db("startup");
const personalHighScoresCollection = db.collection("personalHighScores");
const allTimeScoresCollection = db.collection("allTimeScores");
const usersCollection = db.collection("users");

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(
      `Unable to connect to database with ${url} because ${ex.message}`
    );
    process.exit(1);
  }
})();

function getUser(email) {
  return usersCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return usersCollection.findOne({ token: token });
}

async function addUser(user) {
  await usersCollection.insertOne(user);
}

async function updateUser(user) {
  await usersCollection.updateOne({ email: user.email }, { $set: user });
}

async function addPersonalScore(score) {
  await personalHighScoresCollection.insertOne(score);
}

async function addAllTimeScore(score) {
  await allTimeScoresCollection.insertOne(score);
}

async function getPersonalScores(email) {
  return await personalHighScoresCollection
    .find({ user: email })
    .sort({ score: -1 })
    .limit(10)
    .toArray();
}

async function getAllTimeScores() {
  return await allTimeScoresCollection
    .find({})
    .sort({ score: -1 })
    .limit(10)
    .toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addAllTimeScore,
  addPersonalScore,
  getPersonalScores,
  getAllTimeScores,
};
