const express = require("express")
const cors = require("cors")
const userRouter = require("./routers/userRouter")
const gameRouter = require("./routers/gameRouter")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors()) //to update to frontend origin like app.use(cors({  origin: 'https://my-frontend-domain.com'}))
app.use("/user", userRouter)
app.use("/game", gameRouter)

app.get("/", (req, res) => res.json({ message: "Welcome to Waldo API!" }))

const PORT = 3000
app.listen(PORT, () => {
  console.log(`API of Waldo running on port: ${PORT}!`)
})
