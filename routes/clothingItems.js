const router = require('express').Router();
const auth = require("../middlewares/auth");
const validateCardBody = require("../middlewares/validation");
const validateUserCred = require("../middlewares/validation");

const { createItem, getItems, deleteItem } = require('../controllers/clothingItems');

// Read
router.get('/', validateCardBody, getItems);

router.use(auth);
// CRUD

// Create
router.post('/', validateCardBody, createItem);

// Update

// Delete
router.delete('/:itemId', validateUserCred, deleteItem);

module.exports = router;