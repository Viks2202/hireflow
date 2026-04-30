const asyncHandler = require("../middlewares/async.middleware")
const CustomError = require("../middlewares/customError")
const Job = require("../models/job.model")

// GET all jobs
const getAllJobs = asyncHandler(async (req, res) => {
  const {
    type,
    location,
    minSalary,
    maxSalary,
    search,
    skills,
    sort,
    page,
    limit
  } = req.query

  // build filter object
  const filter = { isActive: true }

  // type filter
  if (type) {
    filter.type = type
  }

  // location filter
  if (location) {
    filter.location = { $regex: location, $options: "i" }
  }

  // salary range filter
  if (minSalary || maxSalary) {
    filter["salary.min"] = {}
    if (minSalary) filter["salary.min"].$gte = Number(minSalary)
    if (maxSalary) filter["salary.max"] = { $lte: Number(maxSalary) }
  }

  // skills filter
  if (skills) {
    const skillsArray = skills.split(",")
    filter.skills = { $in: skillsArray }
  }

  // search filter — title, company, location
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } }
    ]
  }

  // pagination
  const pageNum = Number(page) || 1
  const limitNum = Number(limit) || 10
  const skip = (pageNum - 1) * limitNum

  // sort options
  let sortOption = { createdAt: -1 }
  if (sort === "salary_asc")  sortOption = { "salary.min": 1 }
  if (sort === "salary_desc") sortOption = { "salary.max": -1 }
  if (sort === "newest")      sortOption = { createdAt: -1 }
  if (sort === "oldest")      sortOption = { createdAt: 1 }

  // execute query
  const jobs = await Job.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum)

  // total count
  const total = await Job.countDocuments(filter)

  res.status(200).json({
    success: true,
    requestedAt: req.requestTime,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1
    },
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

const getJobsByType = asyncHandler(async (req, res) => {
  const { type } = req.params
  const validTypes = ["fulltime", "parttime", "remote", "contract", "internship"]

  if (!validTypes.includes(type)) {
    throw new CustomError("Invalid job type", 400)
  }

  const jobs = await Job.find({ type, isActive: true })

  res.status(200).json({
    success: true,
    type,
    count: jobs.length,
    jobs
  })
})

const searchJobs = asyncHandler(async (req, res) => {
  const { q } = req.query

  if (!q) {
    throw new CustomError("Search query is required", 400)
  }

  const jobs = await Job.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { company: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } }
    ],
    isActive: true
  })

  res.status(200).json({
    success: true,
    query: q,
    count: jobs.length,
    jobs
  })
})

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
  getJobsByType,
  searchJobs
}