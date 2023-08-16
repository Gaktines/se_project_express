const router = require('express').Router();

const { likeItem, dislikeItem } = require('../controllers/likes');

//Update
router.put('/items/:itemId/likes', likeItem);
//Delete
router.delete('/items/:itemId/likes', dislikeItem);

module.exports = router;
