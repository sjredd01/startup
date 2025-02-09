import React from "react";
import "./pages.css";

export function Login() {
  return (
    <main>
      <form action="/login" method="post">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
        <br />
        <br />
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <br />
        <br />
        <input type="submit" value="Login" />
      </form>
    </main>
  );
}
