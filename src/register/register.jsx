import React from "react";
import "./register.css";

export function Register() {
  return (
    <main>
      <form action="register.php" method="post">
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
