// const http = require("http")
const url = require("url")
const express = require("express")
const app = express()

const port = 8888


const user = (req, res) => {
    const userInfo = url.parse(req.url, true).query
    res.end(`[user] name: ${userInfo.name}, age: ${userInfo.age}`)
}

const feed = (req, res) => {
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


app.get("/user", user)
app.get("/feed", feed)
app.listen(port, ()=> console.log(`Server started on ${port}`))
