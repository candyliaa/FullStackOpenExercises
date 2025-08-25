import { useState } from "react"
import blogService from "../services/blogs"

const Blog = ({ blog, setBlogs, blogs }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    try {
      const updatedBlog = await blogService.updateLikes(blog.id, blog.likes + 1)
      setBlogs(blogs.map(b => (b.id !== blog.id ? b : updatedBlog)))
    } catch (error) {
      console.error("couldn't like blog:", error)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
      {blog.title} by {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? "hide" : "view"}
        </button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            {blog.likes} likes
            <button onClick={handleLike}>like</button>
          </p>
          {blog.user
          ? <p>{blog.user.name || blog.user.username}</p>
          : <p>unknown user</p>
          }
        </div>
      )}
    </div>
  )
}

export default Blog
