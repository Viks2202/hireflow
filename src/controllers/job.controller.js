const asyncHandler = require("../middlewares/async.middleware")
const CustomError = require("../middlewares/customError")
const Job = require("../models/job.model")

// GET all jobs
const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ isActive: true })

  res.status(200).json({
    success: true,
    requestedAt: req.requestTime,
    count: jobs.length,
    jobs
  })
})

// GET single job
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)

  if (!job) {
    throw new CustomError("Job not found", 404)
  }

  res.status(200).json({ success: true, job })
})

// POST create job
const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create(req.body)

  res.status(201).json({ success: true, job })
})

// PUT update job
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )

  if (!job) {
    throw new CustomError("Job not found", 404)
  }

  res.status(200).json({ success: true, job })
})

// DELETE job — soft delete
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  )

  if (!job) {
    throw new CustomError("Job not found", 404)
  }

  res.status(200).json({
    success: true,
    message: "Job closed successfully"
  })
})

// GET job stats
const getJobStats = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ isActive: true })
  const total = jobs.length

  if (total === 0) {
    return res.status(200).json({
      success: true,
      stats: { totalJobs: 0 }
    })
  }

  // count by type
  const fulltime = jobs.filter(j => j.type === "fulltime").length
  const remote = jobs.filter(j => j.type === "remote").length
  const internship = jobs.filter(j => j.type === "internship").length
  const parttime = jobs.filter(j => j.type === "parttime").length
  const contract = jobs.filter(j => j.type === "contract").length

  // highest paying
  const highestPaying = jobs.reduce((max, j) =>
    j.salary.max > max.salary.max ? j : max, jobs[0])

  res.status(200).json({
    success: true,
    stats: {
      totalJobs: total,
      byType: { fulltime, remote, internship, parttime, contract },
      highestPaying: {
        title: highestPaying.title,
        company: highestPaying.company,
        maxSalary: highestPaying.salary.max
      }
    }
  })
})

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}