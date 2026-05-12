const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middlewares/auth.middleware")
const { uploadPDF } = require("../middlewares/upload.middleware")
const {
  uploadResume,
  getMyResume,
  deleteResume
} = require("../controllers/resume.controller")

// only candidates can upload resume
router.post(
  "/upload",
  protect,
  authorize("candidate"),
  uploadPDF.single("resume"),
  uploadResume
)

router.get("/me", protect, getMyResume)

router.delete(
  "/me",
  protect,
  authorize("candidate"),
  deleteResume
)

module.exports = router