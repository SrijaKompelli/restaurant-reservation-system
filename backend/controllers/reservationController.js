const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

const DEFAULT_SLOT_MINUTES = 90;

/**
 * Finds the smallest available table that:
 *  1. Has capacity >= guests
 *  2. Has no CONFIRMED reservation overlapping the requested [startTime, endTime) window
 *
 * Overlap check: existing.startTime < newEndTime AND existing.endTime > newStartTime
 */
async function findAvailableTable(guests, startTime, endTime) {
  const candidates = await Table.find({
    isActive: { $ne: false },
    capacity: { $gte: guests },
  }).sort({ capacity: 1 });

  for (const table of candidates) {
    const conflict = await Reservation.findOne({
      table: table._id,
      status: "confirmed",
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (!conflict) return table;
  }

  return null;
}

// @desc    Create a reservation (auto-assigns an available table)
// @route   POST /api/reservations
// @access  Private (Customer/Admin)
exports.createReservation = async (req, res) => {
  try {
    const { guests, date, startTime, endTime } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!guests || !date || !startTime) {
      return res.status(400).json({ message: "guests, date, and startTime are required" });
    }

    if (typeof guests !== "number" || Number.isNaN(guests)) {
      return res.status(400).json({ message: "guests must be a valid number" });
    }

    if (guests < 1) {
      return res.status(400).json({ message: "guests must be at least 1" });
    }

    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (!parsedDate) {
      return res.status(400).json({ message: "date must be in YYYY-MM-DD format" });
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: "startTime is not a valid date/time" });
    }

    const startDate = start.toISOString().slice(0, 10);
    if (startDate !== date) {
      return res.status(400).json({ message: "date and startTime must refer to the same day" });
    }

    const end = endTime
      ? new Date(endTime)
      : new Date(start.getTime() + DEFAULT_SLOT_MINUTES * 60 * 1000);

    if (isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ message: "endTime must be a valid date after startTime" });
    }

    if (start < new Date()) {
      return res.status(400).json({ message: "Cannot book a reservation in the past" });
    }

    const table = await findAvailableTable(guests, start, end);

    if (!table) {
      return res.status(409).json({
        message: "No table available for that party size and time slot. Try a different time.",
      });
    }

    const reservation = await Reservation.create({
      user: userId,
      table: table._id,
      guests,
      date,
      startTime: start,
      endTime: end,
    });

    const populated = await reservation.populate("table");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to create reservation", error: err.message });
  }
};

// @desc    Get logged-in user's own reservations
// @route   GET /api/reservations/my
// @access  Private
exports.getMyReservations = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const reservations = await Reservation.find({ user: userId })
      .populate("table")
      .sort({ startTime: -1 });
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reservations", error: err.message });
  }
};

// @desc    Cancel own reservation
// @route   PATCH /api/reservations/:id/cancel
// @access  Private (owner or admin)
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const userId = req.user?.id || req.user?._id;
    const isOwner = reservation.user.toString() === userId.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to cancel this reservation" });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({ message: "Reservation is already cancelled" });
    }

    reservation.status = "cancelled";
    await reservation.save();
    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel reservation", error: err.message });
  }
};

// @desc    Get ALL reservations, optionally filtered by date (YYYY-MM-DD)
// @route   GET /api/reservations?date=2026-07-15
// @access  Private/Admin
exports.getAllReservations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.date) filter.date = req.query.date;

    const reservations = await Reservation.find(filter)
      .populate("table")
      .populate("user", "-password")
      .sort({ startTime: -1 });

    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reservations", error: err.message });
  }
};

// @desc    Update ANY reservation (e.g. change status, guests, table)
// @route   PATCH /api/reservations/:id
// @access  Private/Admin
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("table");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Failed to update reservation", error: err.message });
  }
};