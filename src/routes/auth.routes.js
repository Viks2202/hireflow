const express = require("express")
const router = express.Router()

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  handleRefreshToken,
  logout
} = require("../controllers/auth.controller")

const { protect } = require("../middlewares/auth.middleware")

router.post("/register", register)
router.post("/login", login)
router.get("/me", protect, getMe)
router.put("/profile", protect, updateProfile)
router.put("/change-password", protect, changePassword)
router.post("/refresh", handleRefreshToken)
router.post("/logout", protect, logout)

module.exports = router