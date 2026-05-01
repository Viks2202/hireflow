const paginationDefaults = (req, res, next) => {
  req.query.page = req.query.page || "1"
  req.query.limit = req.query.limit || "10"

  const page = Number(req.query.page)
  const limit = Number(req.query.limit)

  if (page < 1) req.query.page = "1"
  if (limit < 1) req.query.limit = "10"
  if (limit > 50) req.query.limit = "50"

  next()
}

module.exports = paginationDefaults