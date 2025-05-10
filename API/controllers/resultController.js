const db = require("../db/queries")
const getResults = async (req, res) => {
  const data = await db.getResults()

  res.json({
    data: data,
  })
}
module.exports = {
  getResults,
}
