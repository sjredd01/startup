import React from "react";
import "./form.css";

export function PersonalHighScore() {
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
          <tr>
            <td>1</td>
            <td>1000</td>
          </tr>
          <tr>
            <td>2</td>
            <td>300</td>
          </tr>
          <tr>
            <td>3</td>
            <td>100</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
