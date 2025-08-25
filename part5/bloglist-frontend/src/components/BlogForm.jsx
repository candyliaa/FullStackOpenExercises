const BlogForm = ({ onSubmit, newBlogTitle, newBlogAuthor, newBlogUrl, handleBlogTitleChange, handleBlogAuthorChange, handleBlogUrlChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <label>
        title
        <input value={newBlogTitle} onChange={handleBlogTitleChange} />
      </label>
      <br/>
      <label>
        author
        <input value={newBlogAuthor} onChange={handleBlogAuthorChange} />
      </label>
      <br/>
      <label>
        url
        <input value={newBlogUrl} onChange={handleBlogUrlChange} />
      </label>
      <br/>
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm
