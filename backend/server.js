const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const todoRoutes = require("./routes/todoRoutes");

app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.send("Todo Backend Server is Running");
});

mongoose
  .connect(process.env.MONGO_URI || process.env.MONGO_URL || process.env.Key)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });


