const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require('./users');
const like = require('./likes');

router.use("/clothingItems", clothingItem);

router.use("/users", user);

router.use("/likes", like);


router.use((req, res) => {
  res.status(500).send({ message: "No such Router" });
});

module.exports = router;
