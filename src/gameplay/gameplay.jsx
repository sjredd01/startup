import React from "react";
import "./gampley.css";

export function Gameplay() {
  return (
    <main>
      <p>This is where the game will be played</p>
      <p>
        When you hit incrament of 50 points it will communicate over websocket
        to everyone on the server/webpage that you have hit that point
      </p>
      <p>It will appear in the top right corner</p>
      <p>Your score and username will saved in the database</p>

      {/* <a href="gameplayPage.png">
        <img
          src="gameplayPage.png"
          alt="gameplayPage"
          style="width: 750px; height: 750px"
        />
      </a>

      <p>
        When you get hit it will call the public API and show this explosion
        emoji
      </p>

      <a href="explosion.jpg">
        <img
          src="explosion.jpg"
          alt="explosion"
          style="width: 500px; height: 500px"
        />
      </a> */}
    </main>
  );
}
