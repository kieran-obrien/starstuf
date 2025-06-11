import "./style.css";
import "./core/light-setup.js";
import {
  updatePlanetDistanceWhilePaused,
  updatePlanetOrbitPosition,
  updatePlanetStats,
  updatePlanetsInScene,
} from "./planets/planet-updates.js";
import { scene, camera, renderer } from "./core/three-setup.js";
import "./core/stars.js";
import {
  isSetToPlanetCameraMode,
  controls,
} from "./controls-ui/camera-controls.js";
import {
  raycasterInit,
  updateRaycastSelectPlanetColor,
} from "./core/raycaster.js";
import { hideLoadingScreen } from "./core/texture-img-loader.js";
import {
  addSystemMenuListeners,
  updateSystemTable,
} from "./system-menu/system-table.js";
import createPlanets from "./planets/planet-obj-factory.js";
import "./controls-ui/icon-listeners.js";
import updatePlanetPreviewScene from "./planet-menu/preview-scene.js";
import { isPaused } from "./controls-ui/pause-controls.js";

let planetsArray;
let sun;

async function initApp() {
  raycasterInit();
  [planetsArray, sun] = await createPlanets();
  updateSystemTable(planetsArray);
  addSystemMenuListeners();
  setTimeout(() => {
    hideLoadingScreen();
  }, 500);
}

function animate() {
  updatePlanetStats(planetsArray);
  if (!isPaused) updatePlanetOrbitPosition(planetsArray, sun);
  else updatePlanetDistanceWhilePaused(planetsArray);
  updatePlanetsInScene(planetsArray);
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
