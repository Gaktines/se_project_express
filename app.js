const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to db", r);
  },
  (e) => {
    console.log("db error", e);
  },
);

const routes = require('./routes');
app.use(express.json());
app.use(routes);

app.use((req, res, next) => {
  req.user = {
    _id: '64dd074d31aa06cfde4a5d34'// paste the _id of the test user created in the previous step
  };
  next();
});


app.listen(PORT, () => {
  console.log(`App is listening at port: ${PORT}`);
});
