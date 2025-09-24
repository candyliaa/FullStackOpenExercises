import { Link } from "react-router-dom";

const Users = ({ blogs }) => {
  const users = {};

  blogs.forEach((blog) => {
    const username = blog.user?.name || blog.user?.username || "unknown";
    if (!users[username]) users[username] = 0;
    users[username] += 1;
  });

  const userList = Object.entries(users).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>username</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.name}>
              <td>{user.name}</td>
              <td>{user.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
