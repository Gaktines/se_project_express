const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const like = require("./likes");
const { NotFoundError } = require("../utils/errors/NotFoundError");

router.use("/items", clothingItem);

router.use("/users", user);

router.use("/items", like);

router.use(() => {
  throw new NotFoundError();
});

module.exports = router;
