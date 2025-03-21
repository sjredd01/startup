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
  const [quote, setQuote] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const gameAreaRef = useRef(null);

  useEffect(() => {
    const storedPlayerName = localStorage.getItem("username");
    if (storedPlayerName) {
      setPlayerName(storedPlayerName);
      setIsAuthenticated(true);
    } else {
      checkAuthStatus();
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are included in the request
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setPlayerName(data.email);
        localStorage.setItem("username", data.email);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "DELETE",
      });

      if (response.ok) {
        setIsAuthenticated(false);
        localStorage.removeItem("username");
        setPlayerName("Player1");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
      const saveScore = async () => {
        try {
          const response = await fetch("/api/score", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: playerName, score }),
          });

          if (!response.ok) {
            throw new Error("Failed to save score");
          }
        } catch (error) {
          console.error("Error saving score:", error);
        }
      };

      const saveAllTimeScore = async () => {
        try {
          const response = await fetch("/api/alltimescore", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: playerName, score }),
          });

          if (!response.ok) {
            throw new Error("Failed to save all-time score");
          }
        } catch (error) {
          console.error("Error saving all-time score:", error);
        }
      };

      saveScore();
      saveAllTimeScore();

      // Fetch a quote when the game is over
      fetch("https://quote.cs260.click")
        .then((response) => response.json())
        .then((data) => {
          setQuote(data.quote);
          setQuoteAuthor(data.author);
        })
        .catch((error) => {
          console.error("Error fetching quote:", error);
        });
    }
  }, [gameOver, score, playerName]);

  const startNewGame = () => {
    setScore(0);
    setGameOver(false);
    setPlayerPosition(50);
    setBullets([]);
    setEnemyBullets([]);
    setEnemies(generateEnemies());
    setQuote("");
    setQuoteAuthor("");
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
      {isAuthenticated ? (
        <>
          <div className="auth-status">Logged in as {playerName}</div>
          {gameOver ? (
            <div className="game-over">
              Game Over
              <div className="final-score">Final Score: {score}</div>
              <div className="quote">
                "{quote}" - {quoteAuthor}
              </div>
              <button onClick={startNewGame}>Start New Game</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <div className="score">Score: {score}</div>
              <div
                className="player"
                style={{ left: `${playerPosition}%` }}
              ></div>
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
        </>
      ) : (
        <div className="auth-status">Please log in to play the game.</div>
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
