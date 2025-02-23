import React, { useState } from "react";
import "./pages.css";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Retrieve stored username and password from local storage
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    // Check if the input values match the stored values
    if (username === storedUsername && password === storedPassword) {
      console.log("Login successful");
      navigate("/gameplay");
    } else {
      console.log("Login failed");
      setError("Invalid username or password");
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
