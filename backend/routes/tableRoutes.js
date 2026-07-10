const express = require("express");
const router = express.Router();
const {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} = require("../controllers/tableController");
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

router.get("/", protect, getTables);
router.post("/", protect, isAdmin, createTable);
router.patch("/:id", protect, isAdmin, updateTable);
router.delete("/:id", protect, isAdmin, deleteTable);

module.exports = router;