const express = require("express");
const router = express.Router();
const { fens } = require("../controllers/fens");

router.route("/").get(fens);

module.exports = router;
