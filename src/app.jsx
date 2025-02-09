import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { Register } from "./register/register";
import { Login } from "./login/login";
import { PersonalHighScore } from "./personalHighScore/personalHighScore";
import { AllTimeHighScore } from "./allTimeHighScore/allTimeHighScore";
import { Gameplay } from "./gameplay/gameplay";
import { Home } from "./home/home";

export default function App() {
  const [randomName, setRandomName] = useState("");
  const [randomScore, setRandomScore] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomName(getRandomName());
      setRandomScore(getRandomScore());
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 2000); // 2 seconds
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <BrowserRouter>
      <div>
        <header>
          <h1>Defend the Cities</h1>
          <nav>
            <ul>
              <li>
                <NavLink className="nav-link" to="register">
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink className="nav-link" to="login">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink className="nav-link" to="personalHighScore">
                  Personal High Scores
                </NavLink>
              </li>
              <li>
                <NavLink className="nav-link" to="allTimeHighScore">
                  All time High Scores
                </NavLink>
              </li>
              <li>
                <NavLink className="nav-link" to="gameplay">
                  Defend the Cities
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        {visible && (
          <div className="random-score">
            <p>Player: {randomName}</p>
            <p>New High Score: {randomScore}</p>
          </div>
        )}

        <Routes>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="personalHighScore" element={<PersonalHighScore />} />
          <Route path="allTimeHighScore" element={<AllTimeHighScore />} />
          <Route path="gameplay" element={<Gameplay />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <footer>
          <span> Creator Name:</span>
          <a href="https://github.com/sjredd01/startup"> Samuel Redd</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className="container-fluid bg-secondary text-center">
      404: Return to sender. Address unknown.
    </main>
  );
}

function getRandomName() {
  const names = ["Alice", "Bob", "Charlie", "David", "Eve"];
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomScore() {
  return Math.floor(Math.random() * 1000);
}
