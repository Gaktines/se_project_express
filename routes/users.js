const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateUser, validateUserCred } = require("../middlewares/validation");

const { getCurrentUser, updateProfile } = require("../controllers/users");

router.use(auth);

router.get("/me", getCurrentUser);

router.patch("/me", validateUserCred, validateUser, updateProfile);

module.exports = router;
