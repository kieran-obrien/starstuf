import * as THREE from "three";
import { planetsArray } from "../main";
import { scene, camera, renderer } from "./three-setup";
import { showControls, hideControls } from "../planet-menu/off-canvas-controls";
import { updatePlanetListTable } from "../system-menu/system-table";

const raycaster = new THREE.Raycaster();

const raycasterInit = () => {
  document.addEventListener("mousemove", hovering);

  function hovering(event) {
    const mouseCoords = new THREE.Vector2(
      (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouseCoords, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      for (let p of planetsArray) {
        if (p.uuid === intersectedObject.uuid) {
          p.raySelected = true;
        }
      }
    } else {
      for (let p of planetsArray) {
        p.raySelected = false;
      }
    }
  }

  document.addEventListener("mousedown", selecting);

  function selecting(event) {
    const mouseCoords = new THREE.Vector2(
      (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouseCoords, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      console.log(intersects);
      const intersectedObject = intersects[0].object;

      for (let p of planetsArray) {
        // Reset all for system info cam-focus value
        p.cameraFollow = false;
        p.controlsSelected = false;
      }

      for (let p of planetsArray) {
        if (p.uuid === intersectedObject.uuid) {
          console.log(`Selected ${p.name}`);
          p.cameraFollow = true;
          updatePlanetListTable(planetsArray);
          const index = planetsArray.indexOf(p);
          p.controlsSelected = true;
          showControls(p, index);
        } else {
          p.controlsSelected = false;
          p.cameraFollow = false;
        }
      }
      if (intersectedObject.name === "sun") {
        hideControls();
        updatePlanetListTable(planetsArray);
      }
    }
  }
};

const updateRaycastSelectPlanetColor = () => {
  const rColor = new THREE.Color(0xff0000);
  if (planetsArray) {
    for (let p of planetsArray) {
      if (p.raySelected) {
        p.mesh.material.color = rColor;
      } else {
        p.mesh.material.color = new THREE.Color(0xffffff);
      }
    }
  }
};

export { raycasterInit, updateRaycastSelectPlanetColor };
