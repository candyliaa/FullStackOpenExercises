import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import Blog from "./Blog"

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
