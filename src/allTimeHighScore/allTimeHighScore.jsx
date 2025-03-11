import React, { useEffect, useState } from "react";
import "./form.css";

export function AllTimeHighScore() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const savedPlayerScores = fetch("/api/alltimescores")
      .then((response) => response.json())
      .then((data) => {
        setScores(data);
      })
      .catch((error) => {
        console.error("Error fetching all time scores:", error);
      });

    //const savedPlayerScores = localStorage.getItem("player-scores");
    if (savedPlayerScores) {
      try {
        const parsedScores = JSON.parse(savedPlayerScores);
        console.log("Parsed Scores:", parsedScores); // Debugging log

        // Filter out invalid entries
        const validScores = parsedScores.filter(
          (score) =>
            typeof score.user === "string" && typeof score.score === "number"
        );

        const topScores = validScores
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // Sort and slice scores from index 14 to 24
        setScores(topScores);
      } catch (error) {
        console.error("Error parsing JSON from local storage:", error);
      }
    }
  }, []);

  return (
    <main>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.user}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
