const db = require("../db/queries")
const createUser = async (req, res) => {
  let playerName = req.body.playerName
  let completionTime = req.body.completionTime

  await db.createUser(playerName, completionTime)

  res.json({
    message: `The user with playerName ${playerName}  will be registered with prisma`,
  })
}
module.exports = {
  createUser,
}
