const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const assert = require("node:assert");
const blog = require("../models/blog");

const api = supertest(app);

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
});

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
  const blogs = await Blog.find({});
  assert.ok(blogs[0].id, "blog has id field");
  assert.strictEqual(blog._id, undefined, "blog shouldn't have _id field");
});

test("new blog can be created", async () => {
  const newBlog = {
    _id: "5a422aa71b54a676234d17f2",
    title: "Test Blog",
    author: "Test Author",
    url: "https://example.com",
    likes: 10,
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

after(async () => {
  await mongoose.connection.close();
});
