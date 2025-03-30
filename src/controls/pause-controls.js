import { planetsArray, isPaused, setPaused } from "../main.js";

const pausePlay = () => {
  for (let i = 0; i < planetsArray.length; i++) {
    // Update the last update time for each planet
    planetsArray[i].lastUpdateTime = Date.now();
  }
  setPaused(!isPaused);
  if (isPaused) {
    pauseButton.className = "ri-play-large-line icon";
  } else {
    pauseButton.className = "ri-pause-large-line icon";
  }
};

let pauseButton;

const getPauseButton = () => {
  pauseButton = document.getElementById("pause-button");
  pauseButton.addEventListener("click", pausePlay);
};

// TODO RENAME FILE TO REFLECT ICONS INVOLVED NOW?
const getIcons = () => {
  const icons = document.querySelectorAll(".icon");
  icons.forEach((icon) => {
    icon.addEventListener("mouseover", () => {
      icon.style.color = "#808080";
    });
    icon.addEventListener("mouseout", () => {
      icon.style.color = "#ffffff";
    });
    icon.addEventListener("mousedown", () => {
      icon.style.color = "#444444";
    });
    icon.addEventListener("mouseup", () => {
      icon.style.color = "#808080";
    });
  });
};

export { pausePlay, getPauseButton, getIcons };
