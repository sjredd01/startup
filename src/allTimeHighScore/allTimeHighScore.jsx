import React, { useEffect, useState } from "react";
import "./form.css";

export function AllTimeHighScore() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetch("/api/alltimescores")
      .then((response) => response.json())
      .then((data) => {
        // Filter out invalid entries
        const validScores = data.filter(
          (score) =>
            typeof score.user === "string" && typeof score.score === "number"
        );

        // Sort and slice scores to get the top 10
        const topScores = validScores
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        setScores(topScores);
      })
      .catch((error) => {
        console.error("Error fetching all time scores:", error);
      });
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
