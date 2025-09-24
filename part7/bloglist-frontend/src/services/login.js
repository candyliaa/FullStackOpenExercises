const users = [
  { username: "Test1", name: "Tester Person1", token: "abc123" },
  { username: "ada", name: "Ada Lovelace", token: "ada123" },
  { username: "root", name: "root", token: "root123" },
];

const login = async ({ username }) => {
  const user = users.find((u) => u.username === username);
  if (user) {
    return new Promise((resolve) => setTimeout(() => resolve(user), 200));
  } else {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error("invalid username")), 200)
    );
  }
};

export default { login };
