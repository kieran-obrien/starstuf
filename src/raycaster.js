import * as THREE from "three";
import {
  planetsArray,
  scene,
  camera,
  renderer,
  isCameraHelio,
  setIsCameraHelio,
  showControls,
} from "./main";
import { hideControls } from "./controls/off-canvas-controls";

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
        if (p.uuid === intersectedObject.uuid) {
          console.log(`Selected ${p.name}`);
          setIsCameraHelio(false);
          p.cameraFollow = true;
          const index = planetsArray.indexOf(p);
          p.controlsSelected = true;
          showControls(p, index);
        } else {
          p.controlsSelected = false;
          p.cameraFollow = false;
        }
      }
      if (intersectedObject.name === "sun") hideControls(); // When sun clicked, close offcanvas
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

export { raycasterInit, updateRaycastSelectPlanetColor, };
