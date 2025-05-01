import React, { useRef, useState, useEffect } from "react"
import "./Game.css"

function Game() {
  const [clickPosition, setClickPosition] = useState(null)
  const [menuVisible, setMenuVisible] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [foundCharacters, setFoundCharacters] = useState([])
  const imageRef = useRef(null)
  const characterNames = [
    { name: "Waldo", img: "/pictures/waldo-drop.jpg" },
    { name: "Odlaw", img: "/pictures/odlaw-drop.jpg" },
    { name: "Wizard", img: "/pictures/wizard-drop.jpeg" },
  ]

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

  // const handleCharacterSelect = (character) => {
  //   if (!foundCharacters.includes(character)) {
  //     setSelectedCharacter(character)
  //     setFoundCharacters((prev) => [...prev, character])
  //     setMenuVisible(false)
  //     console.log(`Character ${character} selected at:`, clickPosition)
  //   }
  // }
  const handleCharacterSelect = async (character) => {
    setSelectedCharacter(character)
    setMenuVisible(false)

    if (clickPosition) {
      // Simulate backend call (replace with your actual API call)
      const isCorrect = await checkCharacterLocation(character, clickPosition)

      if (isCorrect) {
        setFoundCharacters((prev) => ({
          ...prev,
          [character.toLowerCase()]: true,
        }))
        // TODO: Place a marker on the photo in the character's location
        console.log(`${character} found!`)
      } else {
        // TODO: Provide user feedback (e.g., error message)
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
  const checkCharacterLocation = async (character, coordinates) => {
    // TODO: Implement your API call to the backend to validate the coordinates
    // against the database for the selected character.
    // This is a simulation for now.
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

    // Example logic (replace with your actual backend validation)
    const tolerance = 0.05 // Adjust as needed
    switch (character.toLowerCase()) {
      case "waldo":
        return (
          coordinates.x > 0.2 &&
          coordinates.x < 0.25 &&
          coordinates.y > 0.3 &&
          coordinates.y < 0.35
        )
      case "odlaw":
        return (
          coordinates.x > 0.7 &&
          coordinates.x < 0.75 &&
          coordinates.y > 0.6 &&
          coordinates.y < 0.65
        )
      case "wizard":
        return (
          coordinates.x > 0.5 &&
          coordinates.x < 0.55 &&
          coordinates.y > 0.1 &&
          coordinates.y < 0.15
        )
      default:
        return false
    }
  }

  const allFound =
    Object.keys(foundCharacters).length === characterNames.length &&
    Object.values(foundCharacters).every(Boolean)

  useEffect(() => {
    if (allFound) {
      // TODO: Implement timer logic and high score submission
      console.log("All characters found!")
      // You would typically stop the timer here and show the score.
    }
  }, [allFound, characterNames.length, foundCharacters])
  return (
    <div className="game-container">
      <div className="image-wrapper">
        <img
          ref={imageRef}
          src="/pictures/level-1-waldo-odlaw-wizard.jpg"
          alt="game-picture"
          onClick={handleImageClick}
          className="game-image"
        />
        {menuVisible && clickPosition && (
          <div className="character-menu" style={getMenuStyle()}>
            <ul className="choose-menu-list">
              {characterNames.map((character) => {
                const isFound = foundCharacters.includes(character.name)
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
                    <img src={character.img} alt={`${character.name} avatar`} />
                    {character.name}{" "}
                    {isFound && <span style={{ marginLeft: "8px" }}>✅</span>}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Game

// import React, { useState, useRef, useEffect } from 'react';

// function Game() {
//   const [clickPosition, setClickPosition] = useState(null);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [selectedCharacter, setSelectedCharacter] = useState(null);
//   const [foundCharacters, setFoundCharacters] = useState({}); // { waldo: true, odlaw: false, ... }
//   const [imageDetails, setImageDetails] = useState(null);
//   const imageRef = useRef(null);
//   const characterNames = ['Waldo', 'Odlaw', 'Wizard']; // Add all your characters here

//   useEffect(() => {
//     if (imageRef.current) {
//       setImageDetails({
//         width: imageRef.current.offsetWidth,
//         height: imageRef.current.offsetHeight,
//       });
//     }
//   }, []); // Get image dimensions on mount

//   const handleImageClick = (event) => {
//     if (!imageDetails) return;

//     const rect = imageRef.current.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     // Normalize coordinates based on image dimensions
//     const normalizedX = x / imageDetails.width;
//     const normalizedY = y / imageDetails.height;

//     setClickPosition({ x: normalizedX, y: normalizedY });
//     setMenuVisible(true);
//   };

//   const handleCharacterSelect = async (character) => {
//     setSelectedCharacter(character);
//     setMenuVisible(false);

//     if (clickPosition) {
//       // Simulate backend call (replace with your actual API call)
//       const isCorrect = await checkCharacterLocation(character, clickPosition);

//       if (isCorrect) {
//         setFoundCharacters((prev) => ({ ...prev, [character.toLowerCase()]: true }));
//         // TODO: Place a marker on the photo in the character's location
//         console.log(`${character} found!`);
//       } else {
//         // TODO: Provide user feedback (e.g., error message)
//         console.log(`Incorrect guess for ${character}.`);
//       }

//       setClickPosition(null); // Reset click position after selection
//     }
//   };

//   const handleOutsideClick = (event) => {
//     if (menuVisible && (!event.target.closest('.character-menu') && event.target !== imageRef.current)) {
//       setMenuVisible(false);
//       setClickPosition(null);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleOutsideClick);
//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick);
//     };
//   }, [menuVisible, imageRef]);

//   // Placeholder for backend communication
//   const checkCharacterLocation = async (character, coordinates) => {
//     // TODO: Implement your API call to the backend to validate the coordinates
//     // against the database for the selected character.
//     // This is a simulation for now.
//     await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

//     // Example logic (replace with your actual backend validation)
//     const tolerance = 0.05; // Adjust as needed
//     switch (character.toLowerCase()) {
//       case 'waldo':
//         return coordinates.x > 0.2 && coordinates.x < 0.25 && coordinates.y > 0.3 && coordinates.y < 0.35;
//       case 'odlaw':
//         return coordinates.x > 0.7 && coordinates.x < 0.75 && coordinates.y > 0.6 && coordinates.y < 0.65;
//       case 'wizard':
//         return coordinates.x > 0.5 && coordinates.x < 0.55 && coordinates.y > 0.1 && coordinates.y < 0.15;
//       default:
//         return false;
//     }
//   };

//   const allFound = Object.keys(foundCharacters).length === characterNames.length && Object.values(foundCharacters).every(Boolean);

//   useEffect(() => {
//     if (allFound) {
//       // TODO: Implement timer logic and high score submission
//       console.log('All characters found!');
//       // You would typically stop the timer here and show the score.
//     }
//   }, [allFound, characterNames.length, foundCharacters]);

//   return (
//     <div className="game-container">
//       <h1>Where is Waldo?</h1>
//       <div style={{ position: 'relative', display: 'inline-block' }}>
//         <img
//           ref={imageRef}
//           src="/pictures/level-1-waldo-odlaw-wizard.jpg"
//           alt="game-picture"
//           onClick={handleImageClick}
//           style={{ cursor: 'crosshair', userSelect: 'none' }}
//         />
//         {clickPosition && menuVisible && (
//           <div
//             className="character-menu"
//             style={{
//               position: 'absolute',
//               left: `${clickPosition.x * imageDetails.width}px`,
//               top: `${clickPosition.y * imageDetails.height}px`,
//               transform: 'translate(-50%, -50%)',
//               backgroundColor: 'white',
//               border: '1px solid black',
//               padding: '10px',
//               zIndex: 10,
//             }}
//           >
//             <ul>
//               {characterNames.map((char) => (
//                 <li key={char} onClick={() => handleCharacterSelect(char)} style={{ cursor: 'pointer' }}>
//                   {char}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//         {/* TODO: Implement markers for found characters */}
//         {Object.keys(foundCharacters).map((char) => (
//           foundCharacters[char] && (
//             <div
//               key={char}
//               className={`marker marker-${char}`}
//               style={{
//                 position: 'absolute',
//                 // TODO: Calculate actual pixel coordinates from your database
//                 // These are just rough examples
//                 left: char === 'waldo' ? '22%' : char === 'odlaw' ? '72%' : '52%',
//                 top: char === 'waldo' ? '32%' : char === 'odlaw' ? '62%' : '12%',
//                 transform: 'translate(-50%, -50%)',
//                 backgroundColor: 'rgba(0, 255, 0, 0.5)',
//                 borderRadius: '50%',
//                 width: '20px',
//                 height: '20px',
//                 border: '1px solid green',
//                 pointerEvents: 'none',
//               }}
//             />
//           )
//         ))}
//       </div>
//       <div className="found-characters">
//         <h3>Characters Found:</h3>
//         <ul>
//           {characterNames.map((char) => (
//             <li key={char}>
//               {char}: {foundCharacters[char.toLowerCase()] ? 'Found' : 'Not Found'}
//             </li>
//           ))}
//         </ul>
//       </div>
//       {allFound && (
//         <div className="game-over">
//           <h2>You found all the characters!</h2>
//           {/* TODO: Display time and prompt for name */}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Game;
