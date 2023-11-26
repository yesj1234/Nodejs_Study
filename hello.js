// const http = require("http")
import url from "url";
import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8888;

let users = [];

/**
 * Entry API
 */
const entry = (_, res) => {
  // urlInfo = url.parse(req.url, true);
  res.end("Hello world!");
};

/**
 * User APIs
 */
function _userExists(id) {
  console.log(users);
  console.log(users[id]);
  if (users[id]) return true;
  return false;
}

const getUser = (req, res) => {
  const userInfo = req.query;
  console.log(userInfo);
  if (_userExists(userInfo.id)) {
    res.end(users[userInfo.id]);
  } else {
    res.end(`User not found with such Id.`);
  }
};

const createUser = (req, res) => {
  const userInfo = req.body;
  console.log(userInfo);
  users.push({ name: userInfo.name, age: userInfo.age });
  res.end("User created.");
};

const deleteUser = (req, res) => {
  const userId = req.query;
  if (_userExists(userId)) {
    delete users[userId];
    res.end(`User ${userId} deleted.`);
  } else {
    res.end("User not found with such Id.");
  }
};
/**
 * Feed APIs
 */
const getFeed = (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
    <ul>
    <li>list1</li>
    <li>list2</li>
    <li>list3</li>
    </ul>`);
};

app.get("/", entry);

app.get("/user", getUser);
app.post("/user", createUser);
app.delete("/user/:id", deleteUser);

app.get("/feed", getFeed);

app.listen(port, () => console.log(`Server started on ${port}`));
