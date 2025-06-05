import "./style.css";
import "./core/light-grid-helpers.js";
import { updatePlanetOrbitPosition } from "./core/planets.js";
import { scene, camera, renderer } from "./core/three-setup.js";
import "./core/stars.js";
import {
  isSetToPlanetCameraMode,
  controls,
} from "./controls/camera-controls.js";
import {
  raycasterInit,
  updateRaycastSelectPlanetColor,
} from "./core/raycaster.js";
import { hideLoadingScreen } from "./core/texture-img-loader.js";
import { updatePlanetListTable } from "./core/system-info-menu.js";
import createPlanets from "./planets/planet-obj-factory.js";
import "./controls/icon-listeners.js";
import updatePlanetPreviewScene from "./core/preview-scene.js";
import handlePlanets from "./planets/planet-updates.js";
import { isPaused } from "./controls/pause-controls.js";

let planetsArray;
let sun;

async function initApp() {
  raycasterInit();
  [planetsArray, sun] = await createPlanets();
  updatePlanetListTable(planetsArray);
  setTimeout(() => {
    hideLoadingScreen();
  }, 500);
}

function animate() {
  handlePlanets(planetsArray);
  if (!isPaused) updatePlanetOrbitPosition(planetsArray, sun);
  updateRaycastSelectPlanetColor();
  controls.update();
  isSetToPlanetCameraMode();
  updatePlanetPreviewScene();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

(async () => {
  try {
    await initApp();
    animate();
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
})();

export { planetsArray };
