const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const express = require("express");
const connectDB = require("../config/db");

connectDB();

const app = express();

app.use(express.json());

app.use("/api/fens", require("../routes/fens"));

//server static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("api running");
  });
}
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running on ${PORT} port`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log("Logged Error: " + err);
  server.close(() => process.exit(1));
});

module.exports = app;
