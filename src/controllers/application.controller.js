const asyncHandler = require("../middlewares/async.middleware")
const CustomError = require("../middlewares/customError")
const Application = require("../models/application.model")
const Job = require("../models/job.model")
const User = require("../models/user.model")
const { sendEmail, emailTemplates } = require("../utils/email")

// APPLY for job
const applyForJob = asyncHandler(async (req, res, next) => {
  const jobId = req.params.id
  const { coverLetter } = req.body

  if (req.user.role !== "candidate") {
    return next(new CustomError("Only candidates can apply for jobs", 403))
  }

  const user = await User.findById(req.user.id)

  if (!user.resume) {
    return next(
      new CustomError("Please upload your resume before applying", 400)
    )
  }

  const job = await Job.findById(jobId)

  if (!job) {
    return next(new CustomError("Job not found", 404))
  }

  if (!job.isActive) {
    return next(new CustomError("This job is no longer active", 400))
  }

  const existing = await Application.findOne({
    job: jobId,
    candidate: req.user.id
  })

  if (existing) {
    return next(new CustomError("You already applied for this job", 409))
  }

  const application = await Application.create({
    job: jobId,
    candidate: req.user.id,
    resume: user.resume,
    coverLetter
  })

  await Job.findByIdAndUpdate(jobId, {
    $inc: { applicants: 1 }
  })

  try {
    const { subject, html } = emailTemplates.applicationReceived(
      user.name,
      job.title,
      job.company
    )
    await sendEmail({ to: user.email, subject, html })
  } catch (err) {
    console.error("Email failed:", err.message)
  }

  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    application
  })
})

// GET my applications
const getMyApplications = asyncHandler(async (req, res, next) => {
  const applications = await Application.find({
    candidate: req.user.id
  })
  .populate("job", "title company location type salary")
  .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: applications.length,
    applications
  })
})

// GET applications for a job
const getJobApplications = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id)

  if (!job) {
    return next(new CustomError("Job not found", 404))
  }

  const applications = await Application.find({ job: req.params.id })
    .populate("candidate", "name email skills resume")
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: applications.length,
    applications
  })
})

// UPDATE application status
const updateApplicationStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body

  const validStatuses = [
    "applied", "reviewing", "shortlisted", "rejected", "hired"
  ]

  if (!validStatuses.includes(status)) {
    return next(new CustomError("Invalid status", 400))
  }

  const application = await Application.findById(req.params.id)
    .populate("candidate", "name email")
    .populate("job", "title")

  if (!application) {
    return next(new CustomError("Application not found", 404))
  }

  application.status = status
  await application.save()

  try {
    const { subject, html } = emailTemplates.applicationStatusUpdate(
      application.candidate.name,
      application.job.title,
      status
    )
    await sendEmail({
      to: application.candidate.email,
      subject,
      html
    })
  } catch (err) {
    console.error("Email failed:", err.message)
  }

  res.status(200).json({
    success: true,
    message: `Application status updated to ${status}`,
    application
  })
})

// WITHDRAW application
const withdrawApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id)

  if (!application) {
    return next(new CustomError("Application not found", 404))
  }

  if (application.candidate.toString() !== req.user.id) {
    return next(new CustomError("Not authorized", 403))
  }

  if (application.status === "hired") {
    return next(new CustomError("Cannot withdraw after being hired", 400))
  }

  await Application.findByIdAndDelete(req.params.id)

  await Job.findByIdAndUpdate(application.job, {
    $inc: { applicants: -1 }
  })

  res.status(200).json({
    success: true,
    message: "Application withdrawn successfully"
  })
})

// GET all applications — admin
const getAllApplications = asyncHandler(async (req, res, next) => {
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

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  getAllApplications
}