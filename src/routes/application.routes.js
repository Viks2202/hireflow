/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job applications
 */

/**
 * @swagger
 * /applications/job/{id}:
 *   post:
 *     summary: Apply for a job (candidate only)
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coverLetter:
 *                 type: string
 *                 example: I am very interested in this position...
 *     responses:
 *       201:
 *         description: Applied successfully
 *       409:
 *         description: Already applied
 */

/**
 * @swagger
 * /applications/my:
 *   get:
 *     summary: Get my applications (candidate)
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: List of applications
 */

/**
 * @swagger
 * /applications/{id}/status:
 *   put:
 *     summary: Update application status (employer/admin)
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [applied, shortlisted, rejected, hired]
 *     responses:
 *       200:
 *         description: Status updated
 */
const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middlewares/auth.middleware")
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  getAllApplications
} = require("../controllers/application.controller")

router.post("/job/:id", protect, authorize("candidate"), applyForJob)
router.get("/my", protect, authorize("candidate"), getMyApplications)
router.delete("/:id", protect, authorize("candidate"), withdrawApplication)
router.get("/job/:id", protect, authorize("employer", "admin"), getJobApplications)
router.put("/:id/status", protect, authorize("employer", "admin"), updateApplicationStatus)
router.get("/all", protect, authorize("admin"), getAllApplications)

module.exports = router