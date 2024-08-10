require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connecteDB = require("./db.js");

const userRoutes = require("./routes/user.routes");
const noteRoutes = require("./routes/note.routes");

app.use(express.json());
app.use(
  cors({
    origin: "https://fsnotes-app.vercel.app/",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

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
