const router = require('express').Router();
const auth = require("../middlewares/auth");

const { createItem, getItems, deleteItem } = require('../controllers/clothingItems');

// Read
router.get('/', getItems);

router.use(auth);
// CRUD

// Create
router.post('/', createItem);

// Update

// Delete
router.delete('/:itemId', deleteItem);

module.exports = router;