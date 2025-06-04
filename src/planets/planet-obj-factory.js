import { planetTextures } from "../core/texture-img-loader";
import { textureLoader } from "../core/three-setup";
import { geometryPlanet, geometrySun } from "../core/planets";
import planetMaterials from "./planet-material-factory";
import * as THREE from "three";
import { scene } from "../core/three-setup";
import Planet from "../classes/Planet";

async function createPlanets() {
  const planetsArray = Array(10).fill().map(initPlanetMesh);
  let distanceFromLast = 180;
  planetsArray[0].inOrbit = true;
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
  // Sun texture/material init here, to expand in future
  const sunTexture = textureLoader.load("./sun.jpg");
  const sunMaterial = new THREE.MeshPhongMaterial({ map: sunTexture });
  const sun = new THREE.Mesh(geometrySun, sunMaterial);
  sun.name = "sun";
  console.log(sun, "HELLO");

  // Add the initial sun
  scene.add(sun);
  sun.position.set(0, 0, 0);

  console.log("Planets created");
  console.log(planetsArray);
  return [planetsArray, sun];
}

function initPlanetMesh() {
  let planetMaterialInit = new THREE.MeshPhongMaterial({
    map: planetTextures[4][0],
  });
  return new Planet(
    1,
    0.000125,
    new THREE.Mesh(geometryPlanet, planetMaterialInit)
  );
}

export default createPlanets;
