const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  if (blogs) {
    response.status(200).json(blogs.map((b) => b.toJSON()));
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const user = await User.findById(request.user.id);

  if (!user) {
    return response.status(400).json({ error: "userId missing or not valid" });
  }

  if (!body.title || !body.url) {
    return response.status(400).end();
  }
  if (!body.likes) {
    body.likes = 0;
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();

  const populatedBlog = await savedBlog.populate("user", {
    username: 1,
    name: 1,
  });

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(populatedBlog);
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const { likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  ).populate("user", { username: 1, name: 1 });

  if (!updatedBlog) return response.status(404).end();

  response.status(200).json(updatedBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const id = request.params.id;

    const user = request.user;

    if (!user || !user.id) {
      return response.status(401).json({ error: "invalid or missing token" });
    }

    const blog = await Blog.findById(id);
    if (!blog) return response.status(404).end();

    if (blog.user.toString() !== user.id.toString()) {
      return response
        .status(403)
        .json({ error: "can't delete: not the creator" });
    }
    await Blog.findByIdAndDelete(id);
    response.status(204).end();
  }
);

module.exports = blogsRouter;
