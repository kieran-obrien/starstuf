import { planetsArray, isPaused, setPaused } from "../main.js";

const pausePlay = () => {
    for (let i = 0; i < planetsArray.length; i++) {
        // Update the last update time for each planet
        planetsArray[i].lastUpdateTime = Date.now();
    }
    setPaused(!isPaused);
    if (isPaused) {
        pauseButton.className = "bi bi-play-btn-fill";
    } else {
        pauseButton.className = "bi bi-pause-btn-fill";
    }
};

let pauseButton;

const getPauseButton = () => {
    pauseButton = document.getElementById("pause-button");
    pauseButton.addEventListener("click", pausePlay);

    pauseButton.addEventListener("mouseover", () => {
        pauseButton.style.color = "#808080";
    });
    pauseButton.addEventListener("mouseout", () => {
        pauseButton.style.color = "#ffffff";
    });
    pauseButton.addEventListener("mousedown", () => {
        pauseButton.style.color = "#444444";
    });
    pauseButton.addEventListener("mouseup", () => {
        pauseButton.style.color = "#808080";
    });
};

export { pausePlay, getPauseButton };
