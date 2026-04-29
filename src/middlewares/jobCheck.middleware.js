const CustomError = require("./customError")

const jobCheck = (req, res, next) => {
  const { salary } = req.body

  if (salary && salary.min && salary.max) {
    if (salary.min > salary.max) {
      throw new CustomError(
        "Minimum salary cannot be greater than maximum salary",
        400
      )
    }
  }

  next()
}

module.exports = jobCheck