import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch("/api/auth/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("username", data.email);
        console.log("Registration successful");
        navigate("/gameplay");
      } else {
        const result = await response.json().catch(() => null);
        setError(result?.msg || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred. Please try again.");
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </main>
  );
}
