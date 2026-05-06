const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter valid email"
      ]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false
    },
    role: {
      type: String,
      enum: ["candidate", "employer", "admin"],
      default: "candidate"
    },
    resume: { type: String, default: null },
    skills: { type: [String], default: [] },
    company: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String, select: false },
    emailVerifyToken: { type: String, select: false },
    emailVerifyExpire: { type: Date, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false }
  },
  { timestamps: true }
)

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.generateEmailVerifyToken = function () {
  const token = crypto.randomBytes(32).toString("hex")
  this.emailVerifyToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")
  this.emailVerifyExpire = Date.now() + 24 * 60 * 60 * 1000
  return token
}

userSchema.methods.generateResetPasswordToken = function () {
  const token = crypto.randomBytes(32).toString("hex")
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
  return token
}

const User = mongoose.model("User", userSchema)
module.exports = User