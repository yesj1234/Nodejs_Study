require("dotenv").config()
const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
// const mongodbConnection = require("./configs/mongo-connection");

const boardRouter = require("./controllers/boardRouter");
app.engine("handleBars", handlebars.create({
  helpers: require("./configs/handlebars-helper.js")
}).engine);
app.set("view engine", "handleBars");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.urlencoded({extended: true}))



app.use("/", boardRouter);

const PORT = process.env.PORT || 3000;
console.log(PORT)
let collection;
app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
});
