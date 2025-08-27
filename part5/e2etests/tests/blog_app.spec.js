const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        username: "root",
        name: "Root Person",
        password: "secret",
      },
    });
    await request.post("/api/users", {
      data: {
        username: "root2",
        name: "Root Person2",
        password: "secret",
      },
    });
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("login form is shown", async ({ page }) => {
    const locator = page.getByText("Log in to application");
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "root", "secret");
      await expect(page.getByText("Root Person logged in")).toBeVisible();
    });

    test("fails with wrong password", async ({ page }) => {
      await loginWith(page, "root", "not a password");
      const errorDiv = page.locator(".error");
      await expect(errorDiv).toContainText("error: wrong username or password");
    });
  });

  describe("When logged in", async () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "root", "secret");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "Test Blog", "Test Author", "https://example.com");
      const blogsDiv = page.locator(".blog-list");
      await expect(blogsDiv).toContainText("Test Blog");
    });

    test("a new blog can be liked", async ({ page }) => {
      await createBlog(page, "Test Blog", "Test Author", "https://example.com");
      const blogDiv = page.locator(".blog", { hasText: "Test Blog" });
      await blogDiv.getByRole("button", { name: "view" }).click();
      await blogDiv.getByRole("button", { name: "like" }).click();
      await expect(blogDiv).toContainText("1 likes");
    });

    test("blog can be deleted by user who created blog", async ({ page }) => {
      await createBlog(page, "Test Blog", "Test Author", "https://example.com");
      const blogDiv = page.locator(".blog", { hasText: "Test Blog" });

      await blogDiv.getByRole("button", { name: "view" }).click();

      page.on("dialog", (dialog) => dialog.accept());
      await blogDiv.getByRole("button", { name: "delete" }).click();

      await expect(blogDiv).toHaveCount(0);
    });

    test("delete button only shown to user who created", async ({ page }) => {
      await createBlog(page, "Test Blog", "Test Author", "https://example.com");

      await page.getByRole("button", { name: "log out" }).click();
      await loginWith(page, "root2", "secret");

      const blogDiv = page.locator(".blog", { hasText: "Test Blog" });

      await blogDiv.getByRole("button", { name: "view" }).click();

      await expect(
        blogDiv.getByRole("button", { name: "delete" })
      ).not.toBeVisible(0);
    });

    test("blogs are sorted in order of likes", async ({ page }) => {
      await createBlog(
        page,
        "Test Blog1",
        "Test Author",
        "https://example.com"
      );
      await createBlog(
        page,
        "Test Blog2",
        "Test Author2",
        "https://example.com"
      );
      await createBlog(
        page,
        "Test Blog3",
        "Test Author3",
        "https://example.com"
      );
      const blog1 = page.locator(".blog", { hasText: "Test blog2" });
      await blog1.waitFor({ state: "visible" });

      await blog1.getByRole("button", { name: "view" }).click();
      await blog1.getByRole("button", { name: "like" }).click();
      await blog1.getByRole("button", { name: "like" }).click();

      const blog2 = page.locator(".blog", { hasText: "Test Blog1" });
      await blog2.waitFor({ state: "visible" });

      await blog2.getByRole("button", { name: "view" }).click();
      await blog2.getByRole("button", { name: "like" }).click();

      await page.getByRole("button", { name: "log out" }).click();
      await loginWith(page, "root", "secret");

      await page.locator(".blog").first().waitFor({ state: "visible" });

      const blogTitles = await page.$$eval(".blog .blog-summary", (blogs) =>
        blogs.map((b) => b.textContent)
      );

      expect(blogTitles[0]).toContain("Test Blog2");
      expect(blogTitles[1]).toContain("Test Blog");
      expect(blogTitles[2]).toContain("Test Blog3");
    });
  });
});
