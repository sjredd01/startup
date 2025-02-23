import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Form submitted");

    // Basic validation
    if (password.length < 6) {
      console.log("Password validation failed");
      return;
    }

    // Log success
    console.log("Navigating to gameplay");
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    // Simulate navigation
    navigate("/gameplay"); // This is where we navigate
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
          autoComplete="username"
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <br />
        <button type="submit">Register</button>
      </form>
    </main>
  );
}
