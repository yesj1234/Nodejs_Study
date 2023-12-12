const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const boardRouter = require("./controllers/boardRouter");

app.engine("handleBars", handlebars.engine());
app.set("view engine", "handleBars");
app.set("views", __dirname + "/views");

app.use("/", boardRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
