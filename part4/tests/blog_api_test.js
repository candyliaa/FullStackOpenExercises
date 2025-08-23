const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const assert = require("node:assert");
const User = require("../models/user");

const api = supertest(app);

const initialUsers = [
  {
    _id: "5a422aa71b54a676234d17f1",
    username: "root",
    name: "Root Person",
    password: "secret",
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f2",
    username: "root2",
    name: "Root Person",
    password: "secret",
    __v: 0,
  },
];

const initialBlogs = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f9",
    title: "Bachelor's CS at University of Helsinki",
    author: "Studious Student",
    url: "https://studies.cs.helsinki.fi/",
    likes: 10,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);

  await User.deleteMany({});
  await User.insertMany(initialUsers);
});

describe("blogs are fetched correctly", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test("id property is named id", async () => {
    const response = await api.get("/api/blogs");
    const blog = response.body[0];

    assert.ok(blog.id, "blog has id field");
    assert.strictEqual(blog._id, undefined, "blog shouldn't have _id field");
  });
});

describe("blogs are created correctly", () => {
  test("new blog can be created", async () => {
    const newBlog = {
      _id: "5a422aa71b54a676234d17f2",
      title: "Test Blog",
      author: "Test Author",
      url: "https://example.com",
      likes: 10,
      userId: "5a422aa71b54a676234d17f2",
      __v: 0,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const titles = response.body.map((r) => r.title);
    assert.strictEqual(response.body.length, initialBlogs.length + 1);
    assert(titles.includes("Test Blog"));
  });

  test("if likes is missing from request, it's set to zero", async () => {
    const newBlog = {
      _id: "5a422aa71b54a676234d17f4",
      title: "No likes",
      author: "Studious Student",
      url: "https://studies.cs.helsinki.fi/",
      userId: "5a422aa71b54a676234d17f2",
      __v: 0,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const blog = response.body.find((b) => b.title === "No likes");
    assert.strictEqual(blog.likes, 0);
  });

  test("blog with missing url returns 400", async () => {
    const noUrlBlog = {
      title: "URLs are a mystery",
      author: "I don't know what a url is",
      userId: "5a422aa71b54a676234d17f2",
    };

    await api.post("/api/blogs").send(noUrlBlog).expect(400);
  });

  test("blog with missing title returns 400", async () => {
    const noTitleBlog = {
      author: "I don't know what a title is",
      url: "https://google.com",
      userId: "5a422aa71b54a676234d17f2",
    };

    await api.post("/api/blogs").send(noTitleBlog).expect(400);
  });
});

describe("blogs can be deleted", () => {
  test("blog can be deleted", async () => {
    const id = "5a422aa71b54a676234d17f8";
    await api.delete(`/api/blogs/${id}`).expect(204);
  });
});

describe("blogs can be updated", () => {
  test("blog likes can be updated", async () => {
    const id = "5a422aa71b54a676234d17f8";

    const blogToBeUpdated = await Blog.findById(id);
    const updatedBlog = {
      ...blogToBeUpdated,
      likes: 69,
    };

    await api
      .put(`/api/blogs/${id}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updated = await Blog.findById(id);
    assert.strictEqual(updated.likes, 69);
  });
});

after(async () => {
  await mongoose.connection.close();
});
