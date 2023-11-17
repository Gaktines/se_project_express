const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorHandler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

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
app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.post("/signin", login);
app.post("/signup", createUser);



app.listen(PORT, () => {
  console.log(`App is listening at port: ${PORT}`);
});
