const router = require("express").Router();
const { boardServiceInstance } = require("../services/board.js");
router.get("/", (req, res) => {
  res.render("home", { title: "Hello", message: "Nice to meet you" });
});

router.get("/write", boardServiceInstance.getBoard);

router.get("/detail/:id", boardServiceInstance.getPost);
module.exports = router;
