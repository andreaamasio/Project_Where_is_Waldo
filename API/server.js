const express = require("express")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get("/", (req, res) => res.send("Hello, world!"))

const PORT = 3000
app.listen(PORT, () => {
  console.log(`API of Waldo running on port: ${PORT}!`)
})
