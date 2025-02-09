import React from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/gameplay");
  };
  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
        <br />
        <br />
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <br />
        <br />
        <input type="submit" value="Register" />
      </form>
    </main>
  );
}
