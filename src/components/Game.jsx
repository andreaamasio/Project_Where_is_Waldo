import React, { useRef, useState, useEffect } from "react"
import "./Game.css"

function Game() {
  const API = "https://project-where-is-waldo.onrender.com"
  const [clickPosition, setClickPosition] = useState(null)
  const [menuVisible, setMenuVisible] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [foundCharacters, setFoundCharacters] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const imageRef = useRef(null)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef(null)
  const [playerName, setPlayerName] = useState("")
  const [showSubmit, setShowSubmit] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showGame, setShowGame] = useState(true)
  const [results, setResults] = useState([])
  const characterNames = [
    { name: "Waldo", img: "/pictures/waldo-drop.jpg" },
    { name: "Odlaw", img: "/pictures/odlaw-drop.jpg" },
    { name: "Wizard", img: "/pictures/wizard-drop.jpeg" },
  ]
  const fetchResults = async () => {
    try {
      const response = await fetch(`${API}/result`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const json = await response.json()
      console.log("Fetched results:", json.data)
      setResults(json.data)
      setLoading(false)
      setShowSubmit(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
      setShowSubmit(false)
    }
  }
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API}/game/1`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const json = await response.json()
        console.log("Fetched locations:", json.data)
        setLocations(json.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  const handleImageClick = (event) => {
    const imageElement = imageRef.current
    if (!imageElement) return

    const rect = imageElement.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const normalizedX = x / rect.width
    const normalizedY = y / rect.height

    setClickPosition({ x: normalizedX, y: normalizedY })
    setMenuVisible(true)
  }

  const handleCharacterSelect = async (character) => {
    setMenuVisible(false)

    if (clickPosition) {
      // Simulate backend call (replace with your actual API call)
      const isCorrect = await checkCharacterLocation(character, clickPosition)

      if (isCorrect) {
        setFoundCharacters((prev) => ({
          ...prev,
          [character.toLowerCase()]: true,
        }))

        console.log(`${character} found!`)
      } else {
        setFeedbackMessage("Wrong! Try again.")
        setTimeout(() => setFeedbackMessage(""), 2000)
        console.log(`Incorrect guess for ${character}.`)
      }

      setClickPosition(null) // Reset click position after selection
    }
  }
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuVisible &&
        !event.target.closest(".character-menu") &&
        event.target !== imageRef.current
      ) {
        setMenuVisible(false)
        setClickPosition(null)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [menuVisible, imageRef])
  useEffect(() => {
    if (showResult) {
      fetchResults()
    }
  }, [showResult])
  const getMenuStyle = () => {
    if (!clickPosition) return { display: "none" }
    const imageElement = imageRef.current
    if (!imageElement) return { display: "none" }
    const xPos = clickPosition.x * imageElement.offsetWidth
    const yPos = clickPosition.y * imageElement.offsetHeight

    return {
      position: "absolute",
      left: `${xPos}px`,
      top: `${yPos}px`,

      backgroundColor: "white",
      border: "1px solid black",
      padding: "10px",
      zIndex: 10,
    }
  }
  //Backend communication
  const checkCharacterLocation = (character, coordinates) => {
    // Find the character object from the backend data
    const target = locations.find(
      (loc) => loc.name.toLowerCase() === character.toLowerCase()
    )

    if (!target || !target.locations || target.locations.length === 0) {
      console.error(
        `Character ${character} not found or missing location data.`
      )
      return false
    }

    // Assume we only have one bounding box (first item)
    const box = target.locations[0]

    const withinX = coordinates.x >= box.minX && coordinates.x <= box.maxX
    const withinY = coordinates.y >= box.minY && coordinates.y <= box.maxY

    return withinX && withinY
  }

  const allFound = characterNames.every(
    (c) => foundCharacters[c.name.toLowerCase()] === true
  )
  useEffect(() => {
    if (showGame) {
      setStartTime(Date.now())
    }
  }, [showGame])
  useEffect(() => {
    if (startTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime)
      }, 1000)

      return () => clearInterval(timerRef.current)
    }
  }, [startTime])
  const handleGoBack = () => {
    setShowResult(false)
    setShowGame(true)
    setFoundCharacters({
      waldo: false,
      odlaw: false,
      wizard: false,
    })
    setElapsedTime(0)
    const newStart = Date.now()
    setStartTime(newStart)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - newStart)
    }, 1000)
    setPlayerName("")
    setShowSubmit(false)
  }
  useEffect(() => {
    if (allFound) {
      clearInterval(timerRef.current)
      setShowSubmit(true)
      const finalTime = Date.now() - startTime
      console.log("All characters found!")
      console.log(`Elapsed time: ${Math.floor(finalTime / 1000)} seconds`)
      setElapsedTime(finalTime) // freeze the elapsed time
    }
  }, [allFound, startTime])
  const handleSubmitScore = async () => {
    if (playerName.trim() === "") {
      alert("Please enter your name")
      return
    }

    const scoreData = {
      playerName: playerName,
      completionTime: Math.floor(elapsedTime / 1000),
      level: 1,
    }

    try {
      const response = await fetch(`${API}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scoreData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit score")
      }

      //alert("Score submitted successfully!")
      // Optionally, reset the game or redirect
      setShowResult(true)
      setShowGame(false)
    } catch (err) {
      console.error(err)
      alert("Error submitting score")
    }
  }
  return (
    <div className="game-container">
      {loading && <div>Loading locations...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && (
        <div className="image-wrapper">
          <div className="top-bar">
            <div className="timer">
              Time: {Math.floor(elapsedTime / 1000)} seconds
            </div>

            <div className="character-tracker-wrapper">
              <span className="find-them">Find them all:</span>
              <div className="character-tracker">
                {characterNames.map((character) => {
                  const isFound =
                    foundCharacters[character.name.toLowerCase()] === true
                  return (
                    <div
                      key={character.name}
                      className="character-tracker-item"
                    >
                      <img
                        src={character.img}
                        alt={`${character.name} avatar`}
                        title={character.name}
                      />
                      <div className="character-checkbox">
                        {isFound ? "✅" : "⬜"}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          {feedbackMessage && (
            <div className="feedback-message">{feedbackMessage}</div>
          )}
          {showGame && (
            <img
              ref={imageRef}
              src="/pictures/level-1-waldo-odlaw-wizard.jpg"
              alt="game-picture"
              onClick={handleImageClick}
              className="game-image"
            />
          )}

          {menuVisible && clickPosition && (
            <div className="character-menu" style={getMenuStyle()}>
              <ul className="choose-menu-list">
                {characterNames.map((character) => {
                  const isFound =
                    foundCharacters[character.name.toLowerCase()] === true
                  return (
                    <li
                      key={character.name}
                      onClick={() =>
                        !isFound && handleCharacterSelect(character.name)
                      }
                      className={`character-menu-item ${
                        isFound ? "disabled" : ""
                      }`}
                      style={{
                        pointerEvents: isFound ? "none" : "auto",
                        opacity: isFound ? 0.6 : 1,
                      }}
                    >
                      <img
                        src={character.img}
                        alt={`${character.name} avatar`}
                      />
                      {character.name}{" "}
                      {isFound && <span style={{ marginLeft: "8px" }}>✅</span>}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {showSubmit && (
            <div className="overlay">
              <div className="submit-score">
                <p>
                  🎉 Congratulations! You finished in{" "}
                  {Math.floor(elapsedTime / 1000)} seconds.
                </p>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
                <br />
                <button onClick={handleSubmitScore}>Submit Score</button>
              </div>
            </div>
          )}
          {showResult && (
            <div className="results-container">
              <table>
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Completion Time</th>
                    <th>Player Name</th>
                    <th>Completed At</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id}>
                      <td>{result.level}</td>
                      <td>{result.completionTime} s</td>
                      <td>{result.playerName}</td>
                      <td>{new Date(result.completedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <button onClick={handleGoBack}>Go Back</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Game
