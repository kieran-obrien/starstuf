import * as THREE from "three";
import { planetTextures } from "../core/texture-img-loader";

// Creates array for texture-selector
function initPlanetMaterials(counter, texturesArray) {
  return Array(texturesArray.length)
    .fill()
    .map(() => {
      let material = new THREE.MeshPhongMaterial({
        map: texturesArray[counter][0],
      });
      counter++;
      return material;
    });
}

const planetMaterials = initPlanetMaterials(0, planetTextures); // For texture select menu

export default planetMaterials;
