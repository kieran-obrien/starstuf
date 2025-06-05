import { scene } from "../core/three-setup";
import { updatePlanetListTable } from "../core/system-info-menu";

export default function handlePlanets(planets) {
  let planetCount = 0;
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
