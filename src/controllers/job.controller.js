// fake jobs data — real DB comes Day 3
const jobs = [
  {
    id: "1",
    title: "Backend Developer",
    company: "TechCorp India",
    location: "Delhi NCR",
    type: "fulltime",
    salary: { min: 600000, max: 1200000 },
    skills: ["Node.js", "Express", "MongoDB"],
    experience: "1-3 years",
    postedAt: "2026-04-20"
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "StartupX",
    location: "Remote",
    type: "remote",
    salary: { min: 400000, max: 800000 },
    skills: ["React", "Tailwind", "JavaScript"],
    experience: "0-1 years",
    postedAt: "2026-04-19"
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "ProductBase",
    location: "Bangalore",
    type: "fulltime",
    salary: { min: 800000, max: 1500000 },
    skills: ["Node.js", "React", "PostgreSQL"],
    experience: "2-4 years",
    postedAt: "2026-04-18"
  }
]

// GET all jobs
const getAllJobs = (req, res) => {
  res.status(200).json({
    success: true,
    count: jobs.length,
    jobs
  })
}

// GET single job
const getJob = (req, res) => {
  const job = jobs.find(j => j.id === req.params.id)

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found"
    })
  }

  res.status(200).json({ success: true, job })
}

// POST create job
const createJob = (req, res) => {
  const { title, company, location, type, salary, skills } = req.body

  if (!title || !company || !location || !type) {
    return res.status(400).json({
      success: false,
      message: "title, company, location and type are required"
    })
  }

  const newJob = {
    id: String(jobs.length + 1),
    title,
    company,
    location,
    type,
    salary,
    skills,
    postedAt: new Date().toISOString().split("T")[0]
  }

  res.status(201).json({ success: true, job: newJob })
}

// PUT update job
const updateJob = (req, res) => {
  const id = req.params.id
  const data = req.body

  const job = jobs.find(j => j.id === id)

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found"
    })
  }

  res.status(200).json({
    success: true,
    message: "Job updated",
    id,
    updated: data
  })
}

// DELETE job
const deleteJob = (req, res) => {
  const id = req.params.id

  const job = jobs.find(j => j.id === id)

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found"
    })
  }

  res.status(200).json({
    success: true,
    message: `Job with id ${id} deleted`
  })
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}