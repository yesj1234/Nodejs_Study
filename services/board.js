const mongodbConnection = require("../configs/mongo-connection.js");

const mongoClient = await mongodbConnection();

class boardService {
  constructor() {
    this.boardClient = mongoClient;
  }
  getBoard(req, res) {
    res.render("write", { title: "테스트 게시판" });
  }

  getPost(req, res) {
    res.render("detail", { title: "테스트 게시판" });
  }
}

const boardServiceInstance = new boardService();
module.exports = { boardServiceInstance };
