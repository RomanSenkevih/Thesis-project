import express from "express";
import jwt from "jsonwebtoken";

const PORT = 5000;
const app = express();
//middleware_function{
app.use(express.json());
app.use(express.urlencoded());
//}
app.get("/", (req, res) => {
  res.send("hello world!");
});

app.post("/auth/login", (req, res) => {
  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: req.body.name,
    },
    "2702644a"
  );
  res.json({ test: 123 });
});

app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log("The server is running on port: 5000");
});
