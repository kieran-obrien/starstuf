import { scene } from "../core/three-setup";
import { updateSystemTable } from "../system-menu/system-table";

const updatePlanetStats = (planets) => {
  // *TODO FUTURE WORK - EDIT THESE FUNCTIONS OUT OF GLOBAL SCOPE
  const updatePlanetSize = (index) => {
    updateSystemTable(planets);
    const size = document.getElementById(`planet-size-${index}`).value;
    planets[index].updatePlanetSize(size);
  };
  window.updatePlanetSize = updatePlanetSize;

  // Update planet orbit speed
  const updatePlanetSpeed = (index) => {
    updateSystemTable(planets);
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
};
