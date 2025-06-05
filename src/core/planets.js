import * as THREE from "three";

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

const getPlanetGeometries = () => {
  const geometrySun = new THREE.SphereGeometry(10, 32, 32);
  const geometryPlanet = new THREE.SphereGeometry(4, 15, 15);
  return { geometrySun, geometryPlanet };
};

const { geometrySun, geometryPlanet } = getPlanetGeometries();

export { updatePlanetOrbitPosition, geometryPlanet, geometrySun };
