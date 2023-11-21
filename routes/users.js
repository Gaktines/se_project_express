const router = require("express").Router();
const auth = require("../middlewares/auth");
const validateUserInfoBody = require("../middlewares/validation");
const validateUserCred = require("../middlewares/validation");

const { getCurrentUser, updateProfile } = require("../controllers/users");

router.use(auth);

router.get('/me', validateUserInfoBody, getCurrentUser);

router.patch('/me', validateUserCred, updateProfile);



module.exports = router;
