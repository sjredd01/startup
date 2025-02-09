import React from "react";
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
