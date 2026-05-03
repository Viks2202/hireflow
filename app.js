const express = require("express")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const connectDB = require("./src/config/db")
const jobRoutes = require("./src/routes/job.routes")
const authRoutes = require("./src/routes/auth.routes")
const logger = require("./src/middlewares/logger.middleware")
const errorHandler = require("./src/middlewares/error.middleware")
const requestTime = require("./src/middlewares/requestTime.middleware")
const apiVersion = require("./src/middlewares/apiVersion.middleware")

const app = express()

connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(logger)
app.use(requestTime)
app.use(apiVersion)

app.use("/auth", authRoutes)
app.use("/jobs", jobRoutes)

app.get("/", (req, res) => {
  res.json({ message: "HireFlow API running!", version: "1.0.0" })
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`
  })
})

app.use(errorHandler)

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
  console.log(`HireFlow server running on port ${PORT}`)
})