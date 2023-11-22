require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { errorHandler } = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const {
  validateUserCred,
  validateUserInfoBody,
} = require("./middlewares/validation");

const { PORT = 3001 } = process.env;
const app = express();

const { login, createUser } = require("./controllers/users");

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to db", r);
  },
  (e) => {
    console.log("db error", e);
  },
);

const routes = require("./routes");

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", validateUserCred, login);
app.post("/signup", validateUserInfoBody, createUser);

app.use(routes);

app.use(errorLogger);
app.use(errors());
console.log(errorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening at port: ${PORT}`);
});
