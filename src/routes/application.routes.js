const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middlewares/auth.middleware")
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  getAllApplications
} = require("../controllers/application.controller")

router.post("/job/:id", protect, authorize("candidate"), applyForJob)
router.get("/my", protect, authorize("candidate"), getMyApplications)
router.delete("/:id", protect, authorize("candidate"), withdrawApplication)
router.get("/job/:id", protect, authorize("employer", "admin"), getJobApplications)
router.put("/:id/status", protect, authorize("employer", "admin"), updateApplicationStatus)
router.get("/all", protect, authorize("admin"), getAllApplications)

module.exports = router