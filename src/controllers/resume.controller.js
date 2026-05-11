const asyncHandler = require("../middlewares/async.middleware")
const CustomError = require("../middlewares/customError")
const User = require("../models/user.model")
const {
  uploadToCloudinary,
  deleteFromCloudinary
} = require("../middlewares/upload.middleware")

// upload resume
const uploadResume = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new CustomError("Please upload a PDF resume", 400))
  }

  const user = await User.findById(req.user.id)

  // delete old resume from Cloudinary if exists
  if (user.resumePublicId) {
    await deleteFromCloudinary(user.resumePublicId, "raw")
  }

  // upload new resume to Cloudinary
  const result = await uploadToCloudinary(
    req.file.buffer,
    "hireflow/resumes",
    "raw"
  )

  user.resume = result.secure_url
  user.resumePublicId = result.public_id
  await user.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
    message: "Resume uploaded successfully",
    resumeUrl: user.resume
  })
})

// get my resume
const getMyResume = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  if (!user.resume) {
    return next(new CustomError("No resume uploaded yet", 404))
  }

  res.status(200).json({
    success: true,
    resumeUrl: user.resume
  })
})

// delete resume
const deleteResume = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  if (!user.resume) {
    return next(new CustomError("No resume to delete", 404))
  }

  if (user.resumePublicId) {
    await deleteFromCloudinary(user.resumePublicId, "raw")
  }

  user.resume = null
  user.resumePublicId = null
  await user.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
    message: "Resume deleted successfully"
  })
})

module.exports = { uploadResume, getMyResume, deleteResume }