const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    resume: {
      type: String,
      required: [true, "Resume is required to apply"]
    },
    coverLetter: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["applied", "reviewing", "shortlisted", "rejected", "hired"],
      default: "applied"
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

// one application per candidate per job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true })

const Application = mongoose.model("Application", applicationSchema)
module.exports = Application