const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  if (blogs) {
    response.status(200).json(blogs);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/blogs", async (request, response) => {
  const blog = new Blog(request.body);
  const savedBlog = blog.save();
  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
