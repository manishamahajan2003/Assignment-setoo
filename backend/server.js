// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ---- Model ----
// const itemSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const Item = mongoose.model("Item", itemSchema);

// // ---- Routes (CRUD) ----

// // CREATE
// app.post("/api/items", async (req, res) => {
//   try {
//     const { title } = req.body;
//     const item = await Item.create({ title });
//     res.status(201).json(item);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // READ (all)
// app.get("/api/items", async (req, res) => {
//   try {
//     const items = await Item.find().sort({ createdAt: -1 });
//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // UPDATE
// app.put("/api/items/:id", async (req, res) => {
//   try {
//     const { title } = req.body;
//     const updated = await Item.findByIdAndUpdate(
//       req.params.id,
//       { title },
//       { new: true }
//     );
//     if (!updated) return res.status(404).json({ message: "Item not found" });
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // DELETE
// app.delete("/api/items/:id", async (req, res) => {
//   try {
//     const deleted = await Item.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Item not found" });
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // ---- DB + Server ----
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(process.env.PORT, () =>
//       console.log("Server running on port", process.env.PORT)
//     );
//   })
//   .catch((err) => console.log("DB error:", err));


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Health Check Route ----------
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// ---------- Model ----------
const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

// ---------- Routes (CRUD) ----------

// CREATE
app.post("/api/items", async (req, res) => {
  try {
    const { title } = req.body;
    const item = await Item.create({ title });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
app.put("/api/items/:id", async (req, res) => {
  try {
    const { title } = req.body;
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
app.delete("/api/items/:id", async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------- DB + Server ----------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
  });
