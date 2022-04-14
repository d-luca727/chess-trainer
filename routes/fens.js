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
  addFen,
  authFenId,
} = require("../controllers/fens");

router.route("/").get(getStudy);
router.route("/").post(postStudy);
router.route("/").put(putStudy);

router.route("/delete/:_id").put(deleteStudy);

router.route("/auth/:fenId").post(authFenId);

router.route("/:fenId").get(getFenId);
router.route("/:fenId").put(deleteFen);

router.route("/edit/:fenId").put(updateFen);
router.route("/edit/fen/:fenId").put(addFen);

module.exports = router;
