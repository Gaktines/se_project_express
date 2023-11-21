const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const like = require("./likes");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const validateUserInfoBody = require("../middlewares/validation");
const validateCardBody = require("../middlewares/validation");
const validateUserCred = require("../middlewares/validation");

router.use("/items", validateCardBody, clothingItem);

router.use("/users", validateUserInfoBody, user);

router.use("/items", validateUserCred, like);

router.use(() => {
  throw new new NotFoundError();
});

module.exports = router;
