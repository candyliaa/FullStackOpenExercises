const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const listWithOneblog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  const listWithNoBlog = [];

  const listWithManyBlogs = [
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
      title: "CS at University of Helsinki",
      author: "Studious Student",
      url: "https://studies.cs.helsinki.fi/",
      likes: 10,
      __v: 0,
    },
  ];

  test("when list has one blog, equals the likes of that blog", () => {
    const result = listHelper.totalLikes(listWithOneblog);
    assert.strictEqual(result, 5);
  });

  test("when list is empty, likes is zero", () => {
    const result = listHelper.totalLikes(listWithNoBlog);
    assert.strictEqual(result, 0);
  });

  test("when list has multiple blogs, likes is equal to sum of blog likes", () => {
    const result = listHelper.totalLikes(listWithManyBlogs);
    assert.strictEqual(result, 15);
  });
});
