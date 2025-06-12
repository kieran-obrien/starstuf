import { planetsArray } from "../main";
import focusCameraOnPlanet from "./planet-camera-focus";
import openPlanetSettings from "./planet-settings-open";

const planetCountRangeInput = document.getElementById("planet-count");
planetCountRangeInput.addEventListener("change", () => {
  updateSystemTable(planetsArray);
});

const addCameraButtonListeners = () => {
  for (let i = 1; i < planetsArray.length + 1; i++) {
    let planetListTableRow = document.getElementById(
      `planets-list-table-r${i}`
    );
    if (!planetListTableRow) {
      console.warn("Couldn't find #planets-list-table-r1 in the DOM");
      return;
    }
    planetListTableRow.children[2].children[0].addEventListener(
      "click",
      focusCameraOnPlanet
    );
  }
};

const addSettingsButtonListeners = () => {
  for (let i = 1; i < planetsArray.length + 1; i++) {
    let planetListTableRow = document.getElementById(
      `planets-list-table-r${i}`
    );
    if (!planetListTableRow) {
      console.warn("Couldn't find #planets-list-table-r1 in the DOM");
      return;
    }
    planetListTableRow.children[3].children[0].addEventListener(
      "click",
      openPlanetSettings
    );
  }
};

const updateSystemTable = () => {
  for (let i = 1; i < planetsArray.length + 1; i++) {
    let planetListTableRow = document.getElementById(
      `planets-list-table-r${i}`
    );
    if (!planetListTableRow) {
      console.warn("Couldn't find #planets-list-table-r1 in the DOM");
      return;
    }
    planetListTableRow.children[0].textContent = planetsArray[i - 1].name;
    const isInOrbitClass = planetsArray[i - 1].inOrbit
      ? "ri-checkbox-circle-fill icon system-icon text-success"
      : "ri-close-circle-fill icon system-icon text-danger";
    planetListTableRow.children[1].children[0].className = isInOrbitClass;
    const cameraFocusIconClass = planetsArray[i - 1].cameraFollow
      ? "ri-video-on-fill icon system-icon text-primary"
      : "ri-video-off-fill icon system-icon";
    planetListTableRow.children[2].children[0].className = cameraFocusIconClass;
  }
};

const addSystemMenuListeners = () => {
  addCameraButtonListeners();
  addSettingsButtonListeners();
};

export { updateSystemTable, addSystemMenuListeners };
