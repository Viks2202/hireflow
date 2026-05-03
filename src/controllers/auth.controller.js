const jwt = require("jsonwebtoken")
const asyncHandler = require("../middlewares/async.middleware")
const CustomError = require("../middlewares/customError")
const User = require("../models/user.model")

// generate access token
const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })

// generate refresh token
const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE
  })

// REGISTER
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, company } = req.body

  // check required fields
  if (!name || !email || !password) {
    return next(new CustomError("name, email and password are required", 400))
  }

  // check duplicate email
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return next(new CustomError("Email already registered", 409))
  }

  // employer must have company name
  if (role === "employer" && !company) {
    return next(new CustomError("Company name is required for employers", 400))
  }

  // create user — password auto hashed by pre-save hook
  const user = await User.create({
    name,
    email,
    password,
    role: role || "candidate",
    company: company || null
  })

  // generate tokens
  const accessToken = generateAccessToken(user._id)
  const refreshTokenStr = generateRefreshToken(user._id)

  // save refresh token to DB
  user.refreshToken = refreshTokenStr
  await user.save({ validateBeforeSave: false })

  // send refresh token as httpOnly cookie
  res.cookie("refreshToken", refreshTokenStr, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(201).json({
    success: true,
    message: "Registered successfully",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company
    }
  })
})

// LOGIN
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new CustomError("Email and password are required", 400))
  }

  // get user with password
  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    return next(new CustomError("Invalid email or password", 401))
  }

  // compare password
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    return next(new CustomError("Invalid email or password", 401))
  }

  const accessToken = generateAccessToken(user._id)
  const refreshTokenStr = generateRefreshToken(user._id)

  user.refreshToken = refreshTokenStr
  await user.save({ validateBeforeSave: false })

  res.cookie("refreshToken", refreshTokenStr, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company
    }
  })
})

// GET ME
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({ success: true, user })
})

// UPDATE PROFILE
const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email, skills, company } = req.body

  if (req.body.password) {
    return next(
      new CustomError("Use /auth/change-password to update password", 400)
    )
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, skills, company },
    { new: true, runValidators: true }
  )

  res.status(200).json({ success: true, user })
})

// CHANGE PASSWORD
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return next(
      new CustomError("Current and new password are required", 400)
    )
  }

  const user = await User.findById(req.user.id).select("+password")

  const isMatch = await user.comparePassword(currentPassword)
  if (!isMatch) {
    return next(new CustomError("Current password is incorrect", 401))
  }

  user.password = newPassword
  await user.save()

  res.status(200).json({
    success: true,
    message: "Password changed successfully"
  })
})

// HANDLE REFRESH TOKEN
const handleRefreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken

  if (!token) {
    return next(new CustomError("No refresh token", 401))
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

  const user = await User.findOne({
    _id: decoded.id,
    refreshToken: token
  }).select("+refreshToken")

  if (!user) {
    return next(new CustomError("Invalid refresh token", 401))
  }

  const accessToken = generateAccessToken(user._id)
  res.status(200).json({ success: true, accessToken })
})

// LOGOUT
const logout = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { refreshToken: null })
  res.clearCookie("refreshToken")
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
})

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  handleRefreshToken,
  logout
}