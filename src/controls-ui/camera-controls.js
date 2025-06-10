import { planetsArray } from "../main";
import { camera, renderer } from "../core/three-setup";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { hideControls } from "../planet-menu/off-canvas-controls";
import { updateSystemTable } from "../system-menu/system-table";

const initCameraControls = () => {
  // const controls = new OrbitControls(camera, renderer.domElement); Alternative controls
  const controls = new MapControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.03;
  controls.enablePan = false;
  return controls;
};

const isSetToPlanetCameraMode = () => {
  for (let p of planetsArray) {
    if (p.cameraFollow) {
      camera.lookAt(p.mesh.position);
    }
  }
};

function setToHelioCameraMode() {
  for (let p of planetsArray) {
    p.cameraFollow = false;
  }
  updateSystemTable(planetsArray);
  hideControls();
  camera.position.set(0, 0, 150);
  camera.lookAt(0, 0, 0);
}
const helioButton = document.getElementById("helio-button");
helioButton.addEventListener("click", setToHelioCameraMode);

function setToOrbitCameraMode() {
  for (let p of planetsArray) {
    p.cameraFollow = false;
  }
  updateSystemTable(planetsArray);
  hideControls();
  camera.position.set(0, 600, 0);
  camera.lookAt(0, 0, 0);
}
const orbitButton = document.getElementById("topdown-button");
orbitButton.addEventListener("click", setToOrbitCameraMode);

const controls = initCameraControls();

export { isSetToPlanetCameraMode, controls };
