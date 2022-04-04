const express = require("express");
const router = express.Router();
const { getFens, postFens, PutFens } = require("../controllers/fens");

router.route("/").get(getFens);
router.route("/").post(postFens);
router.route("/").put(putFens);

module.exports = router;
