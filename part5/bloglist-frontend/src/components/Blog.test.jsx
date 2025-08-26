import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import Blog from "./Blog"
import BlogForm from "./BlogForm"

const blog = {
    title: "This is a test blog",
    author: "Test Author",
    url: "https://exampletest.com",
    likes: 5,
    user: {
        username: "Test User", name: "Tester Person"
    }
  }

test("only blog summary is initially displayed", () => {
  const { container } = render(
    <Blog blog={blog} blogs={[]} setBlogs={() => {}} setMessage={() => {}} />
  )

  const blogSummary = container.querySelector(".blog-summary")
  expect(blogSummary).toHaveTextContent("This is a test blog")

  const blogDetails = container.querySelector(".blog-details")
  expect(blogDetails).toBeNull()
})

test("blog details are displayed when button is clicked", async () => {
    const { container } = render(
      <Blog blog={blog} blogs={[]} setBlogs={() => {}} setMessage={() => {}} />
    )

    const user = userEvent.setup()
    const button = screen.getByText("view")

    await user.click(button)

    const blogDetails = container.querySelector(".blog-details")
    expect(blogDetails).toHaveTextContent("https://exampletest.com")
})

test("when like button is clicked twice, event handler is called twice", async () => {
    const mockHandler = vi.fn()

    const { container } = render(
      <Blog blog={blog} blogs={[]} setBlogs={() => {}} setMessage={() => {}} handleLike={mockHandler} />
    )

    const user = userEvent.setup()
    const button = screen.getByText("view")
    await user.click(button)

    const likeButton = container.querySelector(".like-button")
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test("when creating new blog, event handler has right details", async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const Wrapper = () => {
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [url, setUrl] = useState("")

    return (
      <BlogForm
        onSubmit={createBlog}
        newBlogTitle={title}
        newBlogAuthor={author}
        newBlogUrl={url}
        handleBlogTitleChange={(e) => setTitle(e.target.value)}
        handleBlogAuthorChange={(e) => setAuthor(e.target.value)}
        handleBlogUrlChange={(e) => setUrl(e.target.value)}
      />
    )
  }

  const { container } = render(<Wrapper />)

  const titleInput = container.querySelector(".title")
  const authorInput = container.querySelector(".author")
  const urlInput = container.querySelector(".url")
  const saveButton = screen.getByText("save")

  await user.type(titleInput, "Test Blog 2")
  await user.type(authorInput, "Tester Person 2")
  await user.type(urlInput, "https://exampleblog.com")
  await user.click(saveButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: "Test Blog 2",
    author: "Tester Person 2",
    url: "https://exampleblog.com",
  })
})

