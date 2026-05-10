const multer = require("multer")
const cloudinary = require("../config/cloudinary")
const CustomError = require("./customError")

const storage = multer.memoryStorage()

// image filter
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new CustomError("Only image files allowed", 400), false)
  }
}

// PDF filter
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true)
  } else {
    cb(new CustomError("Only PDF files allowed for resume", 400), false)
  }
}

// multer for images
const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})

// multer for PDF
const uploadPDF = multer({
  storage,
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
})

// upload to Cloudinary
const uploadToCloudinary = async (
  fileBuffer,
  folder,
  resourceType = "image"
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(fileBuffer)
  })
}

// delete from Cloudinary
const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType
  })
}

module.exports = {
  uploadImage,
  uploadPDF,
  uploadToCloudinary,
  deleteFromCloudinary
}