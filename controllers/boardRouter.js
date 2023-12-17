const router = require("express").Router();
const { getBoard, writePost, getPost, getHome, checkPassword,getPostById, updatePost} = require("../services/board.js");
router.get("/", getHome);
router.get("/write", getBoard);
router.post("/write", writePost);

router.get("/detail/:id", getPost);
router.post("/check-password", checkPassword);
module.exports = router;
