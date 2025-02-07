import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";

export default function App() {
  return (
    <div className="body bg-dark text-light">
      <header>
        <h1>Defend the Cities</h1>
        <nav>
          <ul>
            <li>
              <a href="register.html">Register</a>
            </li>
            <li>
              <a href="login.html">Login</a>
            </li>
            <li>
              <a href="personalHighScore.html">Personal High Scores</a>
            </li>
            <li>
              <a href="allTimeHighScore.html">All time High Scores</a>
            </li>
            <li>
              <a href="gameplay.html">Defend the Cities</a>
            </li>
          </ul>
        </nav>
      </header>
      <footer>
        <span> Creator Name:</span>
        <a href="https://github.com/sjredd01/startup"> Samuel Redd</a>
      </footer>
    </div>
  );
}
