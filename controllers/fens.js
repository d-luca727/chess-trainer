const Fen = require("../models/Fen");
const ErrorResponse = require("../utils/ErrorRes.js");

exports.getFens = async (req, res, next) => {
  console.log("fens!");
  res.status(200).json({ success: true, data: "hello!!!!" });
};
exports.postFens = async (req, res, next) => {
  console.log("fens!");
  res.status(200).json({ success: true, data: "hello!!!!" });
};

exports.putFens = async (req, res, next) => {
  console.log("fens!");
  res.status(200).json({ success: true, data: "hello!!!!" });
};
