let blogs = [
  {
    id: "1",
    title: "Test blog",
    author: "Tester Author",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: {
      username: "root",
      name: "root",
    },
  },
  {
    id: "2",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: {
      username: "ada",
      name: "Ada Lovelace",
    },
  },
  {
    likes: 13,
    id: "3",
  },
  {
    id: "4",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    user: {
      username: "Test2",
      name: "Test Person2",
    },
  },
  {
    id: "f4c3",
    title: "dfgydfg",
    author: "fyjtyj",
    url: "werwer",
  },
];

const getAll = () => {
  return new Promise((resolve) => setTimeout(() => resolve([...blogs]), 100));
};

const create = async (blog) => {
  const newBlog = { ...blog, id: `b${blogs.length + 1}`, likes: 0 };
  blogs = [...blogs, newBlog];
  return new Promise((resolve) => setTimeout(() => resolve(newBlog), 100));
};

const updateLikes = async (id, likes) => {
  blogs = blogs.map((b) => (b.id === id ? { ...b, likes } : b));
  return new Promise((resolve) =>
    setTimeout(() => resolve(blogs.find((b) => b.id === id)), 100)
  );
};

const deleteBlog = async (id) => {
  blogs = blogs.filter((b) => b.id !== id);
  return new Promise((resolve) => setTimeout(resolve, 100));
};

export default { getAll, create, updateLikes, deleteBlog };
