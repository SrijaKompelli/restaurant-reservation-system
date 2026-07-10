const express = require("express");
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAllReservations,
  updateReservation,
} = require("../controllers/reservationController");
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

// Customer routes
router.post("/", protect, createReservation);
router.get("/my", protect, getMyReservations);
router.patch("/:id/cancel", protect, cancelReservation);

// Admin routes
router.get("/", protect, isAdmin, getAllReservations);       // supports ?date=YYYY-MM-DD
router.patch("/:id", protect, isAdmin, updateReservation);

module.exports = router;