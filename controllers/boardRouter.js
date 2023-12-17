const router = require("express").Router();
const {
  getBoard,
  writePost,
  getPost,
  getHome,
  checkPassword,
  getPostById,
  updatePost,
  renderPost,
  modifyPost,
  deletePost,
  writeComment,
  deleteComment,
} = require("../services/board.js");
router.get("/", getHome);
router.get("/write", getBoard);
router.post("/write", writePost);

router.get("/detail/:id", getPost);
router.post("/check-password", checkPassword);
router.get("/modify/:id", renderPost);
router.post("/modify/", modifyPost);
router.delete("/delete", deletePost);
router.post("/write-comment", writeComment);
router.delete("/delete-comment", deleteComment);
module.exports = router;
