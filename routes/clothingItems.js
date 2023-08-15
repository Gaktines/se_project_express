const router = require('express').Router();

const { createItem, getItem, deleteItem } = require('../controllers/clothingItems');

//CRUD

//Create
router.post('/', createItem);

//Read
router.get('/', getItem);
//Update

//Delete
router.delete('/', deleteItem)
module.exports = router;