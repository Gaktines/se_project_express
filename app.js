const express = require("express");
const mongoose = require("mongoose");

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

app.use((req, res, next) => {
  req.user = {
    _id: '64e0dff5b3196b3152c996ce'// paste the _id of the test user created in the previous step
  };
  next();
});

const routes = require('./routes');

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App is listening at port: ${PORT}`);
});

app.post('/signin', login);
app.post('/signup', createUser);
