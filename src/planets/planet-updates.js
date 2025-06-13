import { scene } from "../core/three-setup";
import { updateSystemTable } from "../system-menu/system-table";
import { planetsArray } from "../main";

const addPlanetMenuStatListeners = (i) => {
  console.log("IN STAT LISTENER FUNC");

  const sizeInput = document.getElementById(`planet-size-${i}`);
  sizeInput.addEventListener("input", () => {
    planetsArray[i].updatePlanetSize(sizeInput.value);
  });

  const orbitSpeedInput = document.getElementById(`orbit-speed-${i}`);
  orbitSpeedInput.addEventListener("input", () => {
    planetsArray[i].updatePlanetSpeed(orbitSpeedInput.value);
  });

  const spinInput = document.getElementById(`planet-spin-${i}`);
  spinInput.addEventListener("input", () => {
    planetsArray[i].updatePlanetSpinSpeed(spinInput.value);
  });

  const distanceInput = document.getElementById(`planet-distance-${i}`);
  distanceInput.addEventListener("input", () => {
    if (planetsArray[i].inOrbit) {
      scene.remove(planetsArray[i].orbitPath);
      planetsArray[i].updatePlanetDistance(distanceInput.value);
      scene.add(planetsArray[i].orbitPath);
    } else planetsArray[i].updatePlanetDistance(distanceInput.value);
  });
};

const updatePlanetsInScene = (planets) => {
  let planetCount = document.getElementById("planet-count").value;
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
};

const updatePlanetOrbitPosition = (planetsArray, sun) => {
  const currentTime = Date.now();
  planetsArray.forEach((p) => {
    // Calculate the change in angle based on the speed and elapsed time
    const deltaAngle = (currentTime - p.lastUpdateTime) * p.speed;
    p.currentAngle += deltaAngle;
    p.lastUpdateTime = currentTime;

    // Set the new position based on the current angle
    p.mesh.position.set(
      Math.cos(p.currentAngle) * p.distance,
      0,
      Math.sin(p.currentAngle) * p.distance
    );
    // Rotate the planet
    p.mesh.rotation.y += p.spinSpeed;
  });
  sun.rotation.y += 0.0005; // Sun rotation
};

const updatePlanetDistanceWhilePaused = (planetsArray) => {
  planetsArray.forEach((p) => {
    p.mesh.position.set(
      Math.cos(p.currentAngle) * p.distance,
      0,
      Math.sin(p.currentAngle) * p.distance
    );
  });
};

export {
  updatePlanetStats,
  updatePlanetOrbitPosition,
  updatePlanetsInScene,
  updatePlanetDistanceWhilePaused,
  addPlanetMenuStatListeners,
};
