const express = require("express")
const router = express.Router()

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
} = require("../controllers/job.controller")

router.get("/", getAllJobs)
router.get("/:id", getJob)
router.post("/", createJob)
router.put("/:id", updateJob)
router.delete("/:id", deleteJob)

module.exports = router