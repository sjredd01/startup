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
  const [players, setPlayers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const backendUrl =
      process.env.NODE_ENV === "production"
        ? "wss://startup.sjredd01.click" // Replace with your production WebSocket URL
        : "ws://localhost:4000"; // Development WebSocket URL

    const socket = new WebSocket(backendUrl);
    setWs(socket);

    socket.onmessage = async (event) => {
      // Check if the message is a Blob
      if (event.data instanceof Blob) {
        const text = await event.data.text(); // Convert Blob to text
        const data = JSON.parse(text); // Parse the JSON string
        setPlayers((prevPlayers) => [...prevPlayers, data]);
        setVisible(true);

        setTimeout(() => {
          setVisible(false);
        }, 2000); // 2 seconds
      } else {
        // Handle non-Blob messages (if any)
        const data = JSON.parse(event.data);
        setPlayers((prevPlayers) => [...prevPlayers, data]);
        setVisible(true);

        setTimeout(() => {
          setVisible(false);
        }, 2000); // 2 seconds
      }
    };

    return () => socket.close();
  }, []);

  const sendScore = (name, score) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // Send the message as a string
      ws.send(JSON.stringify({ name, score }));
    }
  };

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
        {visible && players.length > 0 && (
          <div className="random-score">
            {players.map((player, index) => (
              <div key={index}>
                <p>Player: {player.name}</p>
                <p>New High Score: {player.score}</p>
              </div>
            ))}
          </div>
        )}

        <Routes>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="personalHighScore" element={<PersonalHighScore />} />
          <Route path="allTimeHighScore" element={<AllTimeHighScore />} />
          <Route path="gameplay" element={<Gameplay sendScore={sendScore} />} />
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
