const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middlewares/auth.middleware")
const {
  getAllCandidates,
  getAllEmployers,
  getUser,
  deleteUser
} = require("../controllers/user.controller")

router.get("/candidates", protect, authorize("employer", "admin"), getAllCandidates)
router.get("/employers", protect, authorize("admin"), getAllEmployers)
router.get("/:id", protect, authorize("admin"), getUser)
router.delete("/:id", protect, authorize("admin"), deleteUser)

module.exports = router