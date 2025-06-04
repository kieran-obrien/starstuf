import "./style.css";

import * as THREE from "three";

import { stars } from "./core/stars.js";

import {
  ambientLight,
  ambientLight2,
  lightHelper,
  gridHelper,
} from "./core/light-grid-helpers.js";

import { getPauseButton, getIcons } from "./controls/pause-controls.js";

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

// Init required vars
let planetsArray = [];
let sun;
let planetCount = 0;
let isPaused = false;
let isCameraHelio = true;

// Add planet functionality
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
    planets[index].updatePlanetDistance(distance);
  };
  window.updatePlanetDistance = updatePlanetDistance;
  // *TODO -------------------------------------------------------*/

  // Add planet control forms
  planetCount = document.getElementById("planet-count").value;
  // Add the planets
  for (let i = 0; i < planets.length; i++) {
    if (scene.children.includes(planets[i].mesh)) {
      planets[i].inOrbit = false;
      scene.remove(planets[i].mesh);
    }
    //console.log(i, planetCount);
    //console.log(planets[0].inOrbit);
    if (i < planetCount) {
      planets[i].inOrbit = true;
      scene.add(planets[i].mesh);
    }
    if (planetCount === 0) {
      console.log("NAE PLANETS");
      planets[0].inOrbit = false;
    }
  }
}

// Arrow orbit effect
const arrow = () => {
  const dir = planetsArray[0].mesh.position.clone();
  dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
  //normalize the direction vector (convert to vector of length 1)
  dir.normalize();

  const origin = planetsArray[0].mesh.position.clone();
  const length = 2;
  const hex = 0xffff00;
  const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex, 0, 0);
  scene.add(arrowHelper);
  setTimeout(() => scene.remove(arrowHelper), 20000);
};

// Generate stars for background scene
stars(scene, camera);

// Pause and play functionality
const setPaused = (value) => {
  isPaused = value;
};
getPauseButton();
getIcons();

// Camera Focus Functionality
const setIsCameraHelio = (value) => {
  isCameraHelio = value;
};

function setToHelioCameraMode() {
  isCameraHelio = true;
  camera.position.set(0, 0, 150);
  camera.lookAt(0, 0, 0);
}
const helioButton = document.getElementById("helio-button");
helioButton.addEventListener("click", setToHelioCameraMode);

//! MAIN RUNNING OF APP
function animate() {
  //arrow(); // Arrow orbit effect
  handlePlanets(planetsArray); // Handle planet controls
  //updatePlanetListTable(planetsArray);
  if (!isPaused) updatePlanetOrbitPosition(planetsArray, sun);
  updateRaycastSelectPlanetColor();
  controls.update();
  isSetToPlanetCameraMode();
  updatePlanetPreviewScene();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

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
export { scene, previewScene, camera, renderer };
export { isCameraHelio, setIsCameraHelio };
