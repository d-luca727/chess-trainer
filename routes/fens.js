const express = require("express");
const router = express.Router();
const {
  getStudy,
  getFenId,
  postStudy,
  putStudy,
  deleteStudy,
  deleteFen,
  updateFen,
} = require("../controllers/fens");

router.route("/").get(getStudy);
router.route("/").post(postStudy);
router.route("/").put(putStudy);
router.route("/").delete(deleteStudy);

router.route("/:fenId").put(deleteFen);
router.route("/:fenId").put(updateFen);

router.route("/:fenId").get(getFenId);

module.exports = router;
