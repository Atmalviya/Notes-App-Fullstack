require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connecteDB = require("./db.js");

const userRoutes = require("./routes/user.routes");
const noteRoutes = require("./routes/note.routes");

app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "https://notesapp.atmalviya.cloud/",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization,Accept,Origin",
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

//* mongodb connection
connecteDB();

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

app.use("/user", userRoutes);
app.use("/note", noteRoutes);

//* start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

module.exports = app;
