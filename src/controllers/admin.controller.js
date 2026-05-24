const asyncHandler = require("../middlewares/async.middleware")
const User = require("../models/user.model")
const Job = require("../models/job.model")
const Application = require("../models/application.model")

// GET dashboard stats
const getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments({ isActive: true })
  const totalCandidates = await User.countDocuments({
    role: "candidate",
    isActive: true
  })
  const totalEmployers = await User.countDocuments({
    role: "employer",
    isActive: true
  })
  const totalJobs = await Job.countDocuments({ isActive: true })
  const totalApplications = await Application.countDocuments()

  // applications by status
  const applied = await Application.countDocuments({ status: "applied" })
  const reviewing = await Application.countDocuments({ status: "reviewing" })
  const shortlisted = await Application.countDocuments({ status: "shortlisted" })
  const rejected = await Application.countDocuments({ status: "rejected" })
  const hired = await Application.countDocuments({ status: "hired" })

  // recent applications
  const recentApplications = await Application.find()
    .populate("candidate", "name email")
    .populate("job", "title company")
    .sort({ createdAt: -1 })
    .limit(5)

  // top jobs by applicants
  const topJobs = await Job.find({ isActive: true })
    .sort({ applicants: -1 })
    .limit(5)
    .select("title company location applicants type")

  // jobs by type
  const fulltime = await Job.countDocuments({ type: "fulltime", isActive: true })
  const remote = await Job.countDocuments({ type: "remote", isActive: true })
  const internship = await Job.countDocuments({ type: "internship", isActive: true })
  const parttime = await Job.countDocuments({ type: "parttime", isActive: true })
  const contract = await Job.countDocuments({ type: "contract", isActive: true })

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalCandidates,
      totalEmployers,
      totalJobs,
      totalApplications,
      applicationsByStatus: {
        applied,
        reviewing,
        shortlisted,
        rejected,
        hired
      },
      jobsByType: {
        fulltime,
        remote,
        internship,
        parttime,
        contract
      }
    },
    recentApplications,
    topJobs
  })
})

// GET all users
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find()
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: users.length,
    users
  })
})

// GET all jobs (including inactive)
const getAllJobsAdmin = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find()
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: jobs.length,
    jobs
  })
})

// GET all applications
const getAllApplicationsAdmin = asyncHandler(async (req, res, next) => {
  const applications = await Application.find()
    .populate("candidate", "name email")
    .populate("job", "title company")
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: applications.length,
    applications
  })
})

// DEACTIVATE user
const deactivateUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  )

  res.status(200).json({
    success: true,
    message: "User deactivated"
  })
})

// ACTIVATE job
const activateJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  )

  res.status(200).json({
    success: true,
    message: "Job activated",
    job
  })
})

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllJobsAdmin,
  getAllApplicationsAdmin,
  deactivateUser,
  activateJob
}