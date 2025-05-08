const db = require("../db/queries")
const getLocationsByLevel = async (req, res) => {
  const { level } = req.params

  let data = await db.getLocationsByLevel(level)

  res.json({
    data: data,
  })
}
module.exports = {
  getLocationsByLevel,
}
