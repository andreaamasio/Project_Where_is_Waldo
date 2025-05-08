const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
async function createUser(playerName, completionTime, level) {
  try {
    const anonymousUser = await prisma.anonymousUser.create({
      data: {},
    })

    const newResult = await prisma.result.create({
      data: {
        playerName,
        completionTime,
        level,
        anonymousUserId: anonymousUser.id,
      },
    })

    console.log(`User successfully created: ${playerName}`)
    return newResult
  } catch (error) {
    console.error(`Error creating new user (${playerName}):`, error)
    throw error
  }
}
async function getLocationsByLevel(level) {
  try {
    const locations = await prisma.character.findMany({
      where: { level: level },
    })

    console.log(`Locations: ${locations}`)
    return locations
  } catch (error) {
    console.error(
      `Error finding locations with prisma for level (${level}):`,
      error
    )
    throw error
  }
}
module.exports = { createUser, getLocationsByLevel }
