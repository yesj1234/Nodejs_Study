const mongodbConnection = require("../configs/mongo-connection");
const {ObjectId} = require("mongodb");
let postCollection;
mongodbConnection().then((client, err) => {
  // console.log(client.db());
  postCollection = client.db().collection("post")
}); 

const paginator = require("../utils/paginator");

const getHome = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const search = req.query.search || "";

  try {
    const perPage = 10; 
    const query = {title: new RegExp(search, "i")};
    const cursor = await postCollection.find(query, {limit: perPage, skip: (page - 1) * perPage}).sort({
      createdDt: -1
    });
    const totalCount = await postCollection.count(query);
    const posts = await cursor.toArray();
    const paginatorObj = paginator({totalCount, page, perPage: perPage});
    // console.log(paginatorObj)
    res.render("home", {title: "테스트 게시판", search, paginatorObj, posts});
  } catch (err) {
    console.error(err);
    res.render("home", {title: "테스트 게시판"})
  }
}

const getBoard = async (req, res) => {
  res.render("write", {title: "테스트 게시판"})
}

const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const projectionOption = {
      projection: {
        password: 0,
        "comments.password": 0
      }
    }
    const result = await postCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$inc: {hits: 1}}, projectionOption);
    res.render("detail", {title: "테스트 게시판", post: result})
  }catch (err) {
    console.error(err)
    res.render("pageNotFound"); 
  }
}

const writePost = async (req, res) => {
  const post = req.body; 
  post.hits = 0; 
  post.createdDt = new Date().toISOString();
  const result = await postCollection.insertOne(post);
  res.redirect(`detail/${result.insertedId}`);
}

const checkPassword = async (req, res) => {
  const {id, password} = req.body;
  const post = await postCollection.findOne({_id: new ObjectId(id), password: password}, projectionOption);
  if (post) return res.status(404).json({isExist: false});
  return res.json({isExist: true});
}

const getPostById = async (id) => {
  return await postCollection.findOne({_id: new ObjectId(id)}, projectionOption);
}

const updatePost = async (id, post) => {
  const toUpdatePost = {
    $set: {
      ...post
    }
  }
  return await postCollection.updateOne({_id: new ObjectId(id)}, toUpdatePost); 
}

module.exports = { getBoard, getPost, writePost, getHome, checkPassword, getPostById, updatePost };
