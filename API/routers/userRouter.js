const { Router } = require("express")

const userController = require("../controllers/userController")
const userRouter = Router()

//userRouter.get("/:userId", userController.getUser)
userRouter.post("/", userController.createUser)

module.exports = userRouter

//
