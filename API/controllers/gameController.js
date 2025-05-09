const db = require("../db/queries")
const getLocationsByLevel = async (req, res) => {
  const { level } = req.params
  const levelInt = parseInt(level)

  let data = await db.getLocationsByLevel(levelInt)

  res.json({
    data: data,
  })
}
module.exports = {
  getLocationsByLevel,
}
