const express = require("express")
const router = express.Router()
const jobCheck = require("../middlewares/jobCheck.middleware")
const paginationDefaults = require("../middlewares/pagination.middleware")
const { protect, authorize } = require("../middlewares/auth.middleware")

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
  getJobsByType,
  searchJobs
} = require("../controllers/job.controller")

// public routes — no login needed
router.get("/search", searchJobs)
router.get("/stats", getJobStats)
router.get("/type/:type", getJobsByType)
router.get("/", paginationDefaults, getAllJobs)
router.get("/:id", getJob)

// protected routes — login + employer/admin only
router.post("/", protect, authorize("employer", "admin"), jobCheck, createJob)
router.put("/:id", protect, authorize("employer", "admin"), updateJob)
router.delete("/:id", protect, authorize("employer", "admin"), deleteJob)

module.exports = router