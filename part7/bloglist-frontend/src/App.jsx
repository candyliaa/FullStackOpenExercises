import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import "./index.css";
import { useNotification } from "./context/NotificationContext";

const App = () => {
  const [, dispatch] = useNotification();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) =>
        setBlogs(
          blogs
            .map((b) => ({ ...b, id: b.id || b._id.toString() }))
            .sort((a, b) => b.likes - a.likes)
        )
      );
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setSortedBlogs(blogs.concat(returnedBlog));
      dispatch({
        type: "SET_NOTIFICATION",
        payload: `a new blog ${blogObject.title} added`,
      });
      setNewBlogTitle("");
      setNewBlogAuthor("");
      setNewBlogUrl("");
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    } catch (error) {
      console.error(
        "unable to create blog:",
        error.response?.data || error.message
      );
      dispatch({
        type: "SET_NOTIFICATION",
        payload: "error: blog missing either title or url",
      });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    }
  };

  const setSortedBlogs = (blogs) => {
    setBlogs(blogs.sort((a, b) => b.likes - a.likes));
  };

  const handleBlogTitleChange = async (event) => {
    setNewBlogTitle(event.target.value);
  };

  const handleBlogAuthorChange = async (event) => {
    setNewBlogAuthor(event.target.value);
  };

  const handleBlogUrlChange = async (event) => {
    setNewBlogUrl(event.target.value);
  };

  const handleLike = async (blog) => {
    try {
      const blogId = blog.id || blog._id;
      const newLikes = (blog.likes || 0) + 1;
      const updatedBlog = await blogService.updateLikes(blogId, newLikes);
      setSortedBlogs(blogs.map((b) => (b.id !== blog.id ? b : updatedBlog)));
    } catch (error) {
      console.error("couldn't like blog:", error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error(error.response?.data || error.message);
      dispatch({
        type: "SET_NOTIFICATION",
        payload: "error: wrong username or password",
      });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => (
    <Togglable buttonLabel="new blog">
      <BlogForm
        onSubmit={addBlog}
        newBlogTitle={newBlogTitle}
        newBlogAuthor={newBlogAuthor}
        newBlogUrl={newBlogUrl}
        handleBlogTitleChange={handleBlogTitleChange}
        handleBlogAuthorChange={handleBlogAuthorChange}
        handleBlogUrlChange={handleBlogUrlChange}
      />
    </Togglable>
  );

  const showBlogs = () => (
    <div className="blog-list">
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          blogs={blogs}
          setBlogs={setSortedBlogs}
          handleLike={handleLike}
          user={user}
        />
      ))}
    </div>
  );

  const logOutButton = () => (
    <div>
      <button onClick={handleLogout}>log out</button>
    </div>
  );

  if (user === null) {
    return (
      <div>
        <Notification />
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      {logOutButton()}
      <h1>Blogs</h1>
      <Notification />
      {blogForm()}
      {showBlogs()}
    </div>
  );
};

export default App;
