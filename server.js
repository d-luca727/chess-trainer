const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./api/route.js");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/openingtrainer", routes);

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

module.exports = app;
