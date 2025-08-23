const bcrypt = require("bcrypt");
const supertest = require("supertest");
const mongoose = require("mongoose");
const { test, after, beforeEach, describe } = require("node:test");
const User = require("../models/user");
const app = require("../app");

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });
});

describe("invalid users cannot be created", () => {
  test("creation doesn't succeed with too short of a username", async () => {
    const newUser = { username: "a", password: "secret" };

    await api.post("/api/users").send(newUser).expect(400);
  });

  test("creation doesn't succeed with too short of a password", async () => {
    const newUser = { username: "I don't understand passwords", password: "b" };

    await api.post("/api/users").send(newUser).expect(400);
  });

  test("creation doesn't succeed when username already exists", async () => {
    const passwordHash = await bcrypt.hash("secret", 10);
    const newUser = new User({
      username: "root",
      passwordHash,
    });

    await api.post("/api/users").send(newUser).expect(400);
  });
});

after(async () => {
  await mongoose.connection.close();
});
