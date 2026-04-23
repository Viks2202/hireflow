const asyncHandler = require("../middlewares/async.middleware")
const CustomError = require("../middlewares/customError")

const jobs = [
  {
    id: "1",
    title: "Backend Developer",
    company: "TechCorp India",
    location: "Delhi NCR",
    type: "fulltime",
    salary: { min: 600000, max: 1200000 },
    skills: ["Node.js", "Express", "MongoDB"],
    experience: "1-3 years"
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "StartupX",
    location: "Remote",
    type: "remote",
    salary: { min: 400000, max: 800000 },
    skills: ["React", "Tailwind", "JavaScript"],
    experience: "0-1 years"
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "ProductBase",
    location: "Bangalore",
    type: "fulltime",
    salary: { min: 800000, max: 1500000 },
    skills: ["Node.js", "React", "PostgreSQL"],
    experience: "2-4 years"
  }
]

const getAllJobs = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    requestedAt: req.requestTime,
    count: jobs.length,
    jobs
  })
})

const getJob = asyncHandler(async (req, res) => {
  const job = jobs.find(j => j.id === req.params.id)
  if (!job) throw new CustomError("Job not found", 404)
  res.status(200).json({ success: true, job })
})

const createJob = asyncHandler(async (req, res) => {
  const { title, company, location, type } = req.body
  if (!title || !company || !location || !type) {
    throw new CustomError("title, company, location and type are required", 400)
  }
  const newJob = {
    id: String(jobs.length + 1),
    title,
    company,
    location,
    type,
    postedAt: new Date().toISOString().split("T")[0]
  }
  res.status(201).json({ success: true, job: newJob })
})

const updateJob = asyncHandler(async (req, res) => {
  const job = jobs.find(j => j.id === req.params.id)
  if (!job) throw new CustomError("Job not found", 404)
  res.status(200).json({
    success: true,
    message: "Job updated",
    id: req.params.id,
    updated: req.body
  })
})

const deleteJob = asyncHandler(async (req, res) => {
  const job = jobs.find(j => j.id === req.params.id)
  if (!job) throw new CustomError("Job not found", 404)
  res.status(200).json({
    success: true,
    message: `Job with id ${req.params.id} deleted`
  })
})

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }