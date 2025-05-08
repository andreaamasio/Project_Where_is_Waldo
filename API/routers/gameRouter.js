const { Router } = require("express")

const gameController = require("../controllers/gameController")
const gameRouter = Router()

gameRouter.get("/:level", gameController.getLocationsByLevel)

module.exports = gameRouter

//
