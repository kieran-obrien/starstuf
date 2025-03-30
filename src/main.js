import "./style.css";
import * as THREE from "three";
import { stars } from "./stars.js";
import lightingSetup from "./lighting-setup.js";
import { getPauseButton } from "./controls/pause-controls.js";
import { raycasterInit, updateRaycastSelectPlanetColor } from "./raycaster.js";
import {
  initCameraControls,
  isSetToPlanetCameraMode,
} from "./controls/camera-controls.js";
import { updatePlanetOrbitPosition } from "./planets.js";
import { initThreeJsAssets } from "./three-setup.js";
//import planetControlsHTML from "./planet-controls-html.js"

// The two main classes for Helio
import TextureObj from "./classes/TextureObj.js";
import Planet from "./classes/Planet.js";

//? Add bootstrap tootips in future?

let readyToStart = false; //? Is this how we implement a loading screen too?

// Init threejs assets
const [
  scene,
  previewScene,
  camera,
  camera2,
  renderer,
  previewRenderer,
  imgLoader,
  textureLoader,
] = initThreeJsAssets();

// Init camera controls
const controls = initCameraControls();

// Init lighting and helpers
const [ambientLight, ambientLight2, lightHelper, gridHelper] = lightingSetup(
  scene,
  previewScene
);

// Setting intial geometry and material for the sun and planets
const geometrySun = new THREE.SphereGeometry(10, 32, 32);
const geometryPlanet = new THREE.SphereGeometry(4, 15, 15);

// Load the planet textures
let textureCounter = 1;
const planetTextures = [];

let planetsArray = [];
let planetMaterials = [];
let sun;

const imgs = [];

let sunMaterial;
// Load the textures/imgs
let imgsLoaded = false;
const loadThreeJsTextures = (counter) => {
  const texturePath = `./textures/${counter}.png`;

  textureLoader.load(
    texturePath,
    (texture) => {
      // On successful load
      loadTextureImages(texturePath); // Images for selection menu
      const pathNum = texturePath.split("/")[2].split(".")[0];
      const textureObj = new TextureObj(pathNum); // Obj for selection menu
      planetTextures.push([texture, textureObj]);
      loadThreeJsTextures(counter + 1); // Load the next texture
    },
    undefined, // On progress, not needed
    (err) => {
      // On error (e.g., texture not found, no more to load)
      // Sun texture/material init here, to expand in future
      const sunTexture = textureLoader.load("./sun.jpg");
      sunMaterial = new THREE.MeshPhongMaterial({ map: sunTexture });
      imgsLoaded = true; // Flag to start planet init etc.
    }
  );
};

const loadTextureImages = (path) => {
  imgLoader.load(
    path,
    (image) => {
      // On successful load
      imgs.push(image);
    },
    undefined, // On progress, not needed
    (err) => {
      // On error (e.g., img not found, no more to load)
      console.log("Finished loading images");
    }
  );
};

// Start loading textures
loadThreeJsTextures(textureCounter);

const checkImgsAndTexturesLoaded = setInterval(() => {
  // Need to be finished loading before planet init
  if (imgsLoaded) {
    initImgTextureMenu(); // Init texture select menu to "hospitable" imgs
    [planetsArray, planetMaterials, sun] = createPlanets(); // Create planets after loading all textures
    clearInterval(checkImgsAndTexturesLoaded);
    imgsLoaded = false; // Done with flag
  }
}, 100);

// Create and populate array of ten planet objects
// Also create array of planet materials

function getPlanet() {
  let planetMaterialInit = new THREE.MeshPhongMaterial({
    map: planetTextures[4][0],
  });
  return new Planet(
    1,
    0.000125,
    new THREE.Mesh(geometryPlanet, planetMaterialInit)
  );
}

function createPlanets() {
  let materialCounter = 0;
  planetMaterials = Array(planetTextures.length)
    .fill()
    .map(() => {
      //console.log(planetTextures[materialCounter][0]);
      let material = new THREE.MeshPhongMaterial({
        map: planetTextures[materialCounter][0],
      });
      materialCounter++;
      return material;
    });
  const planetsArray = Array(10).fill().map(getPlanet);
  let distanceFromLast = 180;
  for (let i = 1; i < planetsArray.length + 1; i++) {
    planetsArray[i - 1].mesh.name = `Planet ${i}`;
    planetsArray[i - 1].name = `Planet ${i}`;
    planetsArray[i - 1].distance = distanceFromLast;
    distanceFromLast += 180;
    planetsArray[i - 1].minmaxdist = [
      distanceFromLast - 270,
      distanceFromLast - 90,
    ];
    planetsArray[i - 1].index = i;
    console.log(planetsArray[i - 1].distance);
  }
  console.log(planetMaterials[3]);
  const sun = new THREE.Mesh(geometrySun, sunMaterial);
  console.log(sun, "HELLO");

  // Add the initial sun
  scene.add(sun);
  sun.position.set(0, 0, 0);

  readyToStart = true;
  console.log("Planets created");
  console.log(planetsArray);
  return [planetsArray, planetMaterials, sun];
}

// Add planet functionality
let planetCount = 0;
function handlePlanets(planets) {
  // *TODO FUTURE WORK - EDIT THESE FUNCTIONS OUT OF GLOBAL SCOPE
  // Update planet size
  const updatePlanetSize = (index) => {
    console.log(index);
    const size = document.getElementById(`planet-size-${index}`).value;
    console.log(size);
    planets[index].updatePlanetSize(size);
  };
  window.updatePlanetSize = updatePlanetSize;

  // Update planet orbit speed
  const updatePlanetSpeed = (index) => {
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
  let planetCountCheck = planetCount;
  planetCount = document.getElementById("planet-count").value;
  // Add the planets
  for (let i = 0; i < planets.length; i++) {
    if (scene.children.includes(planets[i].mesh)) {
      planets[i].inOrbit = false;
      scene.remove(planets[i].mesh);
    }
    if (i < planetCount) {
      planets[i].inOrbit = true;
      scene.add(planets[i].mesh);
    }
  }
}

// Update planet texture
const updatePlanetTexture = (index) => {
  const p = planetsArray.find((planet) => planet.controlsSelected);
  p.mesh.material = planetMaterials[index];
  p.textureCode = index + 1;
  planetMaterials[index].map.needsUpdate = true;
  console.log(`Updated planet texture: ${p.textureCode}`);
};

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
let isPaused = false;
const setPaused = (value) => {
  isPaused = value;
};
getPauseButton();

// Camera Focus Functionality
let isCameraHelio = true;
const setIsCameraHelio = (value) => {
  isCameraHelio = value;
};

function setToHelioCameraMode() {
  isCameraHelio = true;
  camera.position.set(0, 0, 50);
  camera.lookAt(0, 0, 0);
}
const helioButton = document.getElementById("helio-button");
helioButton.addEventListener("click", setToHelioCameraMode);

raycasterInit();

/*Main function to animate each frame
 Called recursively so constantly invoking any function called in a frame
*/
function animate() {
  // arrow(); // Arrow orbit effect
  handlePlanets(planetsArray); // Handle planet controls
  if (!isPaused) updatePlanetOrbitPosition(planetsArray);
  sun.rotation.y += 0.0005;
  updateRaycastSelectPlanetColor();
  controls.update();
  isSetToPlanetCameraMode();
  requestAnimationFrame(animate);
  updatePlanetPreviewScene();
  renderer.render(scene, camera);
}

const checkReadyToStart = setInterval(() => {
  if (readyToStart) {
    animate();
    clearInterval(checkReadyToStart);
  }
}, 100);

let currentControlPlanet;

function showControls(planet, i) {
  currentControlPlanet = planet;
  console.log(currentControlPlanet);
  updateTextureControls(planet.textureCode);
  const header = document.getElementById("offcanvasTitle");
  header.innerHTML = `${planet.name}`;
  const offcanvasElement = document.getElementById("offcanvasExample");
  const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
  const offCanvasBody = document.getElementById("offcanvas-body");
  if (offCanvasBody.lastElementChild.nodeName === "FORM") {
    offCanvasBody.removeChild(offCanvasBody.lastElementChild);
  }
  const planetControlsHTML = `<label for="planet-size">Mass</label>
            <input oninput="updatePlanetSize(${i})"
                type="range"
                class = "form-range"
                id="planet-size-${i}"
                name="planet-size"
                min=".5"
                max="4"
                step="0.1"
                value="${planetsArray[i].size}"
            />
            <label for="orbit-speed">Orbit Speed</label>
            <input oninput="updatePlanetSpeed(${i})"
                type="range"
                class = "form-range"
                id="orbit-speed-${i}"
                name="orbit-speed"
                min="1"
                max="10"
                step="0.1"
                value="${planetsArray[i].speed * 8000}"
            />
            <label for="planet-spin">Spin Speed</label>
            <input oninput="updatePlanetSpinSpeed(${i})"
                type="range"
                class = "form-range"
                id="planet-spin-${i}"
                name="planet-spin"
                min="1"
                max="12"
                step="0.1"
                value="${planetsArray[i].spinSpeed * 800}"
            />
            <label for="planet-distance">Distance</label>
            <input oninput="updatePlanetDistance(${i})"
                type="range"
                class = "form-range"
                id="planet-distance-${i}"
                name="planet-distance"
                min="${planet.minmaxdist[0] / 10}"
                max="${planet.minmaxdist[1] / 10}"
                step="0.1"
                value="${planetsArray[i].distance / 10}"
            />`;
  const form = document.createElement("form");
  form.innerHTML = planetControlsHTML;
  offCanvasBody.appendChild(form);
  const planetNameInput = document.getElementById("planet-name-input");
  planetNameInput.value = "";
  planetNameInput.placeholder = planet.name;
  bsOffcanvas.show();
}

const updatePlanetPreviewScene = () => {
  //! Lets try to minimise the amount of work done here
  //! We only want to update the preview scene when a new planet is raySelected
  // Remove only the planets from the previewScene
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
    previewPlanet = selectedPlanet.mesh.clone();
  }
  if (previewPlanet) {
    previewPlanet.position.set(0, 0, 0);
    previewPlanet.scale.set(1.2, 1.2, 1.2);
    camera2.lookAt(previewPlanet.position);
    previewScene.add(previewPlanet);
  }
  previewRenderer.render(previewScene, camera2);
};

// Planet control texture menu functionality
let textureOptions = document.querySelectorAll(".texture-option");
textureOptions = Array.from(textureOptions).map((option) =>
  option.querySelector("button")
);

// Init texture menu with initial "hospitable" value
const initImgTextureMenu = () => {
  const textureOptions = document.querySelectorAll(".texture-img");
  for (let i = 0; i < textureOptions.length; i++) {
    if (textureOptions[i].hasChildNodes()) {
      textureOptions[i].removeChild(textureOptions[i].firstChild);
    }
    const img = document.createElement("img");
    textureOptions[i].appendChild(img);
    img.src = imgs[i + 4].src;
  }
};

const setTextureGrid = (event) => {
  const selectedTexture = event.target.innerText;
  const textureGrid = document.querySelector(".row.row-cols-2.row.g-2");
  textureGrid.id = selectedTexture.toLowerCase(); // Set the id to the raySelected texture
  console.log(textureGrid.id);
  updateTextureControls();
};

for (let group of textureOptions) {
  group.addEventListener("click", setTextureGrid);
}

const updateTextureControls = (textureCode) => {
  const textureGrid = document.querySelector(".row.row-cols-2.row.g-2");
  const textureOptions = document.querySelectorAll(".texture-img");
  // Update texture menu to reflect current texture of raySelected planet, upon selection
  if (textureCode) {
    if (textureCode >= 1 && textureCode <= 4) {
      textureGrid.id = "gaseous";
    } else if (textureCode >= 5 && textureCode <= 8) {
      textureGrid.id = "hospitable";
    } else if (textureCode >= 9 && textureCode <= 12) {
      textureGrid.id = "inhospitable";
    } else if (textureCode >= 13 && textureCode <= 16) {
      textureGrid.id = "terrestrial";
    }
  }
  // Update the texture options based on the raySelected texture grid
  switch (textureGrid.id) {
    case "gaseous":
      for (let i = 0; i < textureOptions.length; i++) {
        if (textureOptions[i].hasChildNodes()) {
          textureOptions[i].removeChild(textureOptions[i].firstChild);
        }

        const img = document.createElement("img");
        textureOptions[i].appendChild(img);
        img.src = imgs[i].src;
      }
      break;
    case "hospitable":
      for (let i = 0; i < textureOptions.length; i++) {
        if (textureOptions[i].hasChildNodes()) {
          textureOptions[i].removeChild(textureOptions[i].firstChild);
        }

        const img = document.createElement("img");
        textureOptions[i].appendChild(img);
        img.src = imgs[i + 4].src;
      }
      break;
    case "inhospitable":
      for (let i = 0; i < textureOptions.length; i++) {
        if (textureOptions[i].hasChildNodes()) {
          textureOptions[i].removeChild(textureOptions[i].firstChild);
        }

        const img = document.createElement("img");
        textureOptions[i].appendChild(img);
        img.src = imgs[i + 8].src;
      }
      break;
    case "terrestrial":
      for (let i = 0; i < textureOptions.length; i++) {
        if (textureOptions[i].hasChildNodes()) {
          textureOptions[i].removeChild(textureOptions[i].firstChild);
        }

        const img = document.createElement("img");
        textureOptions[i].appendChild(img);
        img.src = imgs[i + 12].src;
      }
      break;
    default:
      break;
  }
};

// Selecting texture for planet
const textureImgOptions = document.querySelectorAll(".texture-img-select");
console.log(textureImgOptions);
textureImgOptions.forEach((option) => {
  option.addEventListener("mouseover", () => {
    option.style.backgroundColor = "#303030";
  });
  option.addEventListener("mouseout", () => {
    option.style.backgroundColor =
      "RGBA(var(--bs-dark-rgb), var(--bs-bg-opacity, 1))";
  });
  option.addEventListener("mousedown", () => {
    option.style.backgroundColor = "#1e1e1e";
    let imgIndex = option.firstElementChild.src.split("/").pop().split(".")[0];
    console.log(imgIndex);
    updatePlanetTexture(imgIndex - 1);
  });
  option.addEventListener("mouseup", () => {
    option.style.backgroundColor = "#303030";
  });
});

const nameInput = document.getElementById("planet-name-input");
nameInput.addEventListener("input", () => {
  const offCanvasTitle = document.getElementById("offcanvasTitle");
  if (nameInput.value === "") {
    offCanvasTitle.innerHTML = `Planet ${currentControlPlanet.index}`;
    return;
  }
  currentControlPlanet.name = nameInput.value;
  offCanvasTitle.innerHTML = currentControlPlanet.name;
});

export { planetsArray };
export { isPaused, setPaused };
export { scene, previewScene, camera, renderer, showControls };
export { isCameraHelio, setIsCameraHelio };
