import React, { useEffect, useState } from "react";
import "./form.css";

export function PersonalHighScore() {
  const [scores, setScores] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("username");
    setUserEmail(email);

    fetch("/api/alltimescores")
      .then((response) => response.json())
      .then((data) => {
        // Filter scores to only include those from the logged-in user
        const userScores = data.filter(
          (score) => score.user === email && typeof score.score === "number"
        );

        // Sort scores in descending order and take the top 10
        const topScores = userScores
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        setScores(topScores);
      })
      .catch((error) => {
        console.error("Error fetching personal scores:", error);
      });
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
          {scores.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
