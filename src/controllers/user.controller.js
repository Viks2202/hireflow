const asyncHandler = require("../middlewares/async.middleware")
const CustomError = require("../middlewares/customError")
const User = require("../models/user.model")

const getAllCandidates = asyncHandler(async (req, res, next) => {
  const candidates = await User.find({
    role: "candidate",
    isActive: true
  })
  .select("name email skills createdAt")
  .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: candidates.length,
    candidates
  })
})

const getAllEmployers = asyncHandler(async (req, res, next) => {
  const employers = await User.find({
    role: "employer",
    isActive: true
  })
  .select("name email company createdAt")
  .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: employers.length,
    employers
  })
})

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new CustomError("User not found", 404))
  }

  res.status(200).json({ success: true, user })
})

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  )

  if (!user) {
    return next(new CustomError("User not found", 404))
  }

  res.status(200).json({
    success: true,
    message: "User deactivated successfully"
  })
})

module.exports = {
  getAllCandidates,
  getAllEmployers,
  getUser,
  deleteUser
}