const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middlewares/auth.middleware")
const {
  getDashboardStats,
  getAllUsers,
  getAllJobsAdmin,
  getAllApplicationsAdmin,
  deactivateUser,
  activateJob
} = require("../controllers/admin.controller")

router.get("/stats", protect, authorize("admin"), getDashboardStats)
router.get("/users", protect, authorize("admin"), getAllUsers)
router.get("/jobs", protect, authorize("admin"), getAllJobsAdmin)
router.get("/applications", protect, authorize("admin"), getAllApplicationsAdmin)
router.put("/users/:id/deactivate", protect, authorize("admin"), deactivateUser)
router.put("/jobs/:id/activate", protect, authorize("admin"), activateJob)

module.exports = router