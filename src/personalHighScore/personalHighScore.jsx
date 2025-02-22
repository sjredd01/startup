import React, { useEffect, useState } from "react";
import "./form.css";

export function PersonalHighScore() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const savedScores = localStorage.getItem("scores");
    if (savedScores) {
      try {
        const parsedScores = JSON.parse(savedScores);
        console.log("Parsed Scores:", parsedScores); // Debugging log

        // Validate and filter the scores
        const validScores = parsedScores.filter(
          (score) => typeof score === "number"
        );

        // Sort scores in descending order and take the top 10
        const topScores = validScores.sort((a, b) => b - a).slice(0, 10);
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
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
