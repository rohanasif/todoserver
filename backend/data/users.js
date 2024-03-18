import bcryptjs from "bcryptjs";

const users = [
  {
    name: "Rohan Asif",
    email: "admin@example.com",
    password: bcryptjs.hashSync("123456", 10),
    isAdmin: true,
    todos: [],
  },
  {
    name: "Test User",
    email: "r2@y.com",
    password: bcryptjs.hashSync("123", 10),
    isAdmin: false,
    todos: [],
  },
];
export default users;
