const Fen = require("../models/Fen");
const ErrorResponse = require("../utils/ErrorRes.js");

exports.getStudy = async (req, res, next) => {
  let { amount } = req.query;
  if (amount === undefined || amount > 500) amount = 100;
  try {
    let data = await Fen.find().limit(amount);

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFenId = async (req, res, next) => {
  const id = req.params.fenId;
  try {
    let data = await Fen.findById(id);
    if (data === null)
      return res.status(200).json({ success: true, data: "not found" });
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.postStudy = async (req, res, next) => {
  const { collection_name, private, fens } = req.body;
  let { by } = req.body;
  if (!collection_name)
    return res
      .status(400)
      .json({ success: false, error: "provide a collection name!" });

  if (by === undefined || by.length === 0) by = "Anonymous";

  let data = {
    collection_name: collection_name,
    by: by,
    fens: fens,
  };

  if (private !== undefined) {
    data.private = private;
  }

  try {
    const collection = await Fen.create(data);

    res
      .status(201)
      .json({ success: true, data: { status: "success", id: collection._id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.putStudy = async (req, res, next) => {
  const { _id, fens, collection_name, private } = req.body;
  if (private === undefined)
    return res.status(400).json({ success: false, error: "invalid password" });

  try {
    let doc = await Fen.findById(_id);

    const isMatch = await doc.matchPasswords(private);

    if (isMatch) await Fen.findByIdAndUpdate(_id, { collection_name, fens });
    else
      return res
        .status(400)
        .json({ success: false, error: "invalid password" });

    res.status(201).json({ success: true, data: "success" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteStudy = async (req, res, next) => {
  const { private } = req.body;
  const { _id } = req.params;
  if (!private)
    return res.status(400).json({ success: false, error: "invalid password" });

  try {
    let doc = await Fen.findById(_id);

    const isMatch = await doc.matchPasswords(private);

    if (isMatch) await Fen.findByIdAndDelete(_id);
    else
      return res
        .status(400)
        .json({ success: false, error: "invalid password" });

    res.status(201).json({ success: true, data: "success" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteFen = async (req, res, next) => {
  const { private } = req.body;
  const _id = req.params.fenId;
  const { index } = req.body;
  if (private === undefined)
    return res.status(400).json({ success: false, error: "invalid password" });

  try {
    let doc = await Fen.findById(_id);

    const isMatch = await doc.matchPasswords(private);
    doc.fens.splice(index, 1);

    if (isMatch) await doc.save();
    else
      return res
        .status(400)
        .json({ success: false, error: "invalid password" });

    res.status(201).json({ success: true, data: "success" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateFen = async (req, res, next) => {
  const { private, fen, san, description } = req.body;
  const _id = req.params.fenId;
  const { index } = req.body;
  if (private === undefined)
    return res.status(400).json({ success: false, error: "invalid password" });

  try {
    let doc = await Fen.findById(_id);

    const isMatch = await doc.matchPasswords(private);

    let fens = doc.fens;
    fens.splice(index, 1, { fen, san, description });

    if (isMatch) {
      await Fen.findByIdAndUpdate(_id, { fens });
    } else
      return res
        .status(400)
        .json({ success: false, error: "invalid password" });

    res.status(201).json({ success: true, data: fens });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addFen = async (req, res, next) => {
  const { private, fen, san, description } = req.body;
  const _id = req.params.fenId;

  if (private === undefined)
    return res.status(400).json({ success: false, error: "invalid password" });

  try {
    let doc = await Fen.findById(_id);

    const isMatch = await doc.matchPasswords(private);

    let fens = doc.fens;
    fens.push({ fen, san, description });

    if (isMatch) {
      await Fen.findByIdAndUpdate(_id, { fens });
    } else
      return res
        .status(400)
        .json({ success: false, error: "invalid password" });

    res.status(201).json({ success: true, data: fens });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.authFenId = async (req, res, next) => {
  const { private } = req.body;
  const _id = req.params.fenId;

  if (private === undefined)
    return res.status(400).json({ success: false, error: "invalid password" });

  try {
    let doc = await Fen.findById(_id);

    const isMatch = await doc.matchPasswords(private);

    if (isMatch) {
      res.status(201).json({ success: true, data: "user authenticated" });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "invalid password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
