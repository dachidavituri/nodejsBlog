const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("", async (req, res) => {
  try {
    let perPage = 5;
    let page = req.query.page || 1;
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage);
    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    res.render("index", {
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Post.findById({ _id: slug });
    res.render("post", { data });
  } catch (error) {
    console.log(error);
  }
});

router.post("/search", async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    res.render("search", { data });
  } catch (error) {
    console.log(error);
  }
});

// function insertPostData() {
//   Post.insertMany([
//     {
//     title: "Getting Started with Node.js",
//     body: "Node.js is a JavaScript runtime that allows you to run JavaScript outside the browser. It is built on Chrome’s V8 engine and is widely used for building fast and scalable backend applications."
//   },
//   {
//     title: "Understanding Express.js Basics",
//     body: "Express.js is a minimal and flexible Node.js framework. It simplifies routing, middleware handling, and server creation, making backend development faster and easier."
//   },
//   {
//     title: "What is MVC Architecture?",
//     body: "MVC stands for Model-View-Controller. It helps organize your code by separating data logic, user interface, and application control, making projects easier to maintain."
//   },
//   {
//     title: "Connecting MongoDB to Node.js",
//     body: "MongoDB is a NoSQL database that stores data in JSON-like documents. Using Mongoose, you can easily connect MongoDB to a Node.js application and manage data models."
//   },
//   {
//     title: "Building Your First Blog with Express",
//     body: "A blog application is a great way to practice backend skills. It involves routing, database operations, templating engines like EJS, and CRUD functionality."
//   },
//   {
//     title: "What is EJS and How It Works",
//     body: "EJS is a templating engine that lets you generate HTML using JavaScript. It allows dynamic content rendering by embedding JavaScript directly into HTML."
//   },
//   {
//     title: "Understanding REST APIs",
//     body: "REST APIs allow communication between client and server using HTTP methods such as GET, POST, PUT, and DELETE. They follow a stateless architecture."
//   },
//   {
//     title: "Error Handling in Express",
//     body: "Proper error handling improves application stability. Express allows centralized error handling using middleware and try-catch blocks in async routes."
//   },
//   {
//     title: "Authentication Basics for Web Apps",
//     body: "Authentication verifies user identity. Common methods include sessions, cookies, and JSON Web Tokens (JWT), which are widely used in modern web applications."
//   },
//   {
//     title: "Deploying a Node.js Application",
//     body: "Deploying a Node.js app involves preparing environment variables, choosing a hosting platform, and ensuring your app runs reliably in production."
//   }
//   ]);
// }
// insertPostData()

router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
