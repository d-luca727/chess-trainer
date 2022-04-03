const mongoose = require("mongoose");

const FenSchema = new mongoose.Schema({});

const Fen = mongoose.model("Fen", FenSchema);

module.exports = Fen;
