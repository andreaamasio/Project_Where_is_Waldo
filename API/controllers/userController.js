const db = require("../db/queries")
const createUser = async (req, res) => {
  let playerName = req.body.playerName
  let completionTime = req.body.completionTime
  let level = req.body.level

  await db.createUser(playerName, completionTime, level)

  res.json({
    message: `The user with playerName ${playerName}  will be registered with prisma`,
  })
}
module.exports = {
  createUser,
}
