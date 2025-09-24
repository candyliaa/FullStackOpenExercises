const BlogForm = ({ onSubmit, newBlogTitle, newBlogAuthor, newBlogUrl, handleBlogTitleChange, handleBlogAuthorChange, handleBlogUrlChange }) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        title
        <input value={newBlogTitle} onChange={handleBlogTitleChange} className="title" />
      </label>
      <br/>
      <label>
        author
        <input value={newBlogAuthor} onChange={handleBlogAuthorChange} className="author" />
      </label>
      <br/>
      <label>
        url
        <input value={newBlogUrl} onChange={handleBlogUrlChange} className="url" />
      </label>
      <br/>
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm
