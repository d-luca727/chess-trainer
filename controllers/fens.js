const Fen = require("../models/Fen");
const ErrorResponse = require("../utils/ErrorRes.js");

exports.getFens = async (req, res, next) => {
  let { amount } = req.query;
  if (amount === undefined || amount > 500) amount = 100;
  try {
    let data = await Fen.find().limit(amount);
    console.log(amount);
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.postFens = async (req, res, next) => {
  const { collection_name, private, fens } = req.body;
  let { by } = req.body;
  if (!collection_name)
    return new ErrorResponse("Provide a collection name!", 400);

  if (by === undefined || by.length === 0) by = "Anonymous";
  try {
    const collection = await Fen.create({
      collection_name,
      by,
      private,
      fens,
    });

    res.status(201).json({ success: true, data: "success", collection });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.putFens = async (req, res, next) => {
  const { _id, fens, collection_name, private } = req.body;
  if (private === undefined)
    return new ErrorResponse("Provide a valid password.", 400);

  try {
    let doc = await Fen.findById(_id);

    const isMatch = await doc.matchPasswords(private);

    if (isMatch) await Fen.findByIdAndUpdate(_id, { collection_name, fens });
    else return new ErrorResponse("Password is not correct", 400);

    res.status(201).json({ success: true, data: "success" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteFens = async (req, res, next) => {
  const { _id, private } = req.body;
  if (!private) return new ErrorResponse("Provide a valid password.", 400);

  try {
    let doc = await Fen.findById(_id);

    const isMatch = await doc.matchPasswords(private);

    if (isMatch) await Fen.findByIdAndDelete(_id);
    else return new ErrorResponse("Password is not correct", 400);

    res.status(201).json({ success: true, data: "success" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
