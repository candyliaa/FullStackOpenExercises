import { useState } from "react";
import blogService from "../services/blogs";
import { useNotification } from "../context/NotificationContext";

const Blog = ({ blog, setBlogs, blogs, setMessage, handleLike, user }) => {
  const [visible, setVisible] = useState(false);
  const [, dispatch] = useNotification();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.deleteBlog(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));

        dispatch({
          type: "SET_NOTIFICATION",
          payload: `deleted blog ${blog.title} by ${blog.author}`,
        });
        setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
      } catch (error) {
        console.error("couldn't delete blog:", error);

        dispatch({
          type: "SET_NOTIFICATION",
          payload: "error: can't delete blog",
        });
        setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
      }
    }
  };

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-summary">
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      {visible && (
        <div className="blog-details">
          <p>{blog.url}</p>
          <p>
            {blog.likes} likes
            <button onClick={() => handleLike(blog)} className="like-button">
              like
            </button>
          </p>
          {blog.user ? (
            <p>{blog.user.name || blog.user.username}</p>
          ) : (
            <p>unknown user</p>
          )}
          {user.username === blog.user.username && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
