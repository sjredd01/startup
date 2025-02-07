import React from "react";
import "./form.css";

export function AllTimeHighScore() {
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
          <tr>
            <td>1</td>
            <td>Player1</td>
            <td>1000</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Player2</td>
            <td>900</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Player3</td>
            <td>800</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
