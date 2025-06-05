import { previewScene, previewRenderer, camera2 } from "./three-setup";
import { planetsArray } from "../main";

export default function updatePlanetPreviewScene() {
  previewScene.children = previewScene.children.filter((child) => {
    if (child.isMesh) {
      previewScene.remove(child);
      return false;
    }
    return true;
  });
  let previewPlanet;
  let selectedPlanet = planetsArray.find((p) => p.controlsSelected);
  if (selectedPlanet) {
    // Clone the mesh
    previewPlanet = selectedPlanet.mesh.clone();
  }
  if (previewPlanet) {
    previewPlanet.position.set(0, 0, 0);
    previewPlanet.scale.set(1.2, 1.2, 1.2);
    camera2.lookAt(previewPlanet.position);
    previewScene.add(previewPlanet);
  }
  previewRenderer.render(previewScene, camera2);
}
