const express = require("express")
const router = express.Router()

const {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
  handleRefreshToken,
  logout
} = require("../controllers/auth.controller")

const { protect } = require("../middlewares/auth.middleware")

router.post("/register", register)
router.get("/verify-email/:token", verifyEmail)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.get("/me", protect, getMe)
router.put("/profile", protect, updateProfile)
router.put("/change-password", protect, changePassword)
router.post("/refresh", handleRefreshToken)
router.post("/logout", protect, logout)

router.get("/test-email", async (req, res) => {
  try {
    const { sendEmail } = require("../utils/email")
    await sendEmail({
      to: "test@example.com",
      subject: "HireFlow Test Email",
      html: "<h1>Email working!</h1>"
    })
    res.json({ success: true, message: "Email sent. Check Mailtrap." })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

module.exports = router