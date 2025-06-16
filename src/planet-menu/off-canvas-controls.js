import { planetsArray } from "../main";
import planetMaterials from "../planets/planet-material-factory";
import updateTextureControls from "./texture-selector-controls";
import { updateSystemTable } from "../system-menu/system-table";
import adjustOffcanvasPosition from "../controls-ui/adjust-offcanvas-position";
import { addPlanetMenuStatListeners } from "../planets/planet-updates";

let currentControlPlanet;

function updatePlanetControlsHTML(i, planetsArray) {
  return `<br/><label for="planet-size">Mass</label>
            <input 
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
            <input
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
            <input
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
  console.log("SHOW");
  adjustOffcanvasPosition();
  currentControlPlanet = planet;
  updateTextureControls(planet.textureCode, planet);
  const offcanvasElement = document.getElementById("offcanvas-planet-menu");
  const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
  const offCanvasBody = document.getElementById("offcanvas-body");
  if (offCanvasBody.lastElementChild.nodeName === "FORM") {
    offCanvasBody.removeChild(offCanvasBody.lastElementChild);
  }
  const form = document.createElement("form");
  form.innerHTML = updatePlanetControlsHTML(i, planetsArray);
  offCanvasBody.appendChild(form);
  addPlanetMenuStatListeners(i);
  updatePlanetOffcanvasHeader(planet);
  updatePlanetNameInput(planet);
  updatePlanetDescInput(planet);
  hideSystemMenu();
  bsOffcanvas.show();
}

const updatePlanetTexture = (index) => {
  const p = planetsArray.find((planet) => planet.controlsSelected);
  p.mesh.material = planetMaterials[index];
  p.textureCode = index + 1;
  planetMaterials[index].map.needsUpdate = true;
  console.log(`Updated planet texture: ${p.textureCode}`);
};

const updatePlanetOffcanvasHeader = (planet) => {
  if (planet.name !== "") {
    document.getElementById("offcanvas-title").innerHTML = planet.name;
    document.getElementById("planet-name-input").placeholder =
      "Name this planet...";
  } else {
    planet.name = planet.defaultName;
    document.getElementById("offcanvas-title").innerHTML = planet.defaultName;
  }
  updateSystemTable();
};

const updatePlanetDescInput = (planet) => {
  const planetDescInput = document.getElementById("planet-desc-input");

  const newInput = planetDescInput.cloneNode(true);
  planetDescInput.parentNode.replaceChild(newInput, planetDescInput);

  newInput.value = planet.desc ? planet.desc : "";
  newInput.placeholder = !planet.desc ? "Describe this planet..." : planet.desc;

  newInput.addEventListener("input", () => {
    planet.desc = newInput.value;
  });
};

const updatePlanetNameInput = (planet) => {
  const planetNameInput = document.getElementById("planet-name-input");

  const newInput = planetNameInput.cloneNode(true);
  planetNameInput.parentNode.replaceChild(newInput, planetNameInput);

  newInput.value = planet.name !== planet.defaultName ? planet.name : "";
  newInput.placeholder =
    planet.name === planet.defaultName ? "Name this planet..." : planet.name;

  newInput.addEventListener("input", () => {
    planet.name = newInput.value;
    updatePlanetOffcanvasHeader(planet);
  });
};

const hideSystemMenu = () => {
  const systemMenuoffcanvasElement = document.getElementById(
    "offcanvas-system-menu"
  );
  const systemMenuInstance = bootstrap.Offcanvas.getInstance(
    systemMenuoffcanvasElement
  );
  if (systemMenuInstance) systemMenuInstance.hide();
};

const hideControls = () => {
  console.log("Attempting to hide offcanvas");
  const offcanvasElement = document.getElementById("offcanvas-planet-menu");
  const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
  if (bsOffcanvas) {
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
