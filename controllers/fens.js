const Fen = require("../models/Fen");
const ErrorResponse = require("../utils/ErrorRes.js");

exports.fens = async (req, res, next) => {
  console.log("fens!");
  res.status(200).json({ success: true, data: "hello!!!!" });
};
