const jobCheck = (req, res, next) => {
  const { salary } = req.body

  if (salary && salary.min && salary.max) {
    if (salary.min > salary.max) {
      return next(
        new Error("Minimum salary cannot be greater than maximum salary")
      )
    }
  }

  next()
}

module.exports = jobCheck