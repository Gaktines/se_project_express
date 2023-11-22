const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");

// Read
router.get("/", getItems);

router.use(auth);
// CRUD

// Create
router.post("/", validateCardBody, createItem);

// Update

// Delete
router.delete("/:itemId", validateId, deleteItem);

module.exports = router;
