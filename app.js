const express = require("express")
require("dotenv").config()

const jobRoutes = require("./src/routes/job.routes")

const app = express()
app.use(express.json())

// all job routes
app.use("/jobs", jobRoutes)

// home
app.get("/", (req, res) => {
  res.json({
    message: "HireFlow API running!",
    version: "1.0.0"
  })
})

// unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  })
})

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
  console.log(`HireFlow server running on port ${PORT}`)
})