const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const FenSchema = new mongoose.Schema({
  collection_name: {
    type: String,

    required: [true, "Please provide a study name"],
    maxlength: 26,
    minlength: 4,
  },
  by: {
    type: String,
    maxlength: 16,
  },
  private: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  fens: [
    {
      fen: String,
      description: String,
      san: String,
    },
  ],
});

//encryption

FenSchema.pre("save", async function (next) {
  //condition that checks if we're changing the Password
  //prevents the middleware from running again
  if (!this.isModified("private")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.private = await bcrypt.hash(this.private, salt);
  next();
});

FenSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.private);
};

const Fen = mongoose.model("Fen", FenSchema);

module.exports = Fen;
