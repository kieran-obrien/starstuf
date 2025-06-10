import * as THREE from "three";

const getPlanetGeometries = () => {
  const geometrySun = new THREE.SphereGeometry(10, 32, 32);
  const geometryPlanet = new THREE.SphereGeometry(4, 15, 15);
  return { geometrySun, geometryPlanet };
};

const { geometrySun, geometryPlanet } = getPlanetGeometries();

export { geometryPlanet, geometrySun };
