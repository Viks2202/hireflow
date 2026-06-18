const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middlewares/auth.middleware")
const {
  getBookmarks,
  saveJob,
  unsaveJob,
  checkBookmark
} = require("../controllers/bookmark.controller")

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: Save/unsave jobs (candidate only)
 */

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: Get all saved jobs
 *     tags: [Bookmarks]
 *     responses:
 *       200:
 *         description: List of saved jobs
 */
router.get("/", protect, authorize("candidate"), getBookmarks)

/**
 * @swagger
 * /bookmarks/save:
 *   post:
 *     summary: Save a job
 *     tags: [Bookmarks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobId]
 *             properties:
 *               jobId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job saved
 *       409:
 *         description: Already saved
 */
router.post("/save", protect, authorize("candidate"), saveJob)
router.delete("/:jobId", protect, authorize("candidate"), unsaveJob)
router.get("/check/:jobId", protect, authorize("candidate"), checkBookmark)

module.exports = router