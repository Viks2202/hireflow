/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job listings
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all active jobs with filters
 *     tags: [Jobs]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or company
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [fulltime, parttime, remote, internship, contract]
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of jobs
 */

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get single job by ID
 *     tags: [Jobs]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job (employer/admin only)
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, company, location, type, description]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Backend Developer
 *               company:
 *                 type: string
 *                 example: Tech Corp
 *               location:
 *                 type: string
 *                 example: Delhi NCR
 *               type:
 *                 type: string
 *                 enum: [fulltime, parttime, remote, internship, contract]
 *               description:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Node.js, MongoDB, Express]
 *               salary:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *     responses:
 *       201:
 *         description: Job created
 */
const express = require("express")
const router = express.Router()
const jobCheck = require("../middlewares/jobCheck.middleware")
const paginationDefaults = require("../middlewares/pagination.middleware")
const { protect, authorize } = require("../middlewares/auth.middleware")
const { getRecommendedJobs } = require("../controllers/recommendation.controller")

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
  getJobsByType,
  searchJobs
} = require("../controllers/job.controller")

// public routes — no login needed
router.get("/search", searchJobs)
router.get("/stats", getJobStats)
router.get("/type/:type", getJobsByType)
/**
 * @swagger
 * /jobs/recommended:
 *   get:
 *     summary: Get jobs recommended based on candidate skills
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Recommended jobs
 */
router.get("/recommended", protect, authorize("candidate"), getRecommendedJobs)
router.get("/", paginationDefaults, getAllJobs)
router.get("/:id", getJob)

// protected routes — login + employer/admin only
router.post("/", protect, authorize("employer", "admin"), jobCheck, createJob)
router.put("/:id", protect, authorize("employer", "admin"), updateJob)
router.delete("/:id", protect, authorize("employer", "admin"), deleteJob)

module.exports = router