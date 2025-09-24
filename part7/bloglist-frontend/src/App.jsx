import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import Users from "./components/Users";
import "./index.css";
import { useNotification } from "./context/NotificationContext";
import { useUser } from "./context/UserContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Routes, Route, Link } from "react-router-dom";

const App = () => {
  const [, dispatch] = useNotification();
  const [user, userDispatch] = useUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");

  const queryClient = useQueryClient();

  const res = useQuery({
    queryKey: ["blogs"],
    queryFn: () => blogService.getAll(),
  });

  const addBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => queryClient.invalidateQueries(["blogs"]),
  });

  const likeBlogMutation = useMutation({
    mutationFn: ({ id, likes }) => blogService.updateLikes(id, likes),
    onSuccess: () => queryClient.invalidateQueries(["blogs"]),
  });

  const deleteBlogMutation = useMutation({
    mutationFn: (id) => blogService.deleteBlog(id),
    onSuccess: () => queryClient.invalidateQueries(["blogs"]),
  });

  const blogs = res.data;

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "LOGIN", payload: user });
    }
  }, [userDispatch]);

  const addBlog = async (blogObject) => {
    try {
      const blogWithUser = { ...blogObject, user };
      addBlogMutation.mutate(blogWithUser);
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
    likeBlogMutation.mutate({ id: blog.id, likes: blog.likes + 1 });
  };

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog.id, {
        onSuccess: () => {
          dispatch({
            type: "SET_NOTIFICATION",
            payload: `deleted blog ${blog.title} by ${blog.author}`,
          });
          setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
        },
        onError: () => {
          dispatch({
            type: "SET_NOTIFICATION",
            payload: "error: can't delete blog",
          });
          setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
        },
      });
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({ username, password });
      window.localStorage.setItem(
        "loggedBlogappUser",
        JSON.stringify(loggedUser)
      );
      userDispatch({ type: "LOGIN", payload: loggedUser });
      setUsername("");
      setPassword("");
    } catch (error) {
      dispatch({
        type: "SET_NOTIFICATION",
        payload: "error: wrong username or password",
      });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    userDispatch({ type: "LOGOUT" });
  };

  if (res.isLoading) return <div>loading data...</div>;

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
      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
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
      <nav>
        <Link to="/">Blogs</Link> | <Link to="/users">Users</Link>
        {logOutButton()}
      </nav>

      <Notification />

      <Routes>
        <Route
          path="/"
          element={
            <>
              {blogForm()}
              {showBlogs()}
            </>
          }
        />
        <Route path="/users" element={<Users blogs={blogs} />} />
      </Routes>
    </div>
  );
};

export default App;
