const connectMongo = require("../config/db");
const Table = require("../models/Table");

const tables = [
  { tableNumber: 1, capacity: 2 },
  { tableNumber: 2, capacity: 2 },
  { tableNumber: 3, capacity: 4 },
  { tableNumber: 4, capacity: 4 },
  { tableNumber: 5, capacity: 6 },
  { tableNumber: 6, capacity: 8 }
];

const seed = async () => {
  try {
    await connectMongo();
    await Table.deleteMany();
    await Table.insertMany(tables);

    console.log("Tables Seeded");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err.message || err);
    process.exit(1);
  }
};

seed();