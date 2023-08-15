const router = require("express").Router();
const clothingItem = require("./clothingItems");

router.use("/clothingItems", clothingItem);

router.use((req, res) => {
  res.status(500).send({ message: "No such Router" });
});

module.exports = router;
