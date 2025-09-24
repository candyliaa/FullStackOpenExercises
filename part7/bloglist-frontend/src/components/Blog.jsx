import { useState } from "react";

const Blog = ({ blog, handleDelete, handleLike, user }) => {
  const [visible, setVisible] = useState(false);

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
          <p>
            {blog.user ? blog.user.name || blog.user.username : "unknown user"}
          </p>

          {blog.user && user.username === blog.user.username && (
            <button onClick={() => handleDelete(blog)}>delete</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
