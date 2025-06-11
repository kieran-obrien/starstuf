import { planetsArray } from "../main";
import planetMaterials from "../planets/planet-material-factory";
import updateTextureControls from "./texture-selector-controls";
import { updateSystemTable } from "../system-menu/system-table";

let currentControlPlanet;

function updatePlanetControlsHTML(i, planetsArray) {
  return `<label for="planet-size">Mass</label>
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
                min="${planetsArray[i].minmaxdist[0] / 10}"
                max="${planetsArray[i].minmaxdist[1] / 10}"
                step="0.1"
                value="${planetsArray[i].distance / 10}"
            />`;
}

function showControls(planet, i) {
  currentControlPlanet = planet;
  updateTextureControls(planet.textureCode, planet);
  const header = document.getElementById("offcanvas-title");
  header.innerHTML = `${planet.name}`;
  const offcanvasElement = document.getElementById("offcanvas-planet-menu");
  const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
  const offCanvasBody = document.getElementById("offcanvas-body");
  if (offCanvasBody.lastElementChild.nodeName === "FORM") {
    offCanvasBody.removeChild(offCanvasBody.lastElementChild);
  }
  const planetControlsHTML = updatePlanetControlsHTML(i, planetsArray);
  const form = document.createElement("form");
  form.innerHTML = planetControlsHTML;
  offCanvasBody.appendChild(form);
  const planetNameInput = document.getElementById("planet-name-input");
  planetNameInput.value = "";
  planetNameInput.placeholder = planet.name;
  planetNameInput.addEventListener("input", () => {
    currentControlPlanet.name = planetNameInput.value;
    updateSystemTable();
  });
  bsOffcanvas.show();
}

const updatePlanetTexture = (index) => {
  const p = planetsArray.find((planet) => planet.controlsSelected);
  p.mesh.material = planetMaterials[index];
  p.textureCode = index + 1;
  planetMaterials[index].map.needsUpdate = true;
  console.log(`Updated planet texture: ${p.textureCode}`);
};

const hideControls = () => {
  console.log("Attempting to hide offcanvas");
  const offcanvasElement = document.getElementById("offcanvas-planet-menu");
  const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
  if (offcanvasElement) {
    bsOffcanvas.hide();
  }
};

export {
  updatePlanetControlsHTML,
  updatePlanetTexture,
  showControls,
  hideControls,
  currentControlPlanet,
};
