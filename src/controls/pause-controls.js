import { planetsArray } from "../main.js";

let isPaused = false;
const pausePlay = () => {
  for (let i = 0; i < planetsArray.length; i++) {
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

const setPaused = (value) => {
  isPaused = value;
};

getPauseButton();

export { isPaused };
