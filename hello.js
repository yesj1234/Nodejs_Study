// const http = require("http")
const url = require("url")
const express = require("express")
const app = express()

const port = 8888

let users = []; 
let feeds = []; 

/**
 * Entry API
 */
const entry = (req, res) =>{
    // urlInfo = url.parse(req.url, true);
    res.end("Hello world!")
}
/**
 * User APIs 
 */
function _userExists(id) {
    console.log(users)
    console.log(users[id])
    if (users[id]) return true;
    return false
}
const getUser = (req, res) => {
    const userInfo = url.parse(req.url, true).query
    if (_userExists(userInfo.id)) {
        res.end(users[userInfo.id])
    } else {
        res.end(`User not found with such Id.`)
    }
}

const createUser = (req,res) => {
    const userInfo = url.parse(req.url, true).query
    users.append({"name": userInfo.name, "age": userInfo.age});
    res.end("User created.")
}

const deleteUser = (req, res) => {
    const userId = url.parse(req.url, true).query
    if (_userExists(userId)) {
        delete users[userId]
        res.end(`User ${userId} deleted.`)
    } else {
        res.end("User not found with such Id.")
    }
}
/**
 * Feed APIs
 */
const getFeed = (req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"})
    res.end(`
    <ul>
    <li>list1</li>
    <li>list2</li>
    <li>list3</li>
    </ul>`)
}
const notFound = (req,res)=>{
    res.writeHead(404, {"Content-Type": "text/html"})
    res.end("404 Not Found");
}

app.get("/", entry)
app.get("/user", getUser)
app.post("/user", createUser)
app.delete("/user/:id", deleteUser)
app.get("/feed", getFeed)

app.listen(port, ()=> console.log(`Server started on ${port}`))
