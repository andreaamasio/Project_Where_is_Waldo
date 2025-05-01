import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import Game from "./components/Game.jsx"
import NavBar from "./components/NavBar.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NavBar />
    <Game />
  </StrictMode>
)
