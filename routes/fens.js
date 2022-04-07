const express = require("express");
const router = express.Router();
const {
  getFens,
  getFenId,
  postFens,
  putFens,
  deleteFens,
} = require("../controllers/fens");

router.route("/").get(getFens);
router.route("/").post(postFens);
router.route("/").put(putFens);
router.route("/").delete(deleteFens);

router.route("/:fenId").get(getFenId);

module.exports = router;
