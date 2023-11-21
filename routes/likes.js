const router = require('express').Router();
const auth = require("../middlewares/auth");
const validateId = require("../middlewares/validation");

const { likeItem, dislikeItem } = require('../controllers/likes');

router.use(auth);
// Update
router.put('/:itemId/likes', validateId, likeItem);
// Delete
router.delete('/:itemId/likes', validateId, dislikeItem);

module.exports = router;
