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

      <img src="gameplayPage.png"></img>

      <p>
        When you get hit it will call the public API and show this explosion
        emoji
      </p>

      <img src="explosion.jpg"></img>
    </main>
  );
}
