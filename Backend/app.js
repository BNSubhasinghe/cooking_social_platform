const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const cropRouter = require("./routes/cropRoute");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
require('./config/setup')();

app.use("/crops", cropRouter); // placeholder
app.use("/api/notify", notificationRoutes);

// MongoDB connection
mongoose.connect("mongodb+srv://<your_mongodb_uri>")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));