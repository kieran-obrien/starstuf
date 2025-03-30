import { planetsArray, planetMaterials } from "../main";

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

const updatePlanetTexture = (index) => {
  const p = planetsArray.find((planet) => planet.controlsSelected);
  p.mesh.material = planetMaterials[index];
  p.textureCode = index + 1;
  planetMaterials[index].map.needsUpdate = true;
  console.log(`Updated planet texture: ${p.textureCode}`);
};

const hideControls = () => {
  console.log("Attempting to hide offcanvas");
const offcanvasElement = document.getElementById("offcanvasExample");
if (offcanvasElement) {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
    bsOffcanvas.hide();
}
};

export { updatePlanetControlsHTML, updatePlanetTexture, hideControls };
