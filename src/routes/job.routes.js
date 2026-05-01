const express = require("express")
const router = express.Router()
const jobCheck = require("../middlewares/jobCheck.middleware")
const paginationDefaults = require("../middlewares/pagination.middleware")

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

router.get("/search", searchJobs)
router.get("/stats", getJobStats)
router.get("/type/:type", getJobsByType)
router.get("/", paginationDefaults, getAllJobs)
router.get("/:id", getJob)
router.post("/", jobCheck, createJob)
router.put("/:id", updateJob)
router.delete("/:id", deleteJob)

module.exports = router