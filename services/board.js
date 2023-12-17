const mongodbConnection = require("../configs/mongo-connection");
const { ObjectId } = require("mongodb");
let postCollection;
mongodbConnection().then((client, err) => {
  // console.log(client.db());
  postCollection = client.db().collection("post");
});

const paginator = require("../utils/paginator");
const { update } = require("lodash");

const projectionOption = {
  projection: {
    password: 0,
    "comments.password": 0,
  },
};
const getHome = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";

  try {
    const perPage = 10;
    const query = { title: new RegExp(search, "i") };
    const cursor = await postCollection
      .find(query, { limit: perPage, skip: (page - 1) * perPage })
      .sort({
        createdDt: -1,
      });
    const totalCount = await postCollection.count(query);
    const posts = await cursor.toArray();
    const paginatorObj = paginator({ totalCount, page, perPage: perPage });
    // console.log(paginatorObj)
    res.render("home", { title: "테스트 게시판", search, paginatorObj, posts });
  } catch (err) {
    console.error(err);
    res.render("home", { title: "테스트 게시판" });
  }
};

const getBoard = async (req, res) => {
  res.render("write", { title: "테스트 게시판", mode: "create" });
};

const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await postCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { hits: 1 } },
      projectionOption
    );
    res.render("detail", { title: "테스트 게시판", post: result });
  } catch (err) {
    console.error(err);
    res.render("pageNotFound");
  }
};

const writePost = async (req, res) => {
  const post = req.body;
  post.hits = 0;
  post.createdDt = new Date().toISOString();
  const result = await postCollection.insertOne(post);
  res.redirect(`detail/${result.insertedId}`);
};

const checkPassword = async (req, res) => {
  const { id, password } = req.body;

  const post = await postCollection.findOne(
    { _id: new ObjectId(id), password: password },
    projectionOption
  );
  if (post) return res.status(404).json({ isExist: false });
  return res.json({ isExist: true });
};

const getPostById = async (id) => {
  return await postCollection.findOne(
    { _id: new ObjectId(id) },
    projectionOption
  );
};

const updatePost = async (id, post) => {
  const toUpdatePost = {
    $set: {
      ...post,
    },
  };
  return await postCollection.updateOne(
    { _id: new ObjectId(id) },
    toUpdatePost
  );
};

const renderPost = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const post = await getPostById(id);
  console.log(post);
  res.render("write", { title: "테스트 게시판", mode: "modify", post });
};
const modifyPost = async (req, res) => {
  const { id, title, name, password, content } = req.body;

  const post = {
    title,
    name,
    password,
    content,
    createdDt: new Date().toISOString(),
  };
  const result = updatePost(id, post);
  res.redirect(`/detail/${id}`);
};

const deletePost = async (req, res) => {
  const { id, password } = req.body;
  try {
    const result = await postCollection.deleteOne({
      _id: new ObjectId(id),
      password: password,
    });
    if (result.deletedCount !== 1) {
      console.log("Delete failed");
      return res.json({ isSuccess: false });
    }
    return res.json({ isSuccess: true });
  } catch (err) {
    console.error(err);
    return res.json({ isSuccess: false });
  }
};

const writeComment = async (req, res) => {
  const { id, name, password, comment } = req.body;
  const post = await getPostById(id);
  if (post.comments) {
    post.comments.push({
      idx: post.comments.length + 1,
      name,
      password,
      comment,
      createdDt: new Date().toISOString(),
    });
  } else {
    post.comments = [
      {
        idx: 1,
        name,
        password,
        comment,
        createdDt: new Date().toISOString(),
      },
    ];
  }
  const result = await updatePost(id, post);
  return res.redirect(`detail/${id}`);
};

const deleteComment = async (req, res) => {
  const { id, idx, password } = req.body;
  try {
    const post = await postCollection.findOne(
      {
        _id: new ObjectId(id),
        comments: { $elemMatch: { idx: parseInt(idx), password } },
      },
      projectionOption
    );
    console.log(post);
    if (!post) {
      return res.json({ isSuccess: false });
    }
    post.comments = post.comments.filter((comment) => comment.idx != idx);
    await updatePost(id, post);
    return res.json({ isSuccess: true });
  } catch (err) {
    console.error(err);
    return res.json({ isSuccess: false });
  }
};

module.exports = {
  getBoard,
  getPost,
  writePost,
  getHome,
  checkPassword,
  getPostById,
  updatePost,
  modifyPost,
  renderPost,
  deletePost,
  writeComment,
  deleteComment,
};
