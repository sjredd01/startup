import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");

    if (password.length < 6) {
      console.log("Password validation failed");
      return;
    }

    console.log("Navigating to gameplay");

    // Temporary check: Remove localStorage for debugging
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    navigate("/gameplay"); // Ensure this is correct and the route exists
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
        <button type="submit">Register</button>
      </form>
    </main>
  );
}
