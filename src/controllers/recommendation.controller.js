const asyncHandler = require("../middlewares/async.middleware")
const Job = require("../models/job.model")
const User = require("../models/user.model")
const Application = require("../models/application.model")

// GET recommended jobs for candidate based on their skills
const getRecommendedJobs = asyncHandler(async (req, res, next) => {
  // Get candidate with skills
  const user = await User.findById(req.user.id)

  // Get job IDs candidate already applied to
  // So we don't recommend jobs they already applied for
  const applications = await Application.find({
    candidate: req.user.id
  }).select("job")
  const appliedJobIds = applications.map(a => a.job.toString())

  let recommendedJobs = []

  if (user.skills && user.skills.length > 0) {
    // Find active jobs that need ANY of candidate's skills
    // Exclude jobs already applied to
    recommendedJobs = await Job.find({
      isActive: true,
      skills: { $in: user.skills },
      _id: { $nin: appliedJobIds }
    })
    .sort({ createdAt: -1 })
    .limit(20)

    // Add match score to each job
    recommendedJobs = recommendedJobs.map(job => {
      const jobObj = job.toObject()
      const matchingSkills = job.skills.filter(skill =>
        user.skills.includes(skill)
      )
      jobObj.matchScore = matchingSkills.length
      jobObj.matchingSkills = matchingSkills
      return jobObj
    })

    // Sort by highest match score first
    recommendedJobs.sort((a, b) => b.matchScore - a.matchScore)

    // Return top 10
    recommendedJobs = recommendedJobs.slice(0, 10)
  } else {
    // No skills added yet — return latest 10 jobs
    recommendedJobs = await Job.find({
      isActive: true,
      _id: { $nin: appliedJobIds }
    })
    .sort({ createdAt: -1 })
    .limit(10)
  }

  res.status(200).json({
    success: true,
    message: user.skills?.length > 0
      ? `Found ${recommendedJobs.length} jobs matching your skills`
      : "Add skills to your profile for personalized recommendations",
    userSkills: user.skills || [],
    count: recommendedJobs.length,
    jobs: recommendedJobs
  })
})

module.exports = { getRecommendedJobs }