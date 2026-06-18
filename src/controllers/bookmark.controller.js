const asyncHandler = require("../middlewares/async.middleware")
const CustomError = require("../middlewares/customError")
const Bookmark = require("../models/bookmark.model")
const Job = require("../models/job.model")

// GET all saved jobs for candidate
const getBookmarks = asyncHandler(async (req, res, next) => {
  const bookmarks = await Bookmark.find({ user: req.user.id })
    .populate("job", "title company location type salary skills isActive postedBy")
    .sort({ createdAt: -1 })

  // Only return bookmarks where job still exists and is active
  const activeBookmarks = bookmarks.filter(b => b.job && b.job.isActive)

  res.status(200).json({
    success: true,
    count: activeBookmarks.length,
    bookmarks: activeBookmarks
  })
})

// SAVE a job
const saveJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.body

  if (!jobId) {
    return next(new CustomError("Job ID is required", 400))
  }

  // Check job exists and is active
  const job = await Job.findById(jobId)
  if (!job || !job.isActive) {
    return next(new CustomError("Job not found", 404))
  }

  // Check not already saved
  const existing = await Bookmark.findOne({
    user: req.user.id,
    job: jobId
  })
  if (existing) {
    return next(new CustomError("Job already saved", 409))
  }

  await Bookmark.create({ user: req.user.id, job: jobId })

  res.status(201).json({
    success: true,
    message: "Job saved successfully"
  })
})

// UNSAVE a job
const unsaveJob = asyncHandler(async (req, res, next) => {
  const deleted = await Bookmark.findOneAndDelete({
    user: req.user.id,
    job: req.params.jobId
  })

  if (!deleted) {
    return next(new CustomError("Saved job not found", 404))
  }

  res.status(200).json({
    success: true,
    message: "Job removed from saved"
  })
})

// CHECK if a job is saved
const checkBookmark = asyncHandler(async (req, res, next) => {
  const bookmark = await Bookmark.findOne({
    user: req.user.id,
    job: req.params.jobId
  })

  res.status(200).json({
    success: true,
    isSaved: !!bookmark
  })
})

module.exports = { getBookmarks, saveJob, unsaveJob, checkBookmark }