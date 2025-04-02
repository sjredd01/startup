import React, { useState } from "react";
import "./gampley.css";
import { DefendTheCities } from "./game";

export function Gameplay({ sendScore }) {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Retrieve the player's name from localStorage or use a default value
  const playerName = localStorage.getItem("username") || "Anonymous";

  const handleGameEnd = () => {
    setGameOver(true);
    sendScore(playerName, score); // Use the actual player's name
  };

  const handleScoreUpdate = () => {
    if (!gameOver) {
      setScore((prevScore) => prevScore + 10);
    }
  };

  return (
    <main>
      <DefendTheCities
        onGameEnd={handleGameEnd}
        onScoreUpdate={handleScoreUpdate}
      />
      <div>
        <p>Score: {score}</p>
        {gameOver && <p>Game Over! Your score has been sent.</p>}
      </div>
    </main>
  );
}
