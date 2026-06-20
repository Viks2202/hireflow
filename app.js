const express = require("express")
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
const cors = require("cors")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")
const swaggerUi = require("swagger-ui-express")
require("dotenv").config()

const connectDB = require("./src/config/db")
const swaggerSpec = require("./src/config/swagger")
const logger = require("./src/utils/logger")

// Import all routes
const authRoutes = require("./src/routes/auth.routes")
const jobRoutes = require("./src/routes/job.routes")
const userRoutes = require("./src/routes/user.routes")
const resumeRoutes = require("./src/routes/resume.routes")
const applicationRoutes = require("./src/routes/application.routes")
const adminRoutes = require("./src/routes/admin.routes")
const bookmarkRoutes = require("./src/routes/bookmark.routes")

const errorHandler = require("./src/middlewares/error.middleware")
const requestTime = require("./src/middlewares/requestTime.middleware")
const apiVersion = require("./src/middlewares/apiVersion.middleware")

const app = express()

// Connect to MongoDB
connectDB()

// ============================================
// SECURITY
// ============================================

app.use(helmet())

// ============================================
// CORS — explicit allowlist (must come before routes)
// ============================================

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://hireflow-frontend-khaki.vercel.app",  // ← your real URL
  process.env.CLIENT_URL
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      logger.error(`CORS blocked request from origin: ${origin}`)
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Auth rate limit (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Too many auth attempts, please try again after 1 hour"
  }
})

app.use("/api/", globalLimiter)

// HTTP request logger
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))

// ============================================
// REQUEST PARSING
// ============================================

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(cookieParser())

// Prevent NoSQL injection attacks
app.use(mongoSanitize())

// Prevent XSS attacks
app.use(xss())

// Prevent HTTP parameter pollution
app.use(hpp({
  whitelist: ["sort", "type", "skills", "page", "limit", "status", "location"]
}))

app.use(requestTime)
app.use(apiVersion)

// ============================================
// SWAGGER API DOCUMENTATION
// ============================================

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "HireFlow API Documentation"
}))

// ============================================
// API ROUTES — all under /api/v1
// ============================================

const API_V1 = "/api/v1"

app.use(`${API_V1}/auth`, authLimiter, authRoutes)
app.use(`${API_V1}/jobs`, jobRoutes)
app.use(`${API_V1}/users`, userRoutes)
app.use(`${API_V1}/resume`, resumeRoutes)
app.use(`${API_V1}/applications`, applicationRoutes)
app.use(`${API_V1}/admin`, adminRoutes)
app.use(`${API_V1}/bookmarks`, bookmarkRoutes)

// ============================================
// UTILITY ROUTES
// ============================================

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  })
})

// Root
app.get("/", (req, res) => {
  res.json({
    message: "HireFlow API running!",
    version: "1.0.0",
    docs: `${req.protocol}://${req.get("host")}/api-docs`,
    health: `${req.protocol}://${req.get("host")}/health`,
    api: `${req.protocol}://${req.get("host")}/api/v1`
  })
})

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  })
})

// Global error handler — must be last
app.use(errorHandler)

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 9000

const server = app.listen(PORT, () => {
  logger.info(`HireFlow running on port ${PORT} [${process.env.NODE_ENV || "development"}]`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`)
  server.close(() => process.exit(1))
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})