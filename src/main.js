import "./style.css";

import "./core/stars.js";

import {
  ambientLight,
  ambientLight2,
  lightHelper,
  gridHelper,
} from "./core/light-grid-helpers.js";

import "./controls/pause-controls.js";

import {
  raycasterInit,
  updateRaycastSelectPlanetColor,
} from "./core/raycaster.js";

import { updatePlanetOrbitPosition } from "./core/planets.js";

import {
  scene,
  previewScene,
  camera,
  camera2,
  renderer,
  previewRenderer,
} from "./core/three-setup.js";

import {
  isSetToPlanetCameraMode,
  controls,
} from "./controls/camera-controls.js";

import {
  planetImages,
  planetTextures,
  initImgTextureMenu,
  hideLoadingScreen,
} from "./core/texture-img-loader.js";

import {
  planetCountRangeInput,
  updatePlanetListTable,
} from "./core/system-info-menu.js";

import createPlanets from "./planets/planet-obj-factory.js";

import createOrbitCircle from "./planets/orbit-paths.js";

// Init required vars
let planetsArray = [];
let sun;
let planetCount = 0;
let isPaused = false;

//! - LEFT TO REFACTOR
function handlePlanets(planets) {
  // *TODO FUTURE WORK - EDIT THESE FUNCTIONS OUT OF GLOBAL SCOPE
  // Update planet size
  const updatePlanetSize = (index) => {
    console.log(index);
    updatePlanetListTable(planets);
    const size = document.getElementById(`planet-size-${index}`).value;
    console.log(size);
    planets[index].updatePlanetSize(size);
  };
  window.updatePlanetSize = updatePlanetSize;

  // Update planet orbit speed
  const updatePlanetSpeed = (index) => {
    updatePlanetListTable(planets);
    const speed = document.getElementById(`orbit-speed-${index}`).value;
    planets[index].updatePlanetSpeed(speed);
  };
  window.updatePlanetSpeed = updatePlanetSpeed;

  // Update planet spin speed
  const updatePlanetSpinSpeed = (index) => {
    const spin = document.getElementById(`planet-spin-${index}`).value;
    planets[index].updatePlanetSpinSpeed(spin);
  };
  window.updatePlanetSpinSpeed = updatePlanetSpinSpeed;

  // Update planet distance
  const updatePlanetDistance = (index) => {
    const distance = document.getElementById(`planet-distance-${index}`).value;
    scene.remove(planets[index].orbitPath);
    planets[index].updatePlanetDistance(distance);
    scene.add(planets[index].orbitPath);
  };
  window.updatePlanetDistance = updatePlanetDistance;
  // *TODO -------------------------------------------------------*/

  // This handles showing/removing planets from scene
  planetCount = document.getElementById("planet-count").value;
  for (let i = 0; i < planets.length; i++) {
    if (scene.children.includes(planets[i].mesh)) {
      planets[i].inOrbit = false;
      scene.remove(planets[i].mesh);
      scene.remove(planets[i].orbitPath);
    }
    if (i < planetCount) {
      planets[i].inOrbit = true;
      scene.add(planets[i].mesh);
      scene.add(planets[i].orbitPath);
    }
    if (planetCount === 0) {
      console.log("NAE PLANETS");
      planets[0].inOrbit = false;
    }
  }
}

// Pause and play functionality
const setPaused = (value) => {
  isPaused = value;
};

function updatePlanetPreviewScene() {
  previewScene.children = previewScene.children.filter((child) => {
    if (child.isMesh) {
      previewScene.remove(child);
      return false;
    }
    return true;
  });
  let previewPlanet;
  let selectedPlanet = planetsArray.find((p) => p.controlsSelected);
  if (selectedPlanet) {
    // Clone the mesh
    previewPlanet = selectedPlanet.mesh.clone();
  }
  if (previewPlanet) {
    previewPlanet.position.set(0, 0, 0);
    previewPlanet.scale.set(1.2, 1.2, 1.2);
    camera2.lookAt(previewPlanet.position);
    previewScene.add(previewPlanet);
  }
  previewRenderer.render(previewScene, camera2);
}
//!

//! MAIN RUNNING OF APP
async function initApp() {
  raycasterInit();
  initImgTextureMenu(planetImages); // Init texture select menu to "hospitable" planetImages
  [planetsArray, sun] = await createPlanets();
  updatePlanetListTable(planetsArray); // Init system-info table
  console.log("App initialized");
  setTimeout(() => {
    hideLoadingScreen(); // Call this after loading
  }, 1000); // Timeout is for testing atm
}

function animate() {
  handlePlanets(planetsArray); // Handle planet controls
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
    animate(); // start animation loop after init done
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
})();

export { planetsArray };
export { isPaused, setPaused };
// export { scene, previewScene, camera, renderer }; Don't think required anymore
