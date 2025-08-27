const { expect } = require("@playwright/test");

const loginWith = async (page, username, password) => {
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "new blog" }).click();
  await page.getByLabel("title").fill(title);
  await page.getByLabel("author").fill(author);
  await page.getByLabel("url").fill(url);
  await page.getByRole("button", { name: "save" }).click();
  await page.getByRole("button", { name: "cancel" }).click();

  const blog = page.locator(".blog", { hasText: title });
  await expect(blog).toBeVisible({ timeout: 10000 });
};

module.exports = { loginWith, createBlog };
