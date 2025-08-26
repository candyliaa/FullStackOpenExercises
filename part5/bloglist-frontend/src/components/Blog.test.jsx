import { render, screen } from "@testing-library/react"
import Blog from "./Blog"

test("only blog summary is initially displayed", () => {
  const blog = {
    title: "This is a test blog",
    author: "Test Author",
    url: "https://exampletest.com",
    likes: 5,
    user: {
        username: "Test User", name: "Tester Person"
    }
  }

  const { container } = render(
    <Blog blog={blog} blogs={[]} setBlogs={() => {}} setMessage={() => {}} />
  )

  const blogSummary = container.querySelector(".blog-summary")
  expect(blogSummary).toHaveTextContent("This is a test blog")

  const blogDetails = container.querySelector(".blog-details")
  expect(blogDetails).toBeNull()
})
