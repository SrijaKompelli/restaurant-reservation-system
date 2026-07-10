const Table = require("../models/Table");

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private (any authenticated user)
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.status(200).json(tables);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tables", error: err.message });
  }
};

// @desc    Create a new table
// @route   POST /api/tables
// @access  Private/Admin
exports.createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    if (!tableNumber || !capacity) {
      return res.status(400).json({ message: "tableNumber and capacity are required" });
    }

    const existing = await Table.findOne({ tableNumber });
    if (existing) {
      return res.status(409).json({ message: `Table ${tableNumber} already exists` });
    }

    const table = await Table.create({ tableNumber, capacity });
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ message: "Failed to create table", error: err.message });
  }
};

// @desc    Update a table (tableNumber, capacity)
// @route   PATCH /api/tables/:id
// @access  Private/Admin
exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ message: "Failed to update table", error: err.message });
  }
};

// @desc    Delete a table
// @route   DELETE /api/tables/:id
// @access  Private/Admin
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({ message: "Table deleted", table });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete table", error: err.message });
  }
};