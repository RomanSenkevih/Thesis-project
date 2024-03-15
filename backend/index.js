import express, { json } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/user.js";

const PORT = 5000;
const app = express();

//path to mongodb*  путь к: mongodb
const uri =
  "mongodb+srv://romanadmin:2702644a@cluster0.brffnzm.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0";

//processing connection to: mongodb*  обработка соединения с: mongodb
mongoose
  .connect(uri)
  .then(() => console.log("DB ok!"))
  .catch((err) => console.log("DB error", err));

//middleware_function*  связующее программное обеспечение
app.use(express.json());
app.use(express.urlencoded());

//POST: auth redister*  регистрация авторизации
app.post("/auth/redister", registerValidation, async (req, res) => {
  try {
    //Validation*  результат проверки: express-validator(в папке: ./validations/auth.js )
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    //bcrypt password*  шифрование пароля с помощью: bcrypt
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //created a user model*  создал модель пользователя(модель в папке: ./models/user.js)
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    //save the user*  сохраняем пользователя
    const user = await doc.save();

    //generated a token*  сгенерированный токен
    const token = jwt.sign({ _id: user._id }, "2702644a", { expiresIn: "30d" });

    //separating PasswordHash from _doc* убрали пароль из ответа клиенту
    const { passwordHash, ...userData } = user._doc;

    //response to client*  ответ клиенту
    res.json({
      ...userData, //data from the user database* информация из базы данных про: user
      token,
    });
  } catch (error) {
    console.log(error);
    //response to client*  ответ клиенту в случае ошибки
    res.status(500).json({ message: "Не удалось зарегистрироваться" });
  }
});

// start server* запускает сервер
app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log("The server is running on port: 5000");
});
