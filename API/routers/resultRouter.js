const { Router } = require("express")

const resultController = require("../controllers/resultController")
const resultRouter = Router()

resultRouter.get("/", resultController.getResults)

module.exports = resultRouter

//
