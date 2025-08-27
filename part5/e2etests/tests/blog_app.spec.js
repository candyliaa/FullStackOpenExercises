const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith } = require("./helper");

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
    await page.goto("/");
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
});
