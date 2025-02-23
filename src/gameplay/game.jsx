import React, { useEffect, useRef, useState } from "react";
import "./game.css";

export function DefendTheCities() {
  const [playerPosition, setPlayerPosition] = useState(50);
  const [bullets, setBullets] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [enemies, setEnemies] = useState(generateEnemies());
  const [direction, setDirection] = useState("right");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("Player1");
  const gameAreaRef = useRef(null);

  useEffect(() => {
    const storedPlayerName = localStorage.getItem("username");
    if (storedPlayerName) {
      setPlayerName(storedPlayerName);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "a" || e.key === "ArrowLeft") {
        setPlayerPosition((prev) => Math.max(prev - 5, 0));
      } else if (e.key === "d" || e.key === "ArrowRight") {
        setPlayerPosition((prev) => Math.min(prev + 5, 100));
      } else if (e.key === " " || e.key === "ArrowUp" || e.key === "Enter") {
        setBullets((prev) => [...prev, { left: playerPosition, top: 90 }]);
        const newEnemyBullet = generateEnemyBullets(enemies);
        if (newEnemyBullet) {
          setEnemyBullets((prev) => [...prev, newEnemyBullet]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPosition, enemies]);

  useEffect(() => {
    if (gameOver) {
      const savedScores = JSON.parse(localStorage.getItem("scores")) || [];
      savedScores.push(score);
      localStorage.setItem("scores", JSON.stringify(savedScores));
    }
  }, [gameOver, score]);

  useEffect(() => {
    if (gameOver) {
      const savedPlayerScores =
        JSON.parse(localStorage.getItem("scores")) || [];
      savedPlayerScores.push({ user: playerName, score });
      localStorage.setItem("player-scores", JSON.stringify(savedPlayerScores));
    }
  }, [gameOver, score, playerName]);

  const startNewGame = () => {
    setScore(0);
    setGameOver(false);
    setPlayerPosition(50);
    setBullets([]);
    setEnemyBullets([]);
    setEnemies(generateEnemies());
  };

  const generateEnemyBullets = (enemies) => {
    const randomEnemyIndex = Math.floor(Math.random() * enemies.length);
    const randomEnemy = enemies[randomEnemyIndex];
    if (randomEnemy) {
      return { left: randomEnemy.left, top: randomEnemy.top };
    }
    return null;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prev) =>
        prev
          .map((bullet) => ({ ...bullet, top: bullet.top - 5 }))
          .filter((bullet) => bullet.top > 0)
      );
      setEnemies((prev) => {
        let newDirection = direction;
        const newEnemies = prev.map((enemy) => {
          if (direction === "right") {
            if (enemy.left >= 95) {
              newDirection = "downRight";
            }
            return { ...enemy, left: enemy.left + 1 };
          } else if (direction === "downRight") {
            newDirection = "left";
            return { ...enemy, top: enemy.top + 5 };
          } else if (direction === "left") {
            if (enemy.left <= 5) {
              newDirection = "downLeft";
            }
            return { ...enemy, left: enemy.left - 1 };
          } else if (direction === "downLeft") {
            newDirection = "right";
            return { ...enemy, top: enemy.top + 5 };
          }
          return enemy;
        });

        setDirection(newDirection);
        return newEnemies.filter((enemy) => enemy.top < 100);
      });
      setEnemyBullets((prev) =>
        prev
          .map((bullet) => ({ ...bullet, top: bullet.top + 5 }))
          .filter((bullet) => bullet.top < 100)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [direction]);

  useEffect(() => {
    setEnemies((prevEnemies) => {
      const remainingEnemies = prevEnemies.filter((enemy) => {
        const hit = bullets.some(
          (bullet) =>
            bullet.top <= enemy.top + 5 &&
            bullet.top >= enemy.top &&
            bullet.left >= enemy.left &&
            bullet.left <= enemy.left + 5
        );
        if (hit) {
          console.log("hit");
          setScore((prevScore) => prevScore + 50);
        }
        return !hit;
      });

      if (remainingEnemies.length === 0) {
        return generateEnemies();
      }

      return remainingEnemies;
    });
  }, [bullets]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnemyBullets(
        (prev) =>
          prev
            .map((bullet) => ({ ...bullet, top: bullet.top + 5 })) // Move bullets downwards
            .filter((bullet) => bullet.top < 100) // Remove bullets that move off the screen
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnemyBullets((prev) =>
        prev
          .map((bullet) => ({ ...bullet, top: bullet.top + 5 })) // Move bullets downwards
          .filter((bullet) => {
            if (
              bullet.top >= 90 &&
              bullet.left >= playerPosition - 2 &&
              bullet.left <= playerPosition + 2
            ) {
              setGameOver(true);
              return false;
            }
            return bullet.top < 100; // Remove bullets that move off the screen
          })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [playerPosition]);
  return (
    <div className="game-area" ref={gameAreaRef}>
      {gameOver ? (
        <div className="game-over">
          Game Over
          <div className="final-score">Final Score: {score}</div>
          <button onClick={startNewGame}>Start New Game</button>
        </div>
      ) : (
        <>
          <div className="score">Score: {score}</div>
          <div className="player" style={{ left: `${playerPosition}%` }}></div>
          {bullets.map((bullet, index) => (
            <div
              key={index}
              className="bullet"
              style={{ left: `${bullet.left}%`, top: `${bullet.top}%` }}
            ></div>
          ))}
          {enemyBullets.map((bullet, index) => (
            <div
              key={index}
              className="enemy-bullet"
              style={{ left: `${bullet.left}%`, top: `${bullet.top}%` }}
            ></div>
          ))}
          {enemies.map((enemy, index) => (
            <div
              key={index}
              className="enemy"
              style={{ left: `${enemy.left}%`, top: `${enemy.top}%` }}
            ></div>
          ))}
        </>
      )}
    </div>
  );

  function generateEnemies() {
    const enemies = [];
    const rows = 3;
    const cols = 7;
    const spacing = 10; // spacing between enemies

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        enemies.push({ left: col * spacing, top: row * spacing });
      }
    }
    return enemies;
  }
}
